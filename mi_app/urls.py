from django.urls import path, include  # Importa las funciones path e include para definir rutas de la aplicación
from .views import PrendaList, PrendaDetail  # Importa las vistas para prendas
from .views import InsumoList, InsumoDetail  # Importa las vistas para insumos
from .views import PedidoList, PedidoDetail  # Importa las vistas para pedidos
from .views import TallerList, TallerDetail  # Importa las vistas para talleres

urlpatterns = [  # Lista de rutas URL para la aplicación
    path('prendas/', PrendaList.as_view(), name='prenda-list'),  # Ruta para listar o crear prendas
    path('prendas/<int:pk>/', PrendaDetail.as_view(), name='prenda-detail'),  # Ruta para ver, actualizar o eliminar una prenda específica
    path('insumos/', InsumoList.as_view(), name='insumo-list'),  # Ruta para listar o crear insumos
    path('insumos/<int:pk>/', InsumoDetail.as_view(), name='insumo-detail'),  # Ruta para ver, actualizar o eliminar un insumo específico
    path('pedidos/', PedidoList.as_view(), name='pedido-list'),  # Ruta para listar o crear pedidos
    path('pedidos/<int:pk>/', PedidoDetail.as_view(), name='pedido-detail'),  # Ruta para ver, actualizar o eliminar un pedido específico
    path('talleres/', TallerList.as_view(), name='taller-list'),  # Ruta para listar o crear talleres
    path('talleres/<int:pk>/', TallerDetail.as_view(), name='taller-detail'),  # Ruta para ver, actualizar o eliminar un taller específico
]