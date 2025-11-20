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

def get_lockout_level_key(username):
    """Genera la clave para almacenar el nivel de bloqueo (cuántas veces ha sido bloqueado)"""
    return f"lockout_level_{username.lower()}"

def get_failed_attempts(username):
    """Obtiene el número de intentos fallidos"""
    key = get_lockout_key(username)
    return cache.get(key, 0)

def get_lockout_level(username):
    """Obtiene el nivel de bloqueo actual (0=ninguno, 1=primer bloqueo, 2=segundo, etc.)"""
    key = get_lockout_level_key(username)
    return cache.get(key, 0)

def increment_failed_attempts(username):
    """Incrementa el contador de intentos fallidos"""
    key = get_lockout_key(username)
    attempts = get_failed_attempts(username)
    attempts += 1
    
    # Guardar intentos con TTL de 24 horas (no se borra hasta login exitoso)
    cache.set(key, attempts, 86400)
    
    # Si se alcanzó el límite de 3 intentos, bloquear
    if attempts >= 3 and attempts % 3 == 0:
        # Incrementar nivel de bloqueo
        level = get_lockout_level(username)
        level += 1
        level_key = get_lockout_level_key(username)
        cache.set(level_key, level, 86400)  # TTL 24 horas
        
        # Calcular tiempo de bloqueo según el nivel
        lockout_duration = get_lockout_duration_by_level(level)
        
        # Establecer tiempo de bloqueo
        lockout_until = datetime.now() + timedelta(seconds=lockout_duration)
        time_key = get_lockout_time_key(username)
        cache.set(time_key, lockout_until.isoformat(), lockout_duration + 60)  # +60 seg extra de margen
    
    return attempts

def get_lockout_duration_by_level(level):
    """Retorna duración del bloqueo en segundos según el nivel de bloqueo"""
    if level == 1:
        return 300  # 5 minutos (primer bloqueo)
    elif level == 2:
        return 900  # 15 minutos (segundo bloqueo)
    elif level == 3:
        return 1800  # 30 minutos (tercer bloqueo)
    else:
        return 3600  # 1 hora (cuarto bloqueo en adelante)

def is_user_locked(username):
    """Verifica si el usuario está bloqueado"""
    time_key = get_lockout_time_key(username)
    lockout_until_str = cache.get(time_key)
    
    if not lockout_until_str:
        return False, None
    
    lockout_until = datetime.fromisoformat(lockout_until_str)
    
    if datetime.now() < lockout_until:
        remaining = lockout_until - datetime.now()
        return True, remaining
    
    # Si ya pasó el tiempo de bloqueo, NO resetear todo
    # Solo eliminar el tiempo de bloqueo, mantener intentos y nivel
    cache.delete(time_key)
    return False, None

def reset_failed_attempts(username):
    """Resetea completamente los intentos fallidos y el nivel de bloqueo (solo en login exitoso)"""
    key = get_lockout_key(username)
    time_key = get_lockout_time_key(username)
    level_key = get_lockout_level_key(username)
    cache.delete(key)
    cache.delete(time_key)
    cache.delete(level_key)

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