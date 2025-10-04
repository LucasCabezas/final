from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from .models import Pedido, DetallePedido
from .forms import DetallePedidoForm
from usuarios.models import Usuario


def crear_pedido(request):
    """Vista para crear un nuevo pedido y agregar items"""
    
    # Obtener o crear el pedido actual del usuario (simulamos usuario por ahora)
    # En producción, usarías request.user
    usuario = Usuario.objects.first()  # Por ahora tomamos el primer usuario
    
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
            Pedido_estado=False  # False = pendiente
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
            detalle.save()  # Aquí se calculan los costos automáticamente
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
    pedido.Pedido_estado = True  # True = finalizado
    pedido.save()
    messages.success(request, '¡Pedido finalizado exitosamente!')
    return redirect('crear_pedido')