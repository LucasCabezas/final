from django.contrib import admin # Importa el módulo admin de Django
from .models import Rol, Usuario, RolesXUsuarios # Importa los modelos definidos en models.py

class RolAdmin(admin.ModelAdmin): # Configuración del admin para el modelo Rol
    list_display = ('Rol_ID', 'Rol_nombre') # Campos a mostrar en la lista
    search_fields = ('Rol_nombre',) # Campos por los que se puede buscar

class UsuarioAdmin(admin.ModelAdmin): # Configuración del admin para el modelo Usuario
    list_display = ('Usuario_ID', 'Usuario_nombre', 'Usuario_apellido', 'Usuario_email', 'Usuario_dni', 'Usuario_contrasena') # Campos a mostrar en la lista
    search_fields = ('Usuario_nombre', 'Usuario_apellido', 'Usuario_dni') # Campos por los que se puede buscar

class RolesXUsuariosAdmin(admin.ModelAdmin): # Configuración del admin para el modelo RolesXUsuarios
    list_display = ('rol', 'usuario') # Campos a mostrar en la lista
    search_fields = ('rol', 'usuario') # Campos por los que se puede buscar

# Registramos los modelos para que aparezcan en el admin de Django
admin.site.register(Rol, RolAdmin) # Registra el modelo Rol con su configuración
admin.site.register(Usuario, UsuarioAdmin) # Registra el modelo Usuario con su configuración
admin.site.register(RolesXUsuarios, RolesXUsuariosAdmin) # Registra el modelo RolesXUsuarios con su configuración