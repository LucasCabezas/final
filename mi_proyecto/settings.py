"""
Django settings for mi_proyecto project.
"""

from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------------------------------------
# 🔒 Seguridad y configuración básica
# ---------------------------------------------------
SECRET_KEY = 'django-insecure-ojd8!zuy5a$pnc)yi6aqy-so)_pe)uz)5t4z=rtr^ef9jm&^sb'
DEBUG = True
ALLOWED_HOSTS = ['*']  # ✅ Permite conexiones desde cualquier origen en desarrollo

# ---------------------------------------------------
# 📧 Aplicaciones instaladas
# ---------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',  # 🔥 NUEVO: JWT
    'corsheaders',
    # Apps locales
    'clasificaciones',
    'inventario',
    'pedidos',
    'usuarios',
]

# ---------------------------------------------------
# ⚙️ Middleware
# ---------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Importante que esté arriba de CommonMiddleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mi_proyecto.urls'

# ---------------------------------------------------
# 🔥 CONFIGURACIÓN JWT
# ---------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',  # Mantener para admin
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # Por defecto requiere auth
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),  # Token dura 2 horas
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  # Refresh dura 7 días
    'ROTATE_REFRESH_TOKENS': True,  # Rota refresh tokens
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

# ---------------------------------------------------
# 🧩 Templates
# ---------------------------------------------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mi_proyecto.wsgi.application'

# ---------------------------------------------------
# 🗄️ Base de datos
# ---------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'king_importados',
        'USER': 'admin',
        'PASSWORD': '123456',
        'HOST': 'localhost',
        'PORT': '3307',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
        }
    }
}

# ---------------------------------------------------
# 🔒 Validación de contraseñas
# ---------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ---------------------------------------------------
# 🌎 Internacionalización
# ---------------------------------------------------
LANGUAGE_CODE = 'es-AR'
TIME_ZONE = 'America/Argentina/Salta'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# ---------------------------------------------------
# 📂 Archivos estáticos y multimedia
# ---------------------------------------------------
STATIC_URL = '/static/'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ✅ Recomendado en desarrollo para servir estáticos locales
STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# ---------------------------------------------------
# 🌐 CORS
# ---------------------------------------------------
CORS_ALLOW_ALL_ORIGINS = True

# 🔥 HEADERS CORS PARA JWT
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# ---------------------------------------------------
# 📧 Configuración de Email - MODO PRUEBA (CONSOLA)
# ---------------------------------------------------
# ⚠️ CONFIGURACIÓN TEMPORAL PARA DESARROLLO
# El email se mostrará en la consola de Django en lugar de enviarse
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'noreply@kingimportados.com'

# 💾 CONFIGURACIÓN DE GMAIL PARA PRODUCCIÓN (COMENTADA)
# Descomenta estas líneas cuando quieras enviar emails reales
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'eliosuffikpo@gmail.com'
# EMAIL_HOST_PASSWORD = 'uylz ahde vptx ccty'
# DEFAULT_FROM_EMAIL = 'eliosuffikpo@gmail.com'

# ---------------------------------------------------
# 🔐 Configuración JWT para recuperación de contraseña
# ---------------------------------------------------
JWT_SECRET_KEY = SECRET_KEY  # Usa la SECRET_KEY existente
JWT_ALGORITHM = 'HS256'
JWT_PASSWORD_RESET_TOKEN_EXPIRY = 30  # Minutos de expiración del token

# ---------------------------------------------------
# 🌐 URL del Frontend (para el link de recuperación)
# ---------------------------------------------------
FRONTEND_URL = 'http://localhost:3000'  # Cambia esto en producción a tu dominio real

# ---------------------------------------------------
# 🧠 Logs
# ---------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}

# ---------------------------------------------------
# 📧 Default primary key
# ---------------------------------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}