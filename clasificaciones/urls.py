# clasificaciones/urls.py
from django.urls import path
from .views import (
    MarcaList, MarcaDetail,
    ModeloList, ModeloDetail,
    ColorList, ColorDetail,
    TalleList, TalleDetail
)

urlpatterns = [
    # ---------- TALLES (con 's') ----------
    path('talles/', TalleList.as_view(), name='talle-list'),
    path('talles/<int:pk>/', TalleDetail.as_view(), name='talle-detail'),
    
    # ---------- TALLES (sin 's' para compatibilidad) ----------
    path('talle/', TalleList.as_view(), name='talle-list-legacy'),
    path('talle/<int:pk>/', TalleDetail.as_view(), name='talle-detail-legacy'),
    
    # ---------- COLORES (con 's') ----------
    path('colores/', ColorList.as_view(), name='color-list'),
    path('colores/<int:pk>/', ColorDetail.as_view(), name='color-detail'),
    
    # ---------- COLORES (sin 's' para compatibilidad) ----------
    path('color/', ColorList.as_view(), name='color-list-legacy'),
    path('color/<int:pk>/', ColorDetail.as_view(), name='color-detail-legacy'),
    
    # ---------- MODELOS (con 's') ----------
    path('modelos/', ModeloList.as_view(), name='modelo-list'),
    path('modelos/<int:pk>/', ModeloDetail.as_view(), name='modelo-detail'),
    
    # ---------- MODELOS (sin 's' para compatibilidad) ----------
    path('modelo/', ModeloList.as_view(), name='modelo-list-legacy'),
    path('modelo/<int:pk>/', ModeloDetail.as_view(), name='modelo-detail-legacy'),
    
    # ---------- MARCAS (con 's') ----------
    path('marcas/', MarcaList.as_view(), name='marca-list'),
    path('marcas/<int:pk>/', MarcaDetail.as_view(), name='marca-detail'),
    
    # ---------- MARCAS (sin 's' para compatibilidad) ----------
    path('marca/', MarcaList.as_view(), name='marca-list-legacy'),
    path('marca/<int:pk>/', MarcaDetail.as_view(), name='marca-detail-legacy'),
]