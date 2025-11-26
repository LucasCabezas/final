# inventario/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import api_view
from django.db import transaction
# 🔥 Importamos Sum y F para la lógica del modelo
from django.db.models import Sum, F, Q
from django.shortcuts import get_object_or_404
import json

from .models import Insumo, Prenda, InsumosXPrendas, AlertaStock, UnidadMedida, TipoInsumo
from clasificaciones.models import Talle, TallesXPrendas, Marca, Modelo, Color

from .serializers import (
    InsumoSerializer, 
    PrendaSerializer, 
    AlertaStockSerializer, 
    UnidadMedidaSerializer, 
    TipoInsumoSerializer
)
from pedidos.models import DetallePedido

# ===========================================================
# 🔹 VERIFICAR STOCK PARA PEDIDOS
# ===========================================================
@api_view(["POST"])
def verificar_stock(request):
    """
    Verifica si hay stock suficiente de insumos antes de crear un pedido.
    """
    try:
        prendas = request.data.get("prendas", [])
        if not prendas:
            return Response(
                {"error": "No se enviaron prendas."},
                status=status.HTTP_400_BAD_REQUEST
            )

        insumos_insuficientes = []

        for item in prendas:
            prenda_id = item.get("id_prenda")
            cantidad = int(item.get("cantidad", 0))
            if not prenda_id or cantidad <= 0:
                continue

            try:
                prenda = Prenda.objects.get(pk=prenda_id)
            except Prenda.DoesNotExist:
                return Response(
                    {"error": f"Prenda ID {prenda_id} no encontrada."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            for rel in InsumosXPrendas.objects.filter(prenda=prenda):
                insumo = rel.insumo
                cantidad_necesaria = float(rel.Insumo_prenda_cantidad_utilizada) * float(cantidad)
                stock_disponible = float(insumo.Insumo_cantidad)

                if stock_disponible < cantidad_necesaria:
                    insumos_insuficientes.append({
                        "nombre": insumo.Insumo_nombre,
                        "disponible": stock_disponible,
                        "requerido": cantidad_necesaria,
                        "faltante": round(cantidad_necesaria - stock_disponible, 2),
                        "unidad": getattr(insumo.unidad_medida, "nombre", "")
                    })

        if insumos_insuficientes:
            return Response(
                {"insumos_insuficientes": insumos_insuficientes},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"mensaje": "✅ Stock suficiente para todas las prendas."}, status=status.HTTP_200_OK)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ===========================================================
# 🔹 INSUMOS - LISTAR / CREAR
# ===========================================================
class InsumoList(APIView):
    """Listar y crear insumos"""
    def get(self, request):
        try:
            insumos = Insumo.objects.select_related('unidad_medida', 'tipo_insumo').all()
            serializer = InsumoSerializer(insumos, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            serializer = InsumoSerializer(data=request.data)
            if serializer.is_valid():
                # El save() del modelo se encarga del precio total y del recálculo (si aplica)
                serializer.save() 
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ===========================================================
# 🔹 INSUMOS - DETALLE / EDITAR / ELIMINAR
# ===========================================================
class InsumoDetail(APIView):
    def get_object(self, pk, lock=False):
        try:
            query = Insumo.objects.select_related('unidad_medida', 'tipo_insumo')
            if lock:
                # Solo aplica select_for_update si se pide explícitamente (ej: en PUT)
                query = query.select_for_update()
            return query.get(pk=pk)
        except Insumo.DoesNotExist:
            return None

    def get(self, request, pk):
        insumo = self.get_object(pk)
        if not insumo:
            return Response({'error': 'Insumo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return Response(InsumoSerializer(insumo).data)

    @transaction.atomic
    def put(self, request, pk):
        # Usamos get_object con lock=True dentro de la transacción
        insumo = self.get_object(pk, lock=True) 
        if not insumo:
            return Response({'error': 'Insumo no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        unidad_anterior = insumo.unidad_medida_id
        
        # 🔥 Modificar la data para asegurar que el precio unitario se envíe con punto
        data = request.data.copy()
        precio_unitario_raw = data.get('Insumo_precio_unitario')
        if precio_unitario_raw is not None:
             # Reemplazar coma por punto para el parseo de float
            data['Insumo_precio_unitario'] = str(precio_unitario_raw).replace(',', '.')
        
        serializer = InsumoSerializer(insumo, data=data)
        
        if serializer.is_valid():
            # El save() del modelo Insumo ahora maneja:
            # 1. El cálculo de Insumo_precio_total
            # 2. El recálculo de Prenda_costo_total_produccion para prendas relacionadas
            insumo_actualizado = serializer.save()

            # Asegurar que la unidad de medida se actualice en la relación InsumosXPrendas
            if unidad_anterior != insumo_actualizado.unidad_medida_id:
                InsumosXPrendas.objects.filter(insumo=insumo_actualizado).update(
                    Insumo_prenda_unidad_medida=insumo_actualizado.unidad_medida.nombre
                )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic # ✅ Añadimos @transaction.atomic para la eliminación segura
    def delete(self, request, pk):
        # Usamos get_object sin lock para obtener el objeto a eliminar
        insumo = self.get_object(pk)
        if not insumo:
            return Response({'error': 'Insumo no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if InsumosXPrendas.objects.filter(insumo=insumo).exists():
            return Response(
                {'error': 'No se puede eliminar el insumo porque está siendo usado en prendas'},
                status=status.HTTP_400_BAD_REQUEST
            )

        insumo.delete()
        return Response({'mensaje': 'Insumo eliminado correctamente'}, status=status.HTTP_200_OK)


# ===========================================================
# 🔹 UNIDADES Y TIPOS DE INSUMO
# ===========================================================
class UnidadMedidaList(APIView):
    """Listar unidades de medida"""
    def get(self, request):
        unidades = UnidadMedida.objects.all()
        serializer = UnidadMedidaSerializer(unidades, many=True)
        return Response(serializer.data)


class TipoInsumoList(APIView):
    """Listar tipos de insumo"""
    def get(self, request):
        tipos = TipoInsumo.objects.all()
        serializer = TipoInsumoSerializer(tipos, many=True)
        return Response(serializer.data)


# ===========================================================
# 🔹 VERIFICAR USO DE INSUMO
# ===========================================================
@api_view(['GET'])
def verificar_uso_insumo(request, pk):
    try:
        insumo = Insumo.objects.get(pk=pk)
    except Insumo.DoesNotExist:
        return Response({'error': 'Insumo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
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
    
    return Response({'en_uso': False, 'total_prendas': 0, 'prendas': []})


# ===========================================================
# 🔹 ALERTAS DE STOCK
# ===========================================================
class AlertaStockList(APIView):
    def get(self, request):
        try:
            alertas = AlertaStock.objects.filter(estado='activa').order_by('-fecha_creacion')
            serializer = AlertaStockSerializer(alertas, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def obtener_insumos_bajo_stock(request):
    try:
        insumos_bajo_stock = Insumo.objects.filter(Insumo_cantidad__lte=F('Insumo_cantidad_minima'))
        serializer = InsumoSerializer(insumos_bajo_stock, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ===========================================================
# 🔹 HELPER: PROCESAR CLASIFICACIONES
# ===========================================================
def procesar_clasificaciones(data):
    """
    Asegura que Marca, Modelo y Color se asocien correctamente por ID
    """
    # MARCA
    if 'Prenda_marca' in data and data['Prenda_marca']:
        valor = str(data['Prenda_marca']).strip()
        if valor.isdigit():
            try:
                marca = Marca.objects.get(pk=int(valor))
                data['Prenda_marca'] = marca.Marca_ID
            except Marca.DoesNotExist:
                raise ValueError(f"La marca con ID {valor} no existe")
        else:
            marca, _ = Marca.objects.get_or_create(
                Marca_nombre__iexact=valor,
                defaults={'Marca_nombre': valor}
            )
            data['Prenda_marca'] = marca.Marca_ID

    # MODELO
    if 'Prenda_modelo' in data and data['Prenda_modelo']:
        valor = str(data['Prenda_modelo']).strip()
        if valor.isdigit():
            try:
                modelo = Modelo.objects.get(pk=int(valor))
                data['Prenda_modelo'] = modelo.Modelo_ID
            except Modelo.DoesNotExist:
                raise ValueError(f"El modelo con ID {valor} no existe")
        else:
            modelo, _ = Modelo.objects.get_or_create(
                Modelo_nombre__iexact=valor,
                defaults={'Modelo_nombre': valor}
            )
            data['Prenda_modelo'] = modelo.Modelo_ID

    # COLOR
    if 'Prenda_color' in data and data['Prenda_color']:
        valor = str(data['Prenda_color']).strip()
        if valor.isdigit():
            try:
                color = Color.objects.get(pk=int(valor))
                data['Prenda_color'] = color.Color_ID
            except Color.DoesNotExist:
                raise ValueError(f"El color con ID {valor} no existe")
        else:
            color, _ = Color.objects.get_or_create(
                Color_nombre__iexact=valor,
                defaults={'Color_nombre': valor}
            )
            data['Prenda_color'] = color.Color_ID

    return data


# ===========================================================
# 🔹 PRENDAS - LISTAR / CREAR CON BÚSQUEDA Y FILTROS
# ===========================================================
class PrendaList(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        """Listar todas las prendas con sus relaciones"""
        try:
            prendas = Prenda.objects.select_related(
                'Prenda_marca',
                'Prenda_modelo',
                'Prenda_color'
            ).prefetch_related('insumos_prendas__insumo').all()
            
            serializer = PrendaSerializer(prendas, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Error al obtener prendas: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @transaction.atomic
    def post(self, request):
        """Crear nueva prenda con insumos y talles"""
        try:
            print("🔥 Datos recibidos:", request.data)
            
            data = request.data.copy()
            
            # Extraer insumos y talles del request
            insumos_data = data.pop('insumos_prendas', None)
            talles_data = data.pop('talles', None)
            
            print("📋 Insumos antes de parsear:", insumos_data, type(insumos_data))
            print("📋 Talles antes de parsear:", talles_data, type(talles_data))
            
            # ✅ PARSEAR JSON si vienen como string
            # Django a veces envuelve el JSON string en una lista
            if isinstance(insumos_data, list) and len(insumos_data) > 0:
                insumos_data = insumos_data[0]  # Extraer el primer elemento
            
            if isinstance(insumos_data, str):
                try:
                    insumos_data = json.loads(insumos_data) if insumos_data.strip() else []
                except json.JSONDecodeError as e:
                    return Response(
                        {'error': f'Error al parsear insumos_prendas: {str(e)}'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Hacer lo mismo con talles_data
            if isinstance(talles_data, list) and len(talles_data) > 0:
                talles_data = talles_data[0]  # Extraer el primer elemento
            
            if isinstance(talles_data, str):
                try:
                    talles_data = json.loads(talles_data) if talles_data.strip() else []
                except json.JSONDecodeError as e:
                    return Response(
                        {'error': f'Error al parsear talles: {str(e)}'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            print("✅ Insumos después de parsear:", insumos_data, type(insumos_data))
            print("✅ Talles después de parsear:", talles_data, type(talles_data))
            
            # ✅ Asegurar que insumos_data sea una lista
            if not isinstance(insumos_data, list):
                return Response(
                    {'error': 'insumos_prendas debe ser una lista'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar que haya insumos y talles
            if not insumos_data or len(insumos_data) == 0:
                return Response(
                    {'error': 'Debe proporcionar al menos un insumo'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not talles_data or len(talles_data) == 0:
                return Response(
                    {'error': 'Debe proporcionar al menos un talle'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Procesar clasificaciones (marca, modelo, color)
            data = procesar_clasificaciones(data)

            # Crear prenda base
            serializer = PrendaSerializer(data=data, context={'request': request})
            if not serializer.is_valid():
                print("❌ Errores de validación:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            prenda = serializer.save()
            print("✅ Prenda creada:", prenda.Prenda_ID)

            # Crear relaciones con insumos
            costo_insumos_total = 0
            for item in insumos_data:
                print("🔹 Procesando insumo:", item, type(item))
                
                # ✅ Validar que item sea un diccionario
                if not isinstance(item, dict):
                    prenda.delete()
                    return Response(
                        {'error': f'Formato inválido para insumo. Se esperaba un diccionario pero se recibió: {type(item).__name__}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                insumo_id = int(item.get('insumo'))
                cantidad = float(item.get('cantidad'))
                
                try:
                    insumo = Insumo.objects.get(pk=insumo_id)
                except Insumo.DoesNotExist:
                    prenda.delete()  # Rollback manual
                    return Response(
                        {'error': f'Insumo con ID {insumo_id} no encontrado'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                costo_total_insumo = cantidad * insumo.Insumo_precio_unitario

                InsumosXPrendas.objects.create(
                    insumo=insumo,
                    prenda=prenda,
                    Insumo_prenda_cantidad_utilizada=cantidad,
                    Insumo_prenda_unidad_medida=insumo.unidad_medida.nombre if insumo.unidad_medida else "",
                    Insumo_prenda_costo_total=costo_total_insumo
                )
                
                costo_insumos_total += costo_total_insumo
                print(f"✅ Insumo {insumo.Insumo_nombre} agregado")

            # Crear relaciones con talles
            for codigo in talles_data:
                print(f"🔹 Procesando talle: {codigo}")
                talle, _ = Talle.objects.get_or_create(Talle_codigo=codigo)
                TallesXPrendas.objects.create(talle=talle, prenda=prenda, stock=0)
                print(f"✅ Talle {codigo} agregado")

            # Calcular costo total de producción
            precio_confeccion = float(data.get('Prenda_precio_unitario', 0))
            costo_total = costo_insumos_total + precio_confeccion

            prenda.Prenda_costo_total_produccion = costo_total
            prenda.Prenda_precio_unitario = precio_confeccion
            prenda.save()
            
            print("✅ Prenda guardada con costo total:", costo_total)

            return Response(
                PrendaSerializer(prenda, context={'request': request}).data, 
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Error al crear prenda: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ===========================================================
# 🔹 PRENDAS - DETALLE / EDITAR / ELIMINAR
# ===========================================================
class PrendaDetail(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, pk):
        """Obtener detalle de una prenda"""
        try:
            prenda = get_object_or_404(Prenda, pk=pk)
            serializer = PrendaSerializer(prenda, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': f'Error al obtener prenda: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @transaction.atomic
    def put(self, request, pk):
        """Actualizar prenda existente"""
        try:
            print("📝 Actualizando prenda:", pk)
            print("🔥 Datos recibidos:", request.data)
            
            prenda = get_object_or_404(Prenda, pk=pk)
            
            data = request.data.copy()
            
            # Extraer insumos y talles
            insumos_data = data.pop('insumos_prendas', None)
            talles_data = data.pop('talles', None)
            
            # ✅ PARSEAR JSON si vienen como string
            # Django a veces envuelve el JSON string en una lista
            if isinstance(insumos_data, list) and len(insumos_data) > 0:
                insumos_data = insumos_data[0]  # Extraer el primer elemento
            
            if isinstance(insumos_data, str):
                try:
                    insumos_data = json.loads(insumos_data) if insumos_data.strip() else None
                except json.JSONDecodeError as e:
                    return Response(
                        {'error': f'Error al parsear insumos_prendas: {str(e)}'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Hacer lo mismo con talles_data
            if isinstance(talles_data, list) and len(talles_data) > 0:
                talles_data = talles_data[0]  # Extraer el primer elemento
            
            if isinstance(talles_data, str):
                try:
                    talles_data = json.loads(talles_data) if talles_data.strip() else None
                except json.JSONDecodeError as e:
                    return Response(
                        {'error': f'Error al parsear talles: {str(e)}'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Procesar clasificaciones
            try:
                data = procesar_clasificaciones(data)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            # Actualizar datos base
            serializer = PrendaSerializer(prenda, data=data, partial=True, context={'request': request})
            if not serializer.is_valid():
                print("❌ Errores de validación:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            prenda = serializer.save()

            # Actualizar insumos si se enviaron
            if insumos_data is not None:
                # ✅ Asegurar que insumos_data sea una lista
                if not isinstance(insumos_data, list):
                    return Response(
                        {'error': 'insumos_prendas debe ser una lista'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                prenda.insumos_prendas.all().delete()
                costo_insumos_total = 0
                
                for item in insumos_data:
                    # ✅ Validar que item sea un diccionario
                    if not isinstance(item, dict):
                        return Response(
                            {'error': f'Formato inválido para insumo. Se esperaba un diccionario pero se recibió: {type(item).__name__}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    insumo_id = int(item.get('insumo'))
                    cantidad = float(item.get('cantidad'))
                    
                    try:
                        insumo = Insumo.objects.get(pk=insumo_id)
                    except Insumo.DoesNotExist:
                        return Response(
                            {'error': f'Insumo con ID {insumo_id} no encontrado'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    costo_total_insumo = cantidad * insumo.Insumo_precio_unitario

                    InsumosXPrendas.objects.create(
                        insumo=insumo,
                        prenda=prenda,
                        Insumo_prenda_cantidad_utilizada=cantidad,
                        Insumo_prenda_unidad_medida=insumo.unidad_medida.nombre if insumo.unidad_medida else "",
                        Insumo_prenda_costo_total=costo_total_insumo
                    )
                    
                    costo_insumos_total += costo_total_insumo

            # Actualizar talles si se enviaron
            if talles_data is not None:
                TallesXPrendas.objects.filter(prenda=prenda).delete()
                for codigo in talles_data:
                    talle, _ = Talle.objects.get_or_create(Talle_codigo=codigo)
                    TallesXPrendas.objects.create(talle=talle, prenda=prenda, stock=0)

            # Recalcular costo total si se actualizaron insumos
            if insumos_data is not None or 'Prenda_precio_unitario' in data:
                # El valor de Prenda_precio_unitario (M.O.) puede venir actualizado en data
                precio_confeccion = float(data.get('Prenda_precio_unitario', prenda.Prenda_precio_unitario))
                
                # Recalcular costo insumos total si no vino en el body (si solo se actualizó la MO)
                if insumos_data is None:
                    costo_insumos_total = InsumosXPrendas.objects.filter(prenda=prenda).aggregate(
                        total=Sum('Insumo_prenda_costo_total')
                    )['total'] or 0.0

                costo_total = costo_insumos_total + precio_confeccion
                
                prenda.Prenda_costo_total_produccion = costo_total
                prenda.Prenda_precio_unitario = precio_confeccion
                prenda.save()

            print("✅ Prenda actualizada correctamente")
            return Response(PrendaSerializer(prenda, context={'request': request}).data)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Error al actualizar prenda: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk):
        """Eliminar prenda (solo si no está en pedidos)"""
        try:
            prenda = get_object_or_404(Prenda, pk=pk)
            
            # Verificar si está siendo usada en pedidos
            if DetallePedido.objects.filter(prenda=prenda).exists():
                return Response(
                    {
                        "error": f"No se puede eliminar la prenda '{prenda.Prenda_nombre}' porque ya fue utilizada en pedidos.",
                        "tipo": "prenda_en_uso",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            prenda.delete()
            return Response(
                {"mensaje": f"Prenda '{prenda.Prenda_nombre}' eliminada correctamente."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {'error': f'Error al eliminar prenda: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ===========================================================
# 🔹 CONFIRMAR PEDIDO Y ACTUALIZAR STOCK
# ===========================================================
class ConfirmarPedidoView(APIView):
    @transaction.atomic
    def post(self, request):
        try:
            prendas = request.data.get('prendas', [])
            if not prendas:
                return Response({'error': 'No se enviaron prendas.'}, status=status.HTTP_400_BAD_REQUEST)

            resumen = []
            for p in prendas:
                prenda_id = p.get('id_prenda')
                cantidad_pedida = float(p.get('cantidad', 0))
                if not prenda_id or cantidad_pedida <= 0:
                    continue

                prenda = get_object_or_404(Prenda, pk=prenda_id)
                relaciones = InsumosXPrendas.objects.filter(prenda=prenda).select_related('insumo')

                for rel in relaciones:
                    insumo = rel.insumo
                    cantidad_total = rel.Insumo_prenda_cantidad_utilizada * cantidad_pedida
                    if insumo.Insumo_cantidad < cantidad_total:
                        transaction.set_rollback(True)
                        return Response(
                            {'error': f'Stock insuficiente del insumo: {insumo.Insumo_nombre}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    insumo.Insumo_cantidad -= cantidad_total
                    insumo.save()

                    resumen.append({
                        'insumo': insumo.Insumo_nombre,
                        'cantidad_descontada': cantidad_total,
                        'stock_restante': insumo.Insumo_cantidad
                    })

            return Response({'mensaje': 'Pedido confirmado.', 'detalle': resumen}, status=status.HTTP_200_OK)

        except Exception as e:
            transaction.set_rollback(True)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)