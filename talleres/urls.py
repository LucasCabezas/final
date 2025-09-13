from django.urls import path, include # Importa la función path para definir rutas
from .views import TallerList, TallerDetail, PrendasXTalleresList, PrendasXTalleresDetail # Importa las vistas necesarias desde el archivo views.py


urlpatterns = [ # Define las rutas para la aplicación "talleres"
    path('talleres/', TallerList.as_view(), name='taller-list'), # Ruta para listar y crear talleres
    path('talleres/<int:pk>/', TallerDetail.as_view(), name='taller-detail'), # Ruta para obtener, actualizar y eliminar un taller específico
    path('prendasxtalleres/', PrendasXTalleresList.as_view(), name='prendasxtalleres-list'), # Ruta para listar y crear prendas por taller
    path('prendasxtalleres/<int:pk>/', PrendasXTalleresDetail.as_view(), name='prendasxtalleres-detail'), # Ruta para obtener, actualizar y eliminar una prenda por taller específica
]