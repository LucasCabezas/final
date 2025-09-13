from django.urls import path, include # Importa la función path para definir rutas
from .views import TalleList, TalleDetail, ColorList, ColorDetail, ModeloList, ModeloDetail, MarcaList, MarcaDetail # Importa las vistas desde el archivo views.py

urlpatterns = [ # Define la lista de rutas URL para la aplicación
    path('talle/', TalleList.as_view(), name='talle-list'), # Ruta para listar y crear talles
    path('talle/<int:pk>/', TalleDetail.as_view(), name='talle-detail'), # Ruta para obtener, actualizar o eliminar un talle específico
    path('color/', ColorList.as_view(), name='color-list'), # Ruta para listar y crear colores
    path('color/<int:pk>/', ColorDetail.as_view(), name='color-detail'), # Ruta para obtener, actualizar o eliminar un color específico
    path('modelo/', ModeloList.as_view(), name='modelo-list'), # Ruta para listar y crear modelos
    path('modelo/<int:pk>/', ModeloDetail.as_view(), name='modelo-detail'), # Ruta para obtener, actualizar o eliminar un modelo específico
    path('marca/', MarcaList.as_view(), name='marca-list'), # Ruta para listar y crear marcas
    path('marca/<int:pk>/', MarcaDetail.as_view(), name='marca-detail'), # Ruta para obtener, actualizar o eliminar una marca específica
]