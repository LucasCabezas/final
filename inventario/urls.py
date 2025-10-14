from django.urls import path, include # Importa la función path para definir rutas
from .views import InsumoList, InsumoDetail, PrendaList, PrendaDetail, AlertaStockList, obtener_insumos_bajo_stock # Importa las vistas desde el archivo views.py

urlpatterns = [ # Define la lista de rutas URL para la aplicación
    path('insumos/', InsumoList.as_view(), name='insumo-list'), # Ruta para listar y crear insumos
    path('insumos/<int:pk>/', InsumoDetail.as_view(), name='insumo-detail'), # Ruta para obtener, actualizar o eliminar un insumo específico
    path('prendas/', PrendaList.as_view(), name='prenda-list'), # Ruta para listar y crear prendas
    path('prendas/<int:pk>/', PrendaDetail.as_view(), name='prenda-detail'), # Ruta para obtener, actualizar o eliminar una prenda específica
    path('alertas-stock/', AlertaStockList.as_view(), name='alerta-stock-list'), # NUEVO: Ruta para obtener alertas de bajo stock activas
    path('insumos-bajo-stock/', obtener_insumos_bajo_stock, name='insumos-bajo-stock'), # NUEVO: Ruta para obtener insumos bajo stock
]