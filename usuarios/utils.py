# usuarios/utils.py

import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.models import User

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