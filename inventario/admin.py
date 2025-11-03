from django.contrib import admin  # Importa el módulo admin de Django
from .models import Insumo, Prenda, InsumosXPrendas, UnidadMedida, TipoInsumo  # Importa los modelos locales
from clasificaciones.models import Talle, Color, Modelo, Marca  # Importa los modelos de Clasificaciones


# ===========================================================
# 🔹 CONFIGURACIÓN ADMIN DE INSUMO
# ===========================================================
@admin.register(Insumo)
class InsumoAdmin(admin.ModelAdmin):
    list_display = (
        'Insumo_ID',
        'Insumo_nombre',
        'Insumo_cantidad',
        'unidad_medida_nombre',   # ✅ muestra el nombre de la unidad (FK)
        'tipo_insumo_nombre',     # ✅ muestra el nombre del tipo
        'Insumo_precio_unitario',
        'Insumo_precio_total',
        'Insumo_cantidad_minima', # ✅ nuevo campo
    )
    search_fields = ('Insumo_nombre',)

    def unidad_medida_nombre(self, obj):
        return obj.unidad_medida.nombre
    unidad_medida_nombre.short_description = "Unidad de medida"

    def tipo_insumo_nombre(self, obj):
        return obj.tipo_insumo.nombre
    tipo_insumo_nombre.short_description = "Tipo de insumo"


# ===========================================================
# 🔹 CONFIGURACIÓN ADMIN DE PRENDA
# ===========================================================
@admin.register(Prenda)
class PrendaAdmin(admin.ModelAdmin):
    list_display = ('Prenda_ID', 'Prenda_nombre', 'Prenda_precio_unitario')
    search_fields = ('Prenda_nombre',)


# ===========================================================
# 🔹 CONFIGURACIÓN ADMIN DE INSUMOS X PRENDAS
# ===========================================================
@admin.register(InsumosXPrendas)
class InsumosXPrendasAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'insumo',
        'prenda',
        'Insumo_prenda_cantidad_utilizada',
        'Insumo_prenda_unidad_medida',
        'Insumo_prenda_costo_total'
    )
    search_fields = ('insumo__Insumo_nombre', 'prenda__Prenda_nombre')


# ===========================================================
# 🔹 CONFIGURACIÓN ADMIN DE TABLAS REFERENCIALES
# ===========================================================
@admin.register(UnidadMedida)
class UnidadMedidaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre')
    search_fields = ('nombre',)


@admin.register(TipoInsumo)
class TipoInsumoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre')
    search_fields = ('nombre',)
