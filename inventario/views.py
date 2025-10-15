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

class PrendaList(APIView):
    """Listar y crear prendas con sus insumos"""
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        try:
            prendas = Prenda.objects.all()
            # 🔥 AGREGADO: context={'request': request} para construir URLs completas
            serializer = PrendaSerializer(prendas, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @transaction.atomic
    def post(self, request):
        data = request.data.copy()
        insumos_data = []

        # Decodificar los insumos recibidos desde React (JSON string)
        if data.get('insumos_prendas'):
            try:
                insumos_data = json.loads(data.get('insumos_prendas'))
            except json.JSONDecodeError:
                return Response({'error': 'Error al decodificar insumos_prendas'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la prenda base - 🔥 AGREGADO: context
        serializer = PrendaSerializer(data=data, context={'request': request})
        if not serializer.is_valid():
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
            except Exception:
                continue

        # 🔥 AGREGADO: context al devolver la prenda creada
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

        # 🔥 AGREGADO: context al serializar
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

        # Decodificar insumos_prendas
        if data.get('insumos_prendas'):
            try:
                insumos_data = json.loads(data.get('insumos_prendas'))
            except json.JSONDecodeError:
                return Response({'error': 'Error al decodificar insumos_prendas'}, status=status.HTTP_400_BAD_REQUEST)

        # 🔥 AGREGADO: context al actualizar
        serializer = PrendaSerializer(prenda, data=data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        prenda = serializer.save()

        # Limpiar relaciones viejas y recrear
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
            except Exception:
                continue

        # 🔥 AGREGADO: context al devolver
        return Response(PrendaSerializer(prenda, context={'request': request}).data)

    @transaction.atomic
    def delete(self, request, pk):
        prenda = self.get_object(pk)
        if not prenda:
            return Response({'error': 'Prenda no encontrada'}, status=status.HTTP_404_NOT_FOUND)

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

            resumen_actualizacion = []  # Para devolver detalles del stock modificado

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

                    # Validar stock
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

                    # Descontar del stock
                    insumo.Insumo_cantidad -= cantidad_total
                    insumo.save()

                    resumen_actualizacion.append({
                        'insumo': insumo.Insumo_nombre,
                        'cantidad_descontada': cantidad_total,
                        'stock_restante': insumo.Insumo_cantidad
                    })

            # Si todo sale bien
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