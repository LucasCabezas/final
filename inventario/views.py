from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import api_view
from django.db import transaction

import json

from .models import Insumo, Prenda, InsumosXPrendas, AlertaStock
from .serializers import InsumoSerializer, PrendaSerializer, AlertaStockSerializer

# ------------------------ INSUMOS ----------------------------

class InsumoList(APIView):
    """Listar y crear insumos"""
    def get(self, request):
        try:
            insumos = Insumo.objects.all()
            serializer = InsumoSerializer(insumos, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = InsumoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🔥 NUEVO: Verificar si un insumo está en uso
@api_view(['GET'])
def verificar_uso_insumo(request, pk):
    """
    Verifica si un insumo está siendo usado por alguna prenda.
    Devuelve la lista de prendas que lo usan.
    """
    try:
        insumo = Insumo.objects.get(pk=pk)
    except Insumo.DoesNotExist:
        return Response(
            {'error': 'Insumo no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Buscar todas las prendas que usan este insumo
    relaciones = InsumosXPrendas.objects.filter(insumo=insumo).select_related('prenda')
    
    if relaciones.exists():
        prendas_usando = [
            {
                'id': rel.prenda.Prenda_ID,
                'nombre': rel.prenda.Prenda_nombre,
                'cantidad_usada': rel.Insumo_prenda_cantidad_utilizada,
                'unidad': rel.Insumo_prenda_unidad_medida
            }
            for rel in relaciones
        ]
        
        return Response({
            'en_uso': True,
            'total_prendas': len(prendas_usando),
            'prendas': prendas_usando
        })
    
    return Response({
        'en_uso': False,
        'total_prendas': 0,
        'prendas': []
    })


class InsumoDetail(APIView):
    """Obtener, actualizar o eliminar un insumo"""
    def get_object(self, pk):
        try:
            return Insumo.objects.get(pk=pk)
        except Insumo.DoesNotExist:
            return None

    def get(self, request, pk):
        insumo = self.get_object(pk)
        if not insumo:
            return Response({'error': 'Insumo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return Response(InsumoSerializer(insumo).data)

    def put(self, request, pk):
        insumo = self.get_object(pk)
        if not insumo:
            return Response({'error': 'Insumo no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = InsumoSerializer(insumo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        insumo = self.get_object(pk)
        if not insumo:
            return Response({'error': 'Insumo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        insumo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================================
# ---------------------- ALERTAS DE STOCK --------------------
# ============================================================

class AlertaStockList(APIView):
    """Listar alertas de bajo stock activas"""
    def get(self, request):
        try:
            alertas = AlertaStock.objects.filter(estado='activa').order_by('-fecha_creacion')
            serializer = AlertaStockSerializer(alertas, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
def obtener_insumos_bajo_stock(request):
    """Obtener todos los insumos que están bajo stock"""
    try:
        from django.db.models import F
        insumos_bajo_stock = Insumo.objects.filter(
            Insumo_cantidad__lte=F('Insumo_cantidad_minima')
        )
        serializer = InsumoSerializer(insumos_bajo_stock, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ============================================================
# ------------------------ PRENDAS ----------------------------
# ============================================================

def procesar_clasificaciones(data):
    """
    Busca o crea Marca, Modelo y Color basándose en los nombres enviados,
    y reemplaza los nombres con IDs en el diccionario de datos.
    """
    from clasificaciones.models import Marca, Modelo, Color
    
    # Procesar Marca
    if 'Prenda_marca' in data and data['Prenda_marca']:
        marca_nombre = str(data['Prenda_marca']).strip()
        if marca_nombre:
            marca, created = Marca.objects.get_or_create(Marca_nombre=marca_nombre)
            data['Prenda_marca'] = marca.Marca_ID
            print(f"Marca {'creada' if created else 'encontrada'}: {marca_nombre} (ID: {marca.Marca_ID})")
    
    # Procesar Modelo
    if 'Prenda_modelo' in data and data['Prenda_modelo']:
        modelo_nombre = str(data['Prenda_modelo']).strip()
        if modelo_nombre:
            modelo, created = Modelo.objects.get_or_create(Modelo_nombre=modelo_nombre)
            data['Prenda_modelo'] = modelo.Modelo_ID
            print(f"Modelo {'creado' if created else 'encontrado'}: {modelo_nombre} (ID: {modelo.Modelo_ID})")
    
    # Procesar Color
    if 'Prenda_color' in data and data['Prenda_color']:
        color_nombre = str(data['Prenda_color']).strip()
        if color_nombre:
            color, created = Color.objects.get_or_create(Color_nombre=color_nombre)
            data['Prenda_color'] = color.Color_ID
            print(f"Color {'creado' if created else 'encontrado'}: {color_nombre} (ID: {color.Color_ID})")
    
    return data


class PrendaList(APIView):
    """Listar y crear prendas con sus insumos y talles"""
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        try:
            prendas = Prenda.objects.all()
            serializer = PrendaSerializer(prendas, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @transaction.atomic
    def post(self, request):
        data = request.data.copy()
        insumos_data = []
        talles_data = []

        # Decodificar insumos
        if data.get('insumos_prendas'):
            try:
                insumos_data = json.loads(data.get('insumos_prendas'))
            except json.JSONDecodeError:
                return Response({'error': 'Error al decodificar insumos_prendas'}, status=status.HTTP_400_BAD_REQUEST)

        # Decodificar talles
        if data.get('talles'):
            try:
                talles_data = json.loads(data.get('talles'))
                print("Talles recibidos:", talles_data)
            except json.JSONDecodeError:
                return Response({'error': 'Error al decodificar talles'}, status=status.HTTP_400_BAD_REQUEST)

        # Convertir nombres a IDs
        try:
            data = procesar_clasificaciones(data)
        except Exception as e:
            return Response(
                {'error': f'Error al procesar clasificaciones: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear la prenda base
        serializer = PrendaSerializer(data=data, context={'request': request})
        if not serializer.is_valid():
            print("Errores del serializer:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        prenda = serializer.save()

        # Crear las relaciones InsumosXPrendas
        for item in insumos_data:
            try:
                insumo_id = int(item.get('insumo'))
                cantidad = float(item.get('cantidad'))
                insumo = Insumo.objects.get(pk=insumo_id)

                InsumosXPrendas.objects.create(
                    insumo=insumo,
                    prenda=prenda,
                    Insumo_prenda_cantidad_utilizada=cantidad,
                    Insumo_prenda_unidad_medida=insumo.Insumo_unidad_medida,
                    Insumo_prenda_costo_total=cantidad * insumo.Insumo_precio_unitario
                )
            except Exception as e:
                print(f"Error creando insumo: {e}")
                continue

        # Crear las relaciones TallesXPrendas
        from clasificaciones.models import Talle, TallesXPrendas
        for talle_codigo in talles_data:
            try:
                talle, created = Talle.objects.get_or_create(Talle_codigo=talle_codigo)
                TallesXPrendas.objects.create(
                    talle=talle,
                    prenda=prenda,
                    stock=0
                )
                print(f"Talle {'creado' if created else 'asociado'}: {talle_codigo}")
            except Exception as e:
                print(f"Error creando talle: {e}")
                continue

        return Response(PrendaSerializer(prenda, context={'request': request}).data, status=status.HTTP_201_CREATED)


class PrendaDetail(APIView):
    """Detalle, actualización o eliminación de una prenda"""
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self, pk):
        try:
            return Prenda.objects.get(pk=pk)
        except Prenda.DoesNotExist:
            return None

    def get(self, request, pk):
        prenda = self.get_object(pk)
        if not prenda:
            return Response({'error': 'Prenda no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        data = PrendaSerializer(prenda, context={'request': request}).data
        relaciones = InsumosXPrendas.objects.filter(prenda=prenda).select_related('insumo')

        data["insumos_prendas"] = [
            {
                "Insumo_ID": r.insumo.Insumo_ID,
                "Insumo_nombre": r.insumo.Insumo_nombre,
                "Insumo_prenda_cantidad_utilizada": r.Insumo_prenda_cantidad_utilizada,
                "Insumo_prenda_unidad_medida": r.Insumo_prenda_unidad_medida,
                "Insumo_prenda_costo_total": r.Insumo_prenda_costo_total,
            }
            for r in relaciones
        ]
        return Response(data)

    @transaction.atomic
    def put(self, request, pk):
        prenda = self.get_object(pk)
        if not prenda:
            return Response({'error': 'Prenda no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        insumos_data = []
        talles_data = []

        # Decodificar insumos_prendas
        if data.get('insumos_prendas'):
            try:
                insumos_data = json.loads(data.get('insumos_prendas'))
            except json.JSONDecodeError:
                return Response({'error': 'Error al decodificar insumos_prendas'}, status=status.HTTP_400_BAD_REQUEST)

        # Decodificar talles
        if data.get('talles'):
            try:
                talles_data = json.loads(data.get('talles'))
                print("Talles recibidos para actualizar:", talles_data)
            except json.JSONDecodeError:
                return Response({'error': 'Error al decodificar talles'}, status=status.HTTP_400_BAD_REQUEST)

        # Convertir nombres a IDs
        try:
            data = procesar_clasificaciones(data)
        except Exception as e:
            return Response(
                {'error': f'Error al procesar clasificaciones: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Actualizar prenda
        serializer = PrendaSerializer(prenda, data=data, context={'request': request})
        if not serializer.is_valid():
            print("Errores del serializer:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        prenda = serializer.save()

        # Limpiar y recrear relaciones de insumos
        InsumosXPrendas.objects.filter(prenda=prenda).delete()
        for item in insumos_data:
            try:
                insumo_id = int(item.get('insumo'))
                cantidad = float(item.get('cantidad'))
                insumo = Insumo.objects.get(pk=insumo_id)

                InsumosXPrendas.objects.create(
                    insumo=insumo,
                    prenda=prenda,
                    Insumo_prenda_cantidad_utilizada=cantidad,
                    Insumo_prenda_unidad_medida=insumo.Insumo_unidad_medida,
                    Insumo_prenda_costo_total=cantidad * insumo.Insumo_precio_unitario
                )
            except Exception as e:
                print(f"Error actualizando insumo: {e}")
                continue

        # Limpiar y recrear relaciones de talles
        from clasificaciones.models import Talle, TallesXPrendas
        TallesXPrendas.objects.filter(prenda=prenda).delete()
        for talle_codigo in talles_data:
            try:
                talle, created = Talle.objects.get_or_create(Talle_codigo=talle_codigo)
                TallesXPrendas.objects.create(
                    talle=talle,
                    prenda=prenda,
                    stock=0
                )
                print(f"Talle {'creado' if created else 'actualizado'}: {talle_codigo}")
            except Exception as e:
                print(f"Error actualizando talle: {e}")
                continue

        return Response(PrendaSerializer(prenda, context={'request': request}).data)

    @transaction.atomic
    def delete(self, request, pk):
        prenda = self.get_object(pk)
        if not prenda:
            return Response({'error': 'Prenda no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        from clasificaciones.models import TallesXPrendas
        TallesXPrendas.objects.filter(prenda=prenda).delete()
        InsumosXPrendas.objects.filter(prenda=prenda).delete()
        prenda.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================================
# -------- CONFIRMAR PEDIDO Y ACTUALIZAR STOCK ---------------
# ============================================================

class ConfirmarPedidoView(APIView):
    """
    Confirma un pedido: descuenta del stock los insumos
    necesarios según la cantidad de prendas pedidas.
    """
    @transaction.atomic
    def post(self, request):
        try:
            prendas = request.data.get('prendas', [])
            if not prendas:
                return Response(
                    {'error': 'No se enviaron prendas en la solicitud.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            resumen_actualizacion = []

            for p in prendas:
                prenda_id = p.get('id_prenda')
                cantidad_pedida = float(p.get('cantidad', 0))

                if not prenda_id or cantidad_pedida <= 0:
                    continue

                try:
                    prenda = Prenda.objects.get(pk=prenda_id)
                except Prenda.DoesNotExist:
                    return Response(
                        {'error': f'La prenda con ID {prenda_id} no existe.'},
                        status=status.HTTP_404_NOT_FOUND
                    )

                insumos_relacionados = InsumosXPrendas.objects.filter(prenda=prenda).select_related('insumo')

                for rel in insumos_relacionados:
                    insumo = rel.insumo
                    cantidad_total = rel.Insumo_prenda_cantidad_utilizada * cantidad_pedida

                    if insumo.Insumo_cantidad < cantidad_total:
                        transaction.set_rollback(True)
                        return Response(
                            {
                                'error': f'Stock insuficiente del insumo: {insumo.Insumo_nombre}',
                                'stock_actual': insumo.Insumo_cantidad,
                                'requerido': cantidad_total
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    insumo.Insumo_cantidad -= cantidad_total
                    insumo.save()

                    resumen_actualizacion.append({
                        'insumo': insumo.Insumo_nombre,
                        'cantidad_descontada': cantidad_total,
                        'stock_restante': insumo.Insumo_cantidad
                    })

            return Response(
                {
                    'mensaje': 'Pedido confirmado y stock actualizado correctamente.',
                    'detalle': resumen_actualizacion
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            transaction.set_rollback(True)
            return Response(
                {'error': f'Error al confirmar pedido: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )