from django.contrib import admin

from django.contrib import admin
from .models import Rol, Usuario, Insumo, Prenda, InsumosXPrendas, Taller, PrendasXTalleres, Pedido, PedidosXPrendas, RolesXUsuarios

class RolAdmin(admin.ModelAdmin):
    list_display = ('Rol_ID', 'Rol_nombre') 
    search_fields = ('Rol_ID',)

class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('Usuario_ID', 'Usuario_nombre', 'Usuario_apellido', 'Usuario_email', 'Usuario_dni', 'Usuario_contrasena', 'rol_id')
    search_fields = ('Usuario_ID',)

class InsumoAdmin(admin.ModelAdmin):
    list_display = ('Insumo_ID', 'Insumo_nombre', 'Insumo_precio_unitario', 'Insumo_cantidad', 'Insumo_unidad_medida', 'Insumo_precio_total') 
    search_fields = ('Insumo_ID',)
class PrendaAdmin(admin.ModelAdmin):
    list_display = ('Prenda_ID', 'Prenda_stock', 'Prenda_precio_unitario', 'Prenda_descripcion', 'Prenda_color', 'Prenda_talle') 
    search_fields = ('Prenda_ID',)

class InsumosXPrendasAdmin(admin.ModelAdmin):
    list_display = ('insumo', 'prenda', 'Insumo_prenda_cantidad_utilizada', 'Insumo_prenda_unidad_medida', 'Insumo_prenda_costo_total') 
    search_fields = ('insumo', 'prenda')

class TallerAdmin(admin.ModelAdmin):
    list_display = ('Taller_ID', 'Taller_nombre', 'Taller_direccion') 
    search_fields = ('Taller_ID',)

class PrendasXTalleresAdmin(admin.ModelAdmin):
    list_display = ('id', 'Prenda_taller_mano_obra', 'Prenda_taller_total', 'prenda_id','taller_id', 'insumo_x_prenda_id') 
    search_fields = ('taller_id', 'prenda_id')

class PedidoAdmin(admin.ModelAdmin):
    list_display = ('Pedido_ID', 'Pedido_fecha', 'Pedido_estado', 'Pedido_usuario_id') 
    search_fields = ('Pedido_ID',)

class PedidosXPrendasAdmin(admin.ModelAdmin):
    list_display = ('id', 'Pedido_prenda_cantidad', 'Pedido_prenda_precio_total', 'pedido_id', 'prenda_id') 
    search_fields = ('pedido_id', 'prenda_id')

class RolesXUsuariosAdmin(admin.ModelAdmin):
    list_display = ('id', 'rol_id', 'usuario_id') 
    search_fields = ('rol_id', 'usuario_id')

# Registramos los modelos para que aparezcan en el admin
admin.site.register(Rol, RolAdmin)
admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Insumo, InsumoAdmin)
admin.site.register(Prenda, PrendaAdmin)
admin.site.register(InsumosXPrendas, InsumosXPrendasAdmin)
admin.site.register(Taller, TallerAdmin)
admin.site.register(PrendasXTalleres, PrendasXTalleresAdmin)
admin.site.register(Pedido, PedidoAdmin)
admin.site.register(PedidosXPrendas, PedidosXPrendasAdmin)
admin.site.register(RolesXUsuarios, RolesXUsuariosAdmin)