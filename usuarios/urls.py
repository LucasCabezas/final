from django.urls import path
from .views import (
    LoginView,
    ValidarCorreoView,
    RolesPorUsuarioView,
    UsuarioList,
    UsuarioDetail,
    RolList,
    RolDetail,
    RolesXUsuariosList,
    RolesXUsuariosDetail,
)

urlpatterns = [
    # Login y autenticación
    path('login/', LoginView.as_view(), name='login'),
    path('validar-correo/', ValidarCorreoView.as_view(), name='validar-correo'),
    path('roles-por-usuario/<int:usuario_id>/', RolesPorUsuarioView.as_view(), name='roles-por-usuario'),
    
    # CRUD Usuarios
    path('usuarios/', UsuarioList.as_view(), name='usuario-list'),
    path('usuarios/<int:pk>/', UsuarioDetail.as_view(), name='usuario-detail'),
    
    # CRUD Roles
    path('roles/', RolList.as_view(), name='rol-list'),
    path('roles/<int:pk>/', RolDetail.as_view(), name='rol-detail'),
    
    # Asignar roles a usuarios
    path('roles-x-usuarios/', RolesXUsuariosList.as_view(), name='roles-x-usuarios-list'),
    path('roles-x-usuarios/<str:pk>/', RolesXUsuariosDetail.as_view(), name='roles-x-usuarios-detail'),
]