from django.urls import path, include # Importa la función path para definir rutas
from .views import UsuarioList, UsuarioDetail, RolList, RolDetail, RolesXUsuariosList, RolesXUsuariosDetail # Importa las vistas desde el archivo views.py en el mismo directorio

urlpatterns = [ # Define las rutas URL para la aplicación usuarios
    path('usuarios/', UsuarioList.as_view(), name='usuario-list'), # Ruta para listar y crear usuarios
    path('usuarios/<int:pk>/', UsuarioDetail.as_view(), name='usuario-detail'), # Ruta para obtener, actualizar o eliminar un usuario específico
    path('roles/', RolList.as_view(), name='rol-list'), # Ruta para listar y crear roles
    path('roles/<int:pk>/', RolDetail.as_view(), name='rol-detail'), # Ruta para obtener, actualizar o eliminar un rol específico
    path('rolesxusuarios/', RolesXUsuariosList.as_view(), name='rolesxusuarios-list'), # Ruta para listar y crear asociaciones entre roles y usuarios
    path('rolesxusuarios/<int:pk>/', RolesXUsuariosDetail.as_view(), name='rolesxusuarios-detail'), # Ruta para obtener, actualizar o eliminar una asociación específica entre roles y usuarios
]  