from django.contrib import admin # Importa el módulo admin de Django
from .models import Pedido, PedidosXPrendas # Importa los modelos definidos en models.py

class PedidoAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Pedido
    list_display = ('Pedido_ID', 'Usuario', 'Pedido_fecha', 'Pedido_estado')  # Campos a mostrar en la lista
    search_fields = ('Pedido_ID',)  # Campos por los que se puede buscar

class PedidosXPrendasAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo PedidosXPrendas
    list_display = ('pedido', 'prenda', 'Pedido_prenda_cantidad', 'Pedido_prenda_precio_total')  # Campos a mostrar en la lista
    search_fields = ('pedido', 'prenda')  # Campos por los que se puede buscar

# Registramos los modelos para que aparezcan en el admin de Django
admin.site.register(Pedido, PedidoAdmin) # Registramos el modelo Pedido con su configuración personalizada
admin.site.register(PedidosXPrendas, PedidosXPrendasAdmin) # Registramos el modelo PedidosXPrendas con su configuración personalizada
