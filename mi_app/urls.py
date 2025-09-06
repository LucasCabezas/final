from django.urls import path, include
from .views import PrendaList, PrendaDetail
from .views import InsumoList, InsumoDetail

urlpatterns = [
    path('prendas/', PrendaList.as_view(), name='prenda-list'),
    path('prendas/<int:pk>/', PrendaDetail.as_view(), name='prenda-detail'),
    path('insumos/', InsumoList.as_view(), name='insumo-list'),
    path('insumos/<int:pk>/', InsumoDetail.as_view(), name='insumo-detail'),
]