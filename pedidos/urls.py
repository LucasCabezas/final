from django.urls import path, include # Importa la función path para definir rutas
from .views import PedidoList, PedidoDetail # Importa las vistas desde el archivo views.py

urlpatterns = [ # Define la lista de rutas URL para la aplicación
    path('pedidos/', PedidoList.as_view(), name='pedido-list'), # Ruta para listar y crear pedidos
    path('pedidos/<int:pk>/', PedidoDetail.as_view(), name='pedido-detail'), # Ruta para obtener, actualizar o eliminar un pedido específico
]