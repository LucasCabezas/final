from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # APIs de otras apps
    path('api/clasificaciones/', include('clasificaciones.urls')),
    path('api/inventario/', include('inventario.urls')),
    path('api/pedidos/', include('pedidos.urls')),
    path('api/talleres/', include('talleres.urls')),

    # Usuarios y login bajo /api/usuarios/
    path('api/usuarios/', include('usuarios.urls')),
]
