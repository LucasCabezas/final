from django.urls import path
from .views import (
    InsumoList, InsumoDetail,
    PrendaList, PrendaDetail
   
)

urlpatterns = [
    # ---------- INSUMOS ----------
    path('insumos/', InsumoList.as_view(), name='insumo-list'),
    path('insumos/<int:pk>/', InsumoDetail.as_view(), name='insumo-detail'),

    # ---------- PRENDAS ----------
    path('prendas/', PrendaList.as_view(), name='prenda-list'),
    path('prendas/<int:pk>/', PrendaDetail.as_view(), name='prenda-detail'),
    
    
]
