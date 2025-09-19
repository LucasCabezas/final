from django.urls import path
from .views import (
    UsuarioList, UsuarioDetail,
    RolList, RolDetail,
    RolesXUsuariosList, RolesXUsuariosDetail,
    LoginView, ValidarCorreoView
)

urlpatterns = [
    # Usuarios
    path('', UsuarioList.as_view(), name='usuario-list'),
    path('<int:pk>/', UsuarioDetail.as_view(), name='usuario-detail'),

    # Roles
    path('roles/', RolList.as_view(), name='rol-list'),
    path('roles/<int:pk>/', RolDetail.as_view(), name='rol-detail'),

    # Roles x Usuarios
    path('rolesxusuarios/', RolesXUsuariosList.as_view(), name='rolesxusuarios-list'),
    path('rolesxusuarios/<int:pk>/', RolesXUsuariosDetail.as_view(), name='rolesxusuarios-detail'),

    # Login
    path('login/', LoginView.as_view(), name='login'),

    # Validar correo
    path('validar-correo/', ValidarCorreoView.as_view(), name='validar-correo'),
]