from django.urls import path, include
from .views import PedidoList, PedidoDetail, crear_pedido, eliminar_item, finalizar_pedido

urlpatterns = [
    # URLs de la API REST (las que ya tenías)
    path('', PedidoList.as_view(), name='pedido-list'),        # /api/pedidos/
    path('<int:pk>/', PedidoDetail.as_view(), name='pedido-detail'),  # /api/pedidos/1/
    
    # URLs del Frontend (nuevas)
    path('crear/', crear_pedido, name='crear_pedido'),
    path('eliminar/<int:item_id>/', eliminar_item, name='eliminar_item'),
    path('finalizar/<int:pedido_id>/', finalizar_pedido, name='finalizar_pedido'),
]