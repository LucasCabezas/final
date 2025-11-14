# inventario/urls.py
from django.urls import path
from .views import (
    InsumoList, InsumoDetail, UnidadMedidaList, TipoInsumoList,
    PrendaList, PrendaDetail,
    AlertaStockList, verificar_stock, 
    obtener_insumos_bajo_stock,
    ConfirmarPedidoView,
    verificar_uso_insumo
)

urlpatterns = [
    # ---------- INSUMOS ----------
    path('insumos/', InsumoList.as_view(), name='insumo-list'),
    path('insumos/<int:pk>/', InsumoDetail.as_view(), name='insumo-detail'),
    path('insumos/<int:pk>/verificar-uso/', verificar_uso_insumo, name='verificar-uso-insumo'),
    path('unidades/', UnidadMedidaList.as_view(), name='unidades-list'),
    path('tipos/', TipoInsumoList.as_view(), name='tipos-insumos-list'),
    
    # ---------- PRENDAS ----------
    path('prendas/', PrendaList.as_view(), name='prenda-list'),
    path('prendas/<int:pk>/', PrendaDetail.as_view(), name='prenda-detail'),
    
    # ---------- ALERTAS DE STOCK ----------
    path('alertas-stock/', AlertaStockList.as_view(), name='alerta-stock-list'),
    path('insumos-bajo-stock/', obtener_insumos_bajo_stock, name='insumos-bajo-stock'),
    path("verificar-stock/", verificar_stock, name="verificar-stock"),
    
    # ---------- PEDIDOS ----------
    path('confirmar-pedido/', ConfirmarPedidoView.as_view(), name='confirmar-pedido'),
]