from django.contrib import admin
from django.urls import path, include
from django.conf import settings                # ✅ Necesario para MEDIA_URL y MEDIA_ROOT
from django.conf.urls.static import static       # ✅ Necesario para servir archivos multimedia

urlpatterns = [
    path('admin/', admin.site.urls),

    # APIs de otras apps
    path('api/clasificaciones/', include('clasificaciones.urls')),
    path('api/inventario/', include('inventario.urls')),
    path('api/pedidos/', include('pedidos.urls')),
    path('api/usuarios/', include('usuarios.urls')),
]

# ✅ Agregá esto fuera del bloque urlpatterns
if settings.DEBUG:  
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)