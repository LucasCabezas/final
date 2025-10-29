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

    @transaction.atomic
    def put(self, request, pk):
        insumo = self.get_object(pk)
        if not insumo:
            return Response({'error': 'Insumo no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # 🔥 NUEVO: Guardar valores anteriores para comparar
        nombre_anterior = insumo.Insumo_nombre
        unidad_anterior = insumo.Insumo_unidad_medida

        serializer = InsumoSerializer(insumo, data=request.data)
        if serializer.is_valid():
            insumo_actualizado = serializer.save()
            
            # 🔥 NUEVO: Si cambió la unidad de medida, actualizar en todas las prendas
            if unidad_anterior != insumo_actualizado.Insumo_unidad_medida:
                InsumosXPrendas.objects.filter(insumo=insumo_actualizado).update(
                    Insumo_prenda_unidad_medida=insumo_actualizado.Insumo_unidad_medida
                )
                print(f"✅ Unidad de medida actualizada de '{unidad_anterior}' a '{insumo_actualizado.Insumo_unidad_medida}' en todas las prendas")
            
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
    Asocia Marca, Modelo y Color existentes en base al nombre recibido.
    Si no existen, lanza error (no los crea).
    """
    from clasificaciones.models import Marca, Modelo, Color

    # Marca
    if 'Prenda_marca' in data and data['Prenda_marca']:
        try:
            marca = Marca.objects.get(Marca_nombre__iexact=data['Prenda_marca'].strip())
            data['Prenda_marca'] = marca.Marca_ID
        except Marca.DoesNotExist:
            raise ValueError(f"La marca '{data['Prenda_marca']}' no existe.")

    # Modelo
    if 'Prenda_modelo' in data and data['Prenda_modelo']:
        try:
            modelo = Modelo.objects.get(Modelo_nombre__iexact=data['Prenda_modelo'].strip())
            data['Prenda_modelo'] = modelo.Modelo_ID
        except Modelo.DoesNotExist:
            raise ValueError(f"El modelo '{data['Prenda_modelo']}' no existe.")

    # Color
    if 'Prenda_color' in data and data['Prenda_color']:
        try:
            color = Color.objects.get(Color_nombre__iexact=data['Prenda_color'].strip())
            data['Prenda_color'] = color.Color_ID
        except Color.DoesNotExist:
            raise ValueError(f"El color '{data['Prenda_color']}' no existe.")

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
            insumos_raw = data.get('insumos_prendas')
            # Verificar si es string o ya es lista
            if isinstance(insumos_raw, str):
                try:
                    insumos_data = json.loads(insumos_raw)
                except json.JSONDecodeError:
                    return Response({'error': 'Error al decodificar insumos_prendas'}, status=status.HTTP_400_BAD_REQUEST)
            elif isinstance(insumos_raw, list):
                insumos_data = insumos_raw
            else:
                return Response({'error': 'Formato inválido para insumos_prendas'}, status=status.HTTP_400_BAD_REQUEST)

        # Decodificar talles
        if data.get('talles'):
            talles_raw = data.get('talles')
            # Verificar si es string o ya es lista
            if isinstance(talles_raw, str):
                try:
                    talles_data = json.loads(talles_raw)
                    print("Talles recibidos:", talles_data)
                except json.JSONDecodeError:
                    return Response({'error': 'Error al decodificar talles'}, status=status.HTTP_400_BAD_REQUEST)
            elif isinstance(talles_raw, list):
                talles_data = talles_raw
                print("Talles recibidos:", talles_data)
            else:
                return Response({'error': 'Formato inválido para talles'}, status=status.HTTP_400_BAD_REQUEST)

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


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from pedidos.models import DetallePedido
from .models import Prenda
from .serializers import PrendaSerializer


class PrendaDetail(APIView):
    """Ver, editar o eliminar una prenda"""

    def get(self, request, pk):
        prenda = get_object_or_404(Prenda, pk=pk)
        serializer = PrendaSerializer(prenda)
        return Response(serializer.data)

    def put(self, request, pk):
        prenda = get_object_or_404(Prenda, pk=pk)
        serializer = PrendaSerializer(prenda, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Evita eliminar una prenda que ya fue usada en algún pedido"""
        try:
            prenda = get_object_or_404(Prenda, pk=pk)

            # 🔍 Verificar si la prenda está en algún DetallePedido
            usada = DetallePedido.objects.filter(prenda=prenda).exists()

            if usada:
                return Response(
                    {
                        "error": f"No se puede eliminar la prenda '{prenda.Prenda_nombre}' porque ya fue utilizada en pedidos.",
                        "tipo": "prenda_en_uso",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ✅ Si no está usada, eliminar normalmente
            prenda.delete()
            return Response(
                {"mensaje": f"Prenda '{prenda.Prenda_nombre}' eliminada correctamente."},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            print(f"❌ Error al eliminar prenda: {e}")
            return Response(
                {"error": f"Error interno al eliminar la prenda: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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