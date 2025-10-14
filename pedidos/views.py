from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from django.db import transaction
from django.contrib.auth.models import User

from .models import Pedido, DetallePedido
from .serializers import PedidoSerializer
from .forms import DetallePedidoForm
from inventario.models import Prenda, InsumosXPrendas, Insumo


# =====================================================
# 🧩 API REST - Integración con React
# =====================================================

class PedidoList(APIView):
    """
    API: Listar o crear pedidos desde el frontend React.
    Permite enviar un JSON con las prendas seleccionadas,
    crea el pedido y descuenta stock automáticamente.
    """

    def get(self, request):
        pedidos = Pedido.objects.all().order_by('-Pedido_fecha')
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        """
        Recibe un JSON del frontend con el siguiente formato:
        {
            "usuario": 1,
            "prendas": [
                {"id_prenda": 3, "cantidad": 2, "tipo": "LISA"},
                {"id_prenda": 5, "cantidad": 1, "tipo": "ESTAMPADA"}
            ]
        }
        """
        try:
            data = request.data
            usuario_id = data.get("usuario", 1)
            prendas = data.get("prendas", [])

            if not prendas:
                return Response({"error": "No se enviaron prendas."}, status=status.HTTP_400_BAD_REQUEST)

            # Crear pedido principal
            pedido = Pedido.objects.create(
                Usuario_id=usuario_id,
                Pedido_fecha=timezone.now().date(),
                Pedido_estado=False
            )

            total_pedido = 0

            for item in prendas:
                prenda_id = item.get("id_prenda")
                cantidad = int(item.get("cantidad", 0))
                tipo = item.get("tipo", "LISA")

                if not prenda_id or cantidad <= 0:
                    raise ValueError("Datos de prenda inválidos o cantidad incorrecta.")

                prenda = Prenda.objects.get(pk=prenda_id)

                # Crear detalle del pedido
                detalle = DetallePedido.objects.create(
                    pedido=pedido,
                    prenda=prenda,
                    cantidad=cantidad,
                    tipo=tipo,
                    talle_id=1,   # temporales
                    color_id=1,
                    modelo_id=1,
                    marca_id=1,
                )

                total_pedido += detalle.precio_total

                # 🔥 Descontar insumos utilizados
                relaciones = InsumosXPrendas.objects.filter(prenda=prenda)
                for rel in relaciones:
                    insumo = rel.insumo
                    cantidad_usada = rel.Insumo_prenda_cantidad_utilizada * cantidad

                    if insumo.Insumo_cantidad < cantidad_usada:
                        raise Exception(
                            f"Stock insuficiente: {insumo.Insumo_nombre} "
                            f"(Disponible: {insumo.Insumo_cantidad}, Requiere: {cantidad_usada})"
                        )

                    insumo.Insumo_cantidad -= cantidad_usada
                    insumo.save()

            # Guardar pedido final
            pedido.Pedido_estado = True
            pedido.save()

            return Response({
                "mensaje": "✅ Pedido creado correctamente.",
                "pedido_id": pedido.Pedido_ID,
                "total": round(total_pedido, 2)
            }, status=status.HTTP_201_CREATED)

        except Prenda.DoesNotExist:
            return Response({"error": "Una de las prendas no existe."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            transaction.set_rollback(True)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PedidoDetail(APIView):
    """API: Ver, editar o eliminar un pedido existente."""

    def get(self, request, pk):
        pedido = get_object_or_404(Pedido, pk=pk)
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data)

    def put(self, request, pk):
        pedido = get_object_or_404(Pedido, pk=pk)
        serializer = PedidoSerializer(pedido, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        pedido = get_object_or_404(Pedido, pk=pk)
        pedido.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# =====================================================
# 💻 Vistas del panel Django (uso interno / administrativo)
# =====================================================

def crear_pedido(request):
    """Permite crear un pedido manualmente desde el panel de administración."""

    usuario = User.objects.first()  # Temporal hasta integrar login

    pedido_actual = Pedido.objects.filter(Usuario=usuario, Pedido_estado=False).first()
    if not pedido_actual:
        pedido_actual = Pedido.objects.create(
            Usuario=usuario,
            Pedido_fecha=timezone.now().date(),
            Pedido_estado=False
        )

    items_pedido = DetallePedido.objects.filter(pedido=pedido_actual)
    total_pedido = sum(item.precio_total for item in items_pedido)

    if request.method == 'POST':
        form = DetallePedidoForm(request.POST)
        if form.is_valid():
            detalle = form.save(commit=False)
            detalle.pedido = pedido_actual
            detalle.save()
            messages.success(request, '✅ Ítem agregado al pedido.')
            return redirect('crear_pedido')
    else:
        form = DetallePedidoForm()

    context = {
        'form': form,
        'pedido': pedido_actual,
        'items': items_pedido,
        'total': total_pedido,
    }
    return render(request, 'pedidos/crear_pedido.html', context)


def eliminar_item(request, item_id):
    """Elimina un ítem del pedido desde el panel web."""
    item = get_object_or_404(DetallePedido, id=item_id)
    item.delete()
    messages.success(request, '🗑️ Ítem eliminado del pedido.')
    return redirect('crear_pedido')


def finalizar_pedido(request, pedido_id):
    """Finaliza un pedido manualmente en el panel Django."""
    pedido = get_object_or_404(Pedido, Pedido_ID=pedido_id)
    pedido.Pedido_estado = True
    pedido.save()
    messages.success(request, '🎉 ¡Pedido realizado exitosamente!')
    return redirect('crear_pedido')
