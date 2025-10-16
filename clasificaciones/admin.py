# clasificaciones/admin.py

from django.contrib import admin
from .models import Talle, TallesXPrendas, Color, Modelo, Marca

# ========================================
# ADMIN PARA TALLE
# ========================================
@admin.register(Talle)
class TalleAdmin(admin.ModelAdmin):
    list_display = ('Talle_ID', 'Talle_codigo')
    search_fields = ('Talle_codigo',)
    ordering = ('Talle_codigo',)
    list_per_page = 20


# ========================================
# ADMIN PARA TALLES X PRENDAS
# ========================================
@admin.register(TallesXPrendas)
class TallesXPrendasAdmin(admin.ModelAdmin):
    list_display = ('get_prenda_nombre', 'get_talle_codigo', 'stock')
    list_filter = ('talle',)
    search_fields = ('prenda__Prenda_nombre', 'talle__Talle_codigo')
    ordering = ('prenda', 'talle')
    list_per_page = 50
    
    def get_prenda_nombre(self, obj):
        return obj.prenda.Prenda_nombre
    get_prenda_nombre.short_description = 'Prenda'
    get_prenda_nombre.admin_order_field = 'prenda__Prenda_nombre'
    
    def get_talle_codigo(self, obj):
        return obj.talle.Talle_codigo
    get_talle_codigo.short_description = 'Talle'
    get_talle_codigo.admin_order_field = 'talle__Talle_codigo'


# ========================================
# ADMIN PARA COLOR
# ========================================
@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ('Color_ID', 'Color_nombre', 'cantidad_prendas')
    search_fields = ('Color_nombre',)
    ordering = ('Color_nombre',)
    list_per_page = 20
    
    def cantidad_prendas(self, obj):
        return obj.prendas.count()
    cantidad_prendas.short_description = 'Prendas con este color'


# ========================================
# ADMIN PARA MODELO
# ========================================
@admin.register(Modelo)
class ModeloAdmin(admin.ModelAdmin):
    list_display = ('Modelo_ID', 'Modelo_nombre', 'cantidad_prendas')
    search_fields = ('Modelo_nombre',)
    ordering = ('Modelo_nombre',)
    list_per_page = 20
    
    def cantidad_prendas(self, obj):
        return obj.prendas.count()
    cantidad_prendas.short_description = 'Prendas con este modelo'


# ========================================
# ADMIN PARA MARCA
# ========================================
@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ('Marca_ID', 'Marca_nombre', 'cantidad_prendas')
    search_fields = ('Marca_nombre',)
    ordering = ('Marca_nombre',)
    list_per_page = 20
    
    def cantidad_prendas(self, obj):
        return obj.prendas.count()
    cantidad_prendas.short_description = 'Prendas de esta marca'