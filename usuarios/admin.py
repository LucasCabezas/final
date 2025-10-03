from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import PerfilUsuario

class PerfilUsuarioInline(admin.StackedInline):
    model = PerfilUsuario
    can_delete = False
    verbose_name_plural = 'Perfil'
    fields = ('dni',)

class UserAdmin(BaseUserAdmin):
    inlines = (PerfilUsuarioInline,)
    
    # Campos a mostrar en la lista
    list_display = (
        'username', 
        'email', 
        'first_name', 
        'last_name', 
        'get_dni', 
        'get_password_hash',  # Agregar este
        'is_staff', 
        'get_grupos'
    )
    
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    
    def get_dni(self, obj):
        return obj.perfil.dni if hasattr(obj, 'perfil') else '-'
    get_dni.short_description = 'DNI'
    
    def get_grupos(self, obj):
        return ', '.join([g.name for g in obj.groups.all()])
    get_grupos.short_description = 'Roles'
    
    # Método para mostrar el hash de la contraseña
    def get_password_hash(self, obj):
        return obj.password[:50] + '...' if len(obj.password) > 50 else obj.password
    get_password_hash.short_description = 'Password Hash'
    
    fieldsets = (
        ('Información de acceso', {
            'fields': ('username', 'password')
        }),
        ('Información personal', {
            'fields': ('first_name', 'last_name', 'email')
        }),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Fechas importantes', {
            'fields': ('last_login', 'date_joined')
        }),
    )

admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(PerfilUsuario)
class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ('user', 'dni')
    search_fields = ('user__username', 'user__email', 'dni')