from django.contrib import admin  # Importa el módulo admin de Django
from .models import Rol, Usuario, Insumo, Prenda, InsumosXPrendas, Taller, PrendasXTalleres, Pedido, PedidosXPrendas, RolesXUsuarios, Talle, TallesXPrendas, Color, ColoresXPrendas, Modelo, ModelosXPrendas, Marca, MarcasXPrendas  # Importa los modelos definidos en models.py

class RolAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Rol
    list_display = ('Rol_ID', 'Rol_nombre')  # Campos a mostrar en la lista
    search_fields = ('Rol_nombre',)  # Campos por los que se puede buscar

class UsuarioAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Usuario
    list_display = ('Usuario_ID', 'Usuario_nombre', 'Usuario_apellido', 'Usuario_email', 'Usuario_dni', 'Usuario_contrasena')  # Campos a mostrar en la lista

class InsumoAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Insumo
    list_display = ('Insumo_ID', 'Insumo_nombre', 'Insumo_precio_unitario', 'Insumo_cantidad', 'Insumo_unidad_medida', 'Insumo_precio_total')  # Campos a mostrar en la lista
    search_fields = ('Insumo_nombre',)  # Campos por los que se puede buscar

class PrendaAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Prenda
    list_display = ('Prenda_ID', 'Prenda_stock', 'Prenda_nombre', 'Prenda_precio_unitario')  # Campos a mostrar en la lista
    search_fields = ('Prenda_nombre',)  # Campos por los que se puede buscar

class InsumosXPrendasAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo InsumosXPrendas
    list_display = ('insumo', 'prenda', 'Insumo_prenda_cantidad_utilizada', 'Insumo_prenda_unidad_medida', 'Insumo_prenda_costo_total')  # Campos a mostrar en la lista
    search_fields = ('insumo', 'prenda')  # Campos por los que se puede buscar

class TallerAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Taller
    list_display = ('Taller_ID', 'Taller_nombre', 'Taller_direccion')
    search_fields = ('Taller_nombre',)  # Campos por los que se puede buscar

class PrendasXTalleresAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo PrendasXTalleres
    list_display = ('prenda', 'taller','insumo_x_prenda', 'Prenda_taller_mano_obra', 'Prenda_taller_total')  # Campos a mostrar en la lista
    search_fields = ('prenda', 'taller')  # Campos por los que se puede buscar

class PedidoAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo Pedido
    list_display = ('Pedido_ID', 'Usuario', 'Pedido_fecha', 'Pedido_estado')  # Campos a mostrar en la lista
    search_fields = ('Pedido_ID',)  # Campos por los que se puede buscar

class PedidosXPrendasAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo PedidosXPrendas
    list_display = ('pedido', 'prenda', 'Pedido_prenda_cantidad', 'Pedido_prenda_precio_total')  # Campos a mostrar en la lista
    search_fields = ('pedido', 'prenda')  # Campos por los que se puede buscar

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

class RolesXUsuariosAdmin(admin.ModelAdmin):  # Configuración del admin para el modelo RolesXUsuarios
    list_display = ('rol', 'usuario')  # Campos a mostrar en la lista
    search_fields = ('rol', 'usuario')  # Campos por los que se puede buscar

# Registramos los modelos para que aparezcan en el admin de Django
admin.site.register(Rol, RolAdmin)  # Registra el modelo Rol con su configuración
admin.site.register(Usuario, UsuarioAdmin)  # Registra el modelo Usuario con su configuración
admin.site.register(Insumo, InsumoAdmin)  # Registra el modelo Insumo con su configuración
admin.site.register(Prenda, PrendaAdmin)  # Registra el modelo Prenda con su configuración
admin.site.register(InsumosXPrendas, InsumosXPrendasAdmin)  # Registra el modelo InsumosXPrendas con su configuración
admin.site.register(Taller, TallerAdmin)  # Registra el modelo Taller con su configuración
admin.site.register(PrendasXTalleres, PrendasXTalleresAdmin)  # Registra el modelo PrendasXTalleres con su configuración
admin.site.register(Pedido, PedidoAdmin)  # Registra el modelo Pedido con su configuración
admin.site.register(PedidosXPrendas, PedidosXPrendasAdmin)  # Registra el modelo PedidosXPrendas con su configuración
admin.site.register(Talle, TalleAdmin)  # Registra el modelo Talle con su configuración
admin.site.register(TallesXPrendas, TallesXPrendasAdmin)  # Registra el modelo TallesXPrendas con su configuración
admin.site.register(Color, ColorAdmin)  # Registra el modelo Color con su configuración
admin.site.register(ColoresXPrendas, ColoresXPrendasAdmin)  # Registra el modelo ColoresXPrendas con su configuración
admin.site.register(Modelo, ModeloAdmin)  # Registra el modelo Modelo con su configuración
admin.site.register(ModelosXPrendas, ModelosXPrendasAdmin)  # Registra el modelo ModelosXPrendas con su configuración
admin.site.register(Marca, MarcaAdmin)  # Registra el modelo Marca con su configuración
admin.site.register(MarcasXPrendas, MarcasXPrendasAdmin)  # Registra el modelo MarcasXPrendas con su configuración
admin.site.register(RolesXUsuarios, RolesXUsuariosAdmin)  # Registra el modelo RolesXUsuarios con su configuración