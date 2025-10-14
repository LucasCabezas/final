"""
Django settings for mi_proyecto project.
"""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------------------------------------
# 🔒 Seguridad y configuración básica
# ---------------------------------------------------
SECRET_KEY = 'django-insecure-ojd8!zuy5a$pnc)yi6aqy-so)_pe)uz)5t4z=rtr^ef9jm&^sb'
DEBUG = True
ALLOWED_HOSTS = ['*']  # ✅ Permite conexiones desde cualquier origen en desarrollo

# ---------------------------------------------------
# 🔧 Aplicaciones instaladas
# ---------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    # Apps locales
    'clasificaciones',
    'inventario',
    'pedidos',
    'talleres',
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
        'USER': 'root',
        'PASSWORD': '1234',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
        }
    }
}

# ---------------------------------------------------
# 🔑 Validación de contraseñas
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
TIME_ZONE = 'UTC'
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

# ---------------------------------------------------
# 🧠 Logs
# ---------------------------------------------------
LOGGING = {  # ✅ CORREGIDO (antes tenías "LLOGGING")
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
# 🔧 Default primary key
# ---------------------------------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
