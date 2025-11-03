from django.urls import path
from .views import PedidoList, PedidoDetail, crear_pedido, eliminar_item, finalizar_pedido

urlpatterns = [
    # ========================
    # 🔹 API REST para React
    # ========================
    path('', PedidoList.as_view(), name='pedido-list'),                # /api/pedidos/
    path('<int:pk>/', PedidoDetail.as_view(), name='pedido-detail'),   # /api/pedidos/83/

    # (alias opcional si lo usa tu frontend viejo)
    path('Detalledepedido/', PedidoList.as_view(), name='pedido-detalle-custom'),

    # ========================
    # 💻 Panel Administrativo
    # ========================
    path('crear/', crear_pedido, name='crear_pedido'),
    path('eliminar/<int:item_id>/', eliminar_item, name='eliminar_item'),
    path('finalizar/<int:pedido_id>/', finalizar_pedido, name='finalizar_pedido'),
    
]
