from django.contrib import admin # Importa el módulo admin de Django
from .models import Talle, TallesXPrendas, Color, ColoresXPrendas, Modelo, ModelosXPrendas, Marca, MarcasXPrendas # Importa los modelos definidos en models.py

class TalleAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Talle
    list_display = ('Talle_ID', 'Talle_codigo')  # Campos a mostrar en la lista
    search_fields = ('Talle_codigo',)  # Campos por los que se puede buscar

class TallesXPrendasAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo TallesXPrendas
    list_display = ('talle', 'prenda')  # Campos a mostrar en la lista
    search_fields = ('talle', 'prenda')  # Campos por los que se puede buscar

class ColorAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Color
    list_display = ('Color_ID', 'Color_nombre')  # Campos a mostrar en la lista
    search_fields = ('Color_nombre',)  # Campos por los que se puede buscar

class ColoresXPrendasAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo ColoresXPrendas
    list_display = ('color', 'prenda')  # Campos a mostrar en la lista
    search_fields = ('color', 'prenda')  # Campos por los que se puede buscar

class ModeloAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Modelo
    list_display = ('Modelo_ID', 'Modelo_nombre')  # Campos a mostrar en la lista
    search_fields = ('Modelo_nombre',)  # Campos por los que se puede buscar

class ModelosXPrendasAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo ModelosXPrendas
    list_display = ('modelo', 'prenda')  # Campos a mostrar en la lista
    search_fields = ('modelo', 'prenda')  # Campos por los que se puede buscar

class MarcaAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Marca
    list_display = ('Marca_ID', 'Marca_nombre')  # Campos a mostrar en la lista
    search_fields = ('Marca_nombre',)  # Campos por los que se puede buscar


class MarcasXPrendasAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo MarcasXPrendas
    list_display = ('marca', 'prenda')  # Campos a mostrar en la lista
    search_fields = ('marca', 'prenda')  # Campos por los que se puede buscar

# Registramos los modelos para que aparezcan en el admin de Django
admin.site.register(Talle, TalleAdmin)  # Registra el modelo Talle con su configuración
admin.site.register(TallesXPrendas, TallesXPrendasAdmin)  # Registra el modelo TallesXPrendas con su configuración
admin.site.register(Color, ColorAdmin)  # Registra el modelo Color con su configuración
admin.site.register(ColoresXPrendas, ColoresXPrendasAdmin)  # Registra el modelo ColoresXPrendas con su configuración
admin.site.register(Modelo, ModeloAdmin)  # Registra el modelo Modelo con su configuración
admin.site.register(ModelosXPrendas, ModelosXPrendasAdmin)  # Registra el modelo ModelosXPrendas con su configuración
admin.site.register(Marca, MarcaAdmin)  # Registra el modelo Marca con su configuración
admin.site.register(MarcasXPrendas, MarcasXPrendasAdmin)  # Registra el modelo MarcasXPrendas con su configuración