from django.urls import path
from .views import (
    PedidoList, PedidoDetail, crear_pedido, eliminar_item, finalizar_pedido,
    aceptar_pedido_costurero, terminar_pedido_costurero, trasladar_pedido_estampado,
    aceptar_pedido_estampador, terminar_pedido_estampador
)

urlpatterns = [
    # ========================
    # 🔹 API REST para React
    # ========================
    path('', PedidoList.as_view(), name='pedido-list'),                # /api/pedidos/
    path('<int:pk>/', PedidoDetail.as_view(), name='pedido-detail'),   # /api/pedidos/83/

    # (alias opcional si lo usa tu frontend viejo)
    path('Detalledepedido/', PedidoList.as_view(), name='pedido-detalle-custom'),

    # ========================
    # 🔥 NUEVAS RUTAS PARA COSTURERO
    # ========================
    path('<int:pedido_id>/aceptar-costurero/', aceptar_pedido_costurero, name='aceptar-pedido-costurero'),
    path('<int:pedido_id>/terminar-costurero/', terminar_pedido_costurero, name='terminar-pedido-costurero'),
    path('<int:pedido_id>/trasladar-estampado/', trasladar_pedido_estampado, name='trasladar-pedido-estampado'),

    # ========================
    # 🔥 NUEVAS RUTAS PARA ESTAMPADOR
    # ========================
    path('<int:pedido_id>/aceptar-estampador/', aceptar_pedido_estampador, name='aceptar-pedido-estampador'),
    path('<int:pedido_id>/terminar-estampador/', terminar_pedido_estampador, name='terminar-pedido-estampador'),

    # ========================
    # 💻 Panel Administrativo
    # ========================
    path('crear/', crear_pedido, name='crear_pedido'),
    path('eliminar/<int:item_id>/', eliminar_item, name='eliminar_item'),
    path('finalizar/<int:pedido_id>/', finalizar_pedido, name='finalizar_pedido'),
    
]