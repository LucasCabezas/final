# usuarios/serializers.py

from rest_framework import serializers
from django.core.validators import validate_email
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

# ========================================
# Serializers para recuperación de contraseña
# ========================================

class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer para solicitar recuperación de contraseña.
    Valida que el email exista en el sistema.
    """
    email = serializers.EmailField()

    def validate_email(self, value):
        """
        Valida que el email exista en el sistema
        """
        # Convertir a minúsculas para comparación
        value = value.lower()
        
        try:
            user = User.objects.get(email__iexact=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No existe un usuario registrado con este correo electrónico.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer para confirmar el cambio de contraseña.
    Valida el token y la nueva contraseña.
    """
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True, 
        style={'input_type': 'password'},
        help_text="Nueva contraseña"
    )
    confirm_password = serializers.CharField(
        write_only=True, 
        style={'input_type': 'password'},
        help_text="Confirmar nueva contraseña"
    )

    def validate(self, data):
        """
        Valida que las contraseñas coincidan y cumplan los requisitos
        """
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password": "Las contraseñas no coinciden."
            })
        
        # Validar la fortaleza de la contraseña usando los validadores de Django
        try:
            validate_password(data['new_password'])
        except Exception as e:
            raise serializers.ValidationError({
                "new_password": list(e.messages)
            })
        
        return data