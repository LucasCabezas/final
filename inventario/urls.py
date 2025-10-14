from django.urls import path
from .views import (
    InsumoList, InsumoDetail,
    PrendaList, PrendaDetail,
    AlertaStockList,
    obtener_insumos_bajo_stock,
    ConfirmarPedidoView
)

urlpatterns = [
    # ---------- INSUMOS ----------
    path('insumos/', InsumoList.as_view(), name='insumo-list'),
    path('insumos/<int:pk>/', InsumoDetail.as_view(), name='insumo-detail'),

    # ---------- PRENDAS ----------
    path('prendas/', PrendaList.as_view(), name='prenda-list'),
    path('prendas/<int:pk>/', PrendaDetail.as_view(), name='prenda-detail'),
    
    # ---------- ALERTAS DE STOCK ----------
    path('alertas-stock/', AlertaStockList.as_view(), name='alerta-stock-list'),
    path('insumos-bajo-stock/', obtener_insumos_bajo_stock, name='insumos-bajo-stock'),
    
    # ---------- PEDIDOS ----------
    path('confirmar-pedido/', ConfirmarPedidoView.as_view(), name='confirmar-pedido'),
]