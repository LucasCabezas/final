from django.contrib import admin
from .models import Pedido, PedidosXPrendas, DetallePedido

class PedidoAdmin(admin.ModelAdmin):
    list_display = ('Pedido_ID', 'Usuario', 'Pedido_fecha', 'Pedido_estado')
    search_fields = ('Pedido_ID',)

class PedidosXPrendasAdmin(admin.ModelAdmin):
    list_display = ('pedido', 'prenda', 'Pedido_prenda_cantidad', 'Pedido_prenda_precio_total')
    search_fields = ('pedido', 'prenda')

# NUEVO: Admin para DetallePedido
class DetallePedidoAdmin(admin.ModelAdmin):
    list_display = [
        'pedido',
        'prenda',
        'marca',
        'modelo',
        'color',
        'talle',
        'tipo',
        'cantidad',
        'precio_unitario',
        'precio_total'
    ]
    list_filter = ['tipo', 'marca', 'prenda']
    search_fields = ['prenda__Prenda_nombre', 'marca__Marca_nombre', 'modelo__Modelo_nombre']
    readonly_fields = [
        'costo_materiales',
        'costo_mano_obra_costura',
        'costo_estampado',
        'precio_unitario',
        'precio_total'
    ]
    
    fieldsets = (
        ('Información del Pedido', {
            'fields': ('pedido',)
        }),
        ('Detalles de la Prenda', {
            'fields': ('prenda', 'marca', 'modelo', 'color', 'talle', 'tipo', 'cantidad')
        }),
        ('Costos (Calculados Automáticamente)', {
            'fields': ('costo_materiales', 'costo_mano_obra_costura', 'costo_estampado', 'precio_unitario', 'precio_total'),
            'classes': ('collapse',)
        }),
    )

# Registros
admin.site.register(Pedido, PedidoAdmin)
admin.site.register(PedidosXPrendas, PedidosXPrendasAdmin)
admin.site.register(DetallePedido, DetallePedidoAdmin)  # NUEVO
