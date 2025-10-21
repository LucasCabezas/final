# usuarios/urls.py
from django.urls import path
from .views import (
    LoginView,
    ValidarCorreoView,
    UsuarioList,
    UsuarioDetail,
    RolList,
    RolesPorUsuarioView,
    UsuarioFotoView  # 🆕 AGREGAR
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('validar-correo/', ValidarCorreoView.as_view(), name='validar-correo'),
    path('usuarios/', UsuarioList.as_view(), name='usuario-list'),
    path('usuarios/<int:pk>/', UsuarioDetail.as_view(), name='usuario-detail'),
    path('usuarios/<int:pk>/foto/', UsuarioFotoView.as_view(), name='usuario-foto'),  # 🆕 AGREGAR
    path('roles/', RolList.as_view(), name='rol-list'),
    path('usuarios/<int:usuario_id>/roles/', RolesPorUsuarioView.as_view(), name='roles-por-usuario'),
]