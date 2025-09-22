from django.contrib import admin # Importa el módulo admin de Django
from .models import Insumo, Prenda, InsumosXPrendas # Importa los modelos definidos en models.py
from clasificaciones.models import Talle, Color, Modelo, Marca # Importa los modelos de Clasificaciones

class InsumoAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Insumo
    list_display = ('Insumo_ID', 'Insumo_nombre', 'Insumo_precio_unitario', 'Insumo_cantidad', 'Insumo_unidad_medida', 'Insumo_precio_total')  # Campos a mostrar en la lista
    search_fields = ('Insumo_nombre',)  # Campos por los que se puede buscar

class PrendaAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Prenda
    list_display = ('Prenda_ID', 'Prenda_nombre', 'Prenda_precio_unitario')  # Campos a mostrar en la lista
    search_fields = ('Prenda_nombre',)  # Campos por los que se puede buscar

class InsumosXPrendasAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo InsumosXPrendas
    list_display = ('id', 'insumo', 'prenda', 'Insumo_prenda_cantidad_utilizada', 'Insumo_prenda_unidad_medida', 'Insumo_prenda_costo_total')  # Campos a mostrar en la lista
    search_fields = ('insumo', 'prenda')  # Campos por los que se puede buscar

# Registramos los modelos para que aparezcan en el admin de Django
admin.site.register(Insumo, InsumoAdmin) # Registramos el modelo Insumo con su configuración personalizada
admin.site.register(Prenda, PrendaAdmin) # Registramos el modelo Prenda con su configuración personalizada
admin.site.register(InsumosXPrendas, InsumosXPrendasAdmin) # Registramos el modelo InsumosXPrendas con su configuración personalizada