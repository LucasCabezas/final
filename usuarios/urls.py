# usuarios/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView,
    CustomTokenObtainPairView,
    LogoutView,  # 🔥 NUEVO
    ValidarCorreoView,
    UsuarioList,
    UsuarioDetail,
    RolList,
    RolesPorUsuarioView,
    UsuarioFotoView,
    # Nuevas views para recuperación de contraseña
    password_reset_request,
    password_reset_confirm,
    verify_reset_token,
)

urlpatterns = [
    # 🔥 RUTAS JWT
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),  # 🔥 NUEVO
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rutas legacy (mantener para compatibilidad)
    path('login/', LoginView.as_view(), name='login'),
    path('validar-correo/', ValidarCorreoView.as_view(), name='validar-correo'),
    
    # CRUD Usuarios
    path('usuarios/', UsuarioList.as_view(), name='usuario-list'),
    path('usuarios/<int:pk>/', UsuarioDetail.as_view(), name='usuario-detail'),
    path('usuarios/<int:pk>/foto/', UsuarioFotoView.as_view(), name='usuario-foto'),
    
    # Roles
    path('roles/', RolList.as_view(), name='rol-list'),
    path('usuarios/<int:usuario_id>/roles/', RolesPorUsuarioView.as_view(), name='roles-por-usuario'),
    
    # 🔐 Rutas para recuperación de contraseña
    path('password-reset/request/', password_reset_request, name='password_reset_request'),
    path('password-reset/confirm/', password_reset_confirm, name='password_reset_confirm'),
    path('password-reset/verify-token/', verify_reset_token, name='verify_reset_token'),
]