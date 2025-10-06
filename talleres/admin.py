from django.contrib import admin # Importa el módulo admin de Django
from .models import Taller, PrendasXTalleres # Importa los modelos definidos en models.py

class TallerAdmin(admin.ModelAdmin): # Configuración del admin para el modelo Taller
    list_display = ('Taller_ID', 'Taller_nombre', 'Taller_direccion') # Campos a mostrar en la lista
    search_fields = ('Taller_nombre',) # Campos por los que se puede buscar

class PrendasXTalleresAdmin(admin.ModelAdmin): # Configuración del admin para el modelo PrendasXTalleres
    list_display = ('prenda', 'taller', 'Prenda_taller_mano_obra', 'Prenda_taller_total') # Campos a mostrar en la lista
    search_fields = ('prenda', 'taller') # Campos por los que se puede buscar

# Registramos los modelos para que aparezcan en el admin de Django
admin.site.register(Taller, TallerAdmin) # Registra el modelo Taller con su configuración
admin.site.register(PrendasXTalleres, PrendasXTalleresAdmin) # Registra el modelo PrendasXTalleres con su configuración