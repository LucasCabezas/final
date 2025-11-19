# usuarios/utils.py

import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.models import User
from django.core.cache import cache

# ========================================
# 🔥 NUEVO: Sistema de bloqueo por intentos fallidos
# ========================================

def get_lockout_key(username):
    """Genera la clave para almacenar intentos fallidos"""
    return f"login_attempts_{username.lower()}"

def get_lockout_time_key(username):
    """Genera la clave para almacenar el tiempo de bloqueo"""
    return f"lockout_until_{username.lower()}"

def get_failed_attempts(username):
    """Obtiene el número de intentos fallidos"""
    key = get_lockout_key(username)
    return cache.get(key, 0)

def increment_failed_attempts(username):
    """Incrementa el contador de intentos fallidos"""
    key = get_lockout_key(username)
    attempts = get_failed_attempts(username)
    attempts += 1
    
    # Calcular tiempo de bloqueo según intentos
    lockout_duration = get_lockout_duration(attempts)
    
    # Guardar intentos (expira después del tiempo de bloqueo)
    cache.set(key, attempts, lockout_duration)
    
    # Si se alcanzó el límite, establecer tiempo de bloqueo
    if attempts >= 3:
        lockout_until = datetime.now() + timedelta(seconds=lockout_duration)
        time_key = get_lockout_time_key(username)
        cache.set(time_key, lockout_until.isoformat(), lockout_duration)
    
    return attempts

def get_lockout_duration(attempts):
    """Retorna duración del bloqueo en segundos según intentos"""
    if attempts < 3:
        return 300  # 5 minutos para mantener el contador
    elif attempts == 3:
        return 300  # 5 minutos
    elif attempts == 4:
        return 900  # 15 minutos
    elif attempts == 5:
        return 1800  # 30 minutos
    else:
        return 3600  # 1 hora

def is_user_locked(username):
    """Verifica si el usuario está bloqueado"""
    attempts = get_failed_attempts(username)
    
    if attempts < 3:
        return False, None
    
    time_key = get_lockout_time_key(username)
    lockout_until_str = cache.get(time_key)
    
    if not lockout_until_str:
        return False, None
    
    lockout_until = datetime.fromisoformat(lockout_until_str)
    
    if datetime.now() < lockout_until:
        remaining = lockout_until - datetime.now()
        return True, remaining
    
    # Si ya pasó el tiempo de bloqueo, limpiar
    reset_failed_attempts(username)
    return False, None

def reset_failed_attempts(username):
    """Resetea los intentos fallidos"""
    key = get_lockout_key(username)
    time_key = get_lockout_time_key(username)
    cache.delete(key)
    cache.delete(time_key)

def format_lockout_time(remaining_time):
    """Formatea el tiempo restante de bloqueo"""
    total_seconds = int(remaining_time.total_seconds())
    
    if total_seconds >= 3600:
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        return f"{hours}h {minutes}m"
    elif total_seconds >= 60:
        minutes = total_seconds // 60
        seconds = total_seconds % 60
        return f"{minutes}m {seconds}s"
    else:
        return f"{total_seconds}s"

# ========================================
# Funciones para tokens de recuperación (YA EXISTENTES)
# ========================================

def generate_password_reset_token(user):
    """
    Genera un token JWT para recuperación de contraseña
    """
    payload = {
        'user_id': user.id,
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(minutes=settings.JWT_PASSWORD_RESET_TOKEN_EXPIRY),
        'iat': datetime.utcnow(),
        'type': 'password_reset'
    }
    
    token = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return token

def verify_password_reset_token(token):
    """
    Verifica y decodifica el token JWT
    Retorna el usuario si es válido, None si no lo es
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        # Verificar que sea un token de tipo password_reset
        if payload.get('type') != 'password_reset':
            return None
            
        # Verificar que el usuario existe
        user_id = payload.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            return None
            
    except jwt.ExpiredSignatureError:
        # Token expirado
        return None
    except jwt.InvalidTokenError:
        # Token inválido
        return None