from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Pedido, DetallePedido
from .serializers import PedidoSerializer
from .forms import DetallePedidoForm


# ============== VISTAS API REST ==============

class PedidoList(APIView):
    def get(self, request):
        pedidos = Pedido.objects.all()
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PedidoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class PedidoDetail(APIView):
    def get(self, request, pk):
        pedido = Pedido.objects.get(pk=pk)
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data)

    def put(self, request, pk):
        pedido = Pedido.objects.get(pk=pk)
        serializer = PedidoSerializer(pedido, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        pedido = Pedido.objects.get(pk=pk)
        pedido.delete()
        return Response(status=204)


# ============== VISTAS FRONTEND ==============

def crear_pedido(request):
    """Vista para crear un nuevo pedido y agregar items"""
    
    # Obtener el primer usuario (temporal)
    usuario = User.objects.first()
    
    # Buscar si hay un pedido pendiente
    pedido_actual = Pedido.objects.filter(
        Usuario=usuario, 
        Pedido_estado=False
    ).first()
    
    # Si no hay pedido pendiente, crear uno nuevo
    if not pedido_actual:
        pedido_actual = Pedido.objects.create(
            Usuario=usuario,
            Pedido_fecha=timezone.now().date(),
            Pedido_estado=False
        )
    
    # Obtener los items del pedido actual
    items_pedido = DetallePedido.objects.filter(pedido=pedido_actual)
    
    # Calcular el total del pedido
    total_pedido = sum(item.precio_total for item in items_pedido)
    
    # Procesar el formulario
    if request.method == 'POST':
        form = DetallePedidoForm(request.POST)
        if form.is_valid():
            detalle = form.save(commit=False)
            detalle.pedido = pedido_actual
            detalle.save()
            messages.success(request, '¡Item agregado al pedido!')
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
    """Vista para eliminar un item del pedido"""
    item = get_object_or_404(DetallePedido, id=item_id)
    item.delete()
    messages.success(request, 'Item eliminado del pedido')
    return redirect('crear_pedido')


def finalizar_pedido(request, pedido_id):
    """Vista para finalizar el pedido"""
    pedido = get_object_or_404(Pedido, Pedido_ID=pedido_id)
    pedido.Pedido_estado = True
    pedido.save()
    messages.success(request, '¡Pedido finalizado exitosamente!')
    return redirect('crear_pedido')