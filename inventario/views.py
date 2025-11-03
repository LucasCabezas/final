from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import api_view
from django.db import transaction
from django.db.models import Sum, F
from django.shortcuts import get_object_or_404
import json

from .models import Insumo, Prenda, InsumosXPrendas, AlertaStock, UnidadMedida, TipoInsumo
from .serializers import (
    InsumoSerializer, 
    PrendaSerializer, 
    AlertaStockSerializer, 
    UnidadMedidaSerializer, 
    TipoInsumoSerializer
)
from pedidos.models import DetallePedido

@api_view(["POST"])
def verificar_stock(request):
    """
    🔍 Verifica si hay stock suficiente de insumos antes de crear un pedido.
    Espera un JSON con: { "prendas": [{ "id_prenda": 1, "cantidad": 3 }, ...] }
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

            # 🔹 Recorremos los insumos asociados
            for rel in InsumosXPrendas.objects.filter(prenda=prenda):
                insumo = rel.insumo
                cantidad_necesaria = rel.Insumo_prenda_cantidad_utilizada * cantidad

                if insumo.Insumo_cantidad < cantidad_necesaria:
                    insumos_insuficientes.append({
                        "nombre": insumo.Insumo_nombre,
                        "disponible": insumo.Insumo_cantidad,
                        "requerido": cantidad_necesaria,
                        "faltante": round(cantidad_necesaria - insumo.Insumo_cantidad, 2),
                        "unidad": getattr(insumo.unidad_medida, "UnidadMedida_nombre", "")
                    })

        if insumos_insuficientes:
            return Response(
                {"insumos_insuficientes": insumos_insuficientes},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"mensaje": "✅ Stock suficiente para todas las prendas."}, status=status.HTTP_200_OK)

    except Exception as e:
        import traceback; traceback.print_exc()
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
# ===========================================================
# 🔹 LISTAR / CREAR INSUMOS
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
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ===========================================================
# 🔹 LISTAR UNIDADES Y TIPOS
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
# 🔹 DETALLE / EDITAR / ELIMINAR INSUMO
# ===========================================================
class InsumoDetail(APIView):
    def get_object(self, pk):
        try:
            return Insumo.objects.select_related('unidad_medida', 'tipo_insumo').get(pk=pk)
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

        unidad_anterior = insumo.unidad_medida_id
        serializer = InsumoSerializer(insumo, data=request.data)
        if serializer.is_valid():
            insumo_actualizado = serializer.save()

            if unidad_anterior != insumo_actualizado.unidad_medida_id:
                InsumosXPrendas.objects.filter(insumo=insumo_actualizado).update(
                    Insumo_prenda_unidad_medida=insumo_actualizado.unidad_medida.nombre
                )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        insumo = self.get_object(pk)
        if not insumo:
            return Response({'error': 'Insumo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        insumo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
        from django.db.models import F
        insumos_bajo_stock = Insumo.objects.filter(Insumo_cantidad__lte=F('Insumo_cantidad_minima'))
        serializer = InsumoSerializer(insumos_bajo_stock, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ===========================================================
# 🔹 CREAR / LISTAR PRENDAS
# ===========================================================
def procesar_clasificaciones(data):
    """
    Asegura que Marca, Modelo y Color se asocien correctamente por ID
    si el valor recibido es numérico, o se creen solo si es texto nuevo.
    """
    from clasificaciones.models import Marca, Modelo, Color

    # --- MARCA ---
    if 'Prenda_marca' in data and data['Prenda_marca']:
        valor = str(data['Prenda_marca']).strip()
        if valor.isdigit():  # ✅ Es un ID existente
            try:
                marca = Marca.objects.get(pk=int(valor))
                data['Prenda_marca'] = marca.Marca_ID
            except Marca.DoesNotExist:
                raise ValueError(f"La marca con ID {valor} no existe")
        else:  # ✅ Es texto nuevo
            marca, _ = Marca.objects.get_or_create(
                Marca_nombre__iexact=valor,
                defaults={'Marca_nombre': valor}
            )
            data['Prenda_marca'] = marca.Marca_ID

    # --- MODELO ---
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

    # --- COLOR ---
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


class PrendaList(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        try:
            prendas = Prenda.objects.all()
            serializer = PrendaSerializer(prendas, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            import traceback
            print("🔥 ERROR AL CARGAR PRENDAS 🔥")
            traceback.print_exc()  # imprime el error real
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @transaction.atomic
    def post(self, request):
        data = request.data.copy()
        insumos_data = []
        talles_data = []

        # Decodificar insumos
        if data.get('insumos_prendas'):
            raw = data.get('insumos_prendas')
            try:
                insumos_data = json.loads(raw) if isinstance(raw, str) else raw
            except Exception:
                return Response({'error': 'Error al decodificar insumos_prendas'}, status=status.HTTP_400_BAD_REQUEST)

        # Decodificar talles
        if data.get('talles'):
            raw = data.get('talles')
            try:
                talles_data = json.loads(raw) if isinstance(raw, str) else raw
            except Exception:
                return Response({'error': 'Error al decodificar talles'}, status=status.HTTP_400_BAD_REQUEST)

        # Procesar clasificaciones (crea si no existen)
        try:
            data = procesar_clasificaciones(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Crear prenda base
        serializer = PrendaSerializer(data=data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        prenda = serializer.save()

        # Crear relaciones InsumosXPrendas
        for item in insumos_data:
            try:
                insumo_id = int(item.get('insumo'))
                cantidad = float(item.get('cantidad'))
                insumo = Insumo.objects.get(pk=insumo_id)

                InsumosXPrendas.objects.create(
                    insumo=insumo,
                    prenda=prenda,
                    Insumo_prenda_cantidad_utilizada=cantidad,
                    Insumo_prenda_unidad_medida=insumo.unidad_medida.nombre if insumo.unidad_medida else "",
                    Insumo_prenda_costo_total=cantidad * insumo.Insumo_precio_unitario
                )
            except Exception as e:
                print(f"Error creando insumo: {e}")
                continue

        # Calcular costo total de producción
        costo_insumos = (
            InsumosXPrendas.objects
            .filter(prenda=prenda)
            .aggregate(total=Sum(F('Insumo_prenda_costo_total')))['total'] or 0
        )
        precio_base = float(prenda.Prenda_precio_unitario or 0)
        costo_total = float(costo_insumos) + precio_base
        # El precio unitario será el costo total de producción
        prenda.Prenda_costo_total_produccion = costo_total
        prenda.Prenda_precio_unitario = costo_total
        prenda.save()

        # Crear Talles
        from clasificaciones.models import Talle, TallesXPrendas
        for codigo in talles_data:
            try:
                talle, _ = Talle.objects.get_or_create(Talle_codigo=codigo)
                TallesXPrendas.objects.create(talle=talle, prenda=prenda, stock=0)
            except Exception as e:
                print(f"Error creando talle: {e}")
                continue

        return Response(PrendaSerializer(prenda, context={'request': request}).data, status=status.HTTP_201_CREATED)


# ===========================================================
# 🔹 DETALLE / EDITAR / ELIMINAR PRENDA
# ===========================================================
class PrendaDetail(APIView):
    def get(self, request, pk):
        prenda = get_object_or_404(Prenda, pk=pk)
        serializer = PrendaSerializer(prenda, context={'request': request})
        return Response(serializer.data)

    @transaction.atomic
    def put(self, request, pk):
        prenda = get_object_or_404(Prenda, pk=pk)
        data = request.data.copy()

        # Decodificar insumos y talles si vienen en JSON
        insumos_data = []
        talles_data = []

        if data.get("insumos_prendas"):
            raw = data.get("insumos_prendas")
            try:
                insumos_data = json.loads(raw) if isinstance(raw, str) else raw
            except Exception:
                return Response(
                    {"error": "Error al decodificar insumos_prendas"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if data.get("talles"):
            raw = data.get("talles")
            try:
                talles_data = json.loads(raw) if isinstance(raw, str) else raw
            except Exception:
                return Response(
                    {"error": "Error al decodificar talles"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Actualizar datos base
        serializer = PrendaSerializer(prenda, data=data, partial=True, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        prenda = serializer.save()

        # Recalcular costo total de producción y actualizar precio unitario
        costo_insumos = (
            InsumosXPrendas.objects.filter(prenda=prenda)
            .aggregate(total=Sum(F("Insumo_prenda_costo_total")))["total"]
            or 0
        )
        # ✅ CORRECCIÓN: Usar el precio de confección que envió el usuario
        precio_confeccion = float(data.get('Prenda_precio_unitario', prenda.Prenda_precio_unitario) or 0)
        costo_total = float(costo_insumos) + precio_confeccion

        prenda.Prenda_costo_total_produccion = costo_total
        prenda.Prenda_precio_unitario = precio_confeccion
        prenda.save()

        return Response(PrendaSerializer(prenda, context={'request': request}).data)

    def delete(self, request, pk):
        prenda = get_object_or_404(Prenda, pk=pk)
        usada = DetallePedido.objects.filter(prenda=prenda).exists()

        if usada:
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