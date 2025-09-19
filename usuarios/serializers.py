from rest_framework import serializers
from django.core.validators import validate_email
from .models import Usuario, Rol, RolesXUsuarios

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
        extra_kwargs = {
            'Usuario_contrasena': {'write_only': True}  # La contraseña solo se envía al crear/actualizar
        }

    def validate_Usuario_email(self, value):
        validate_email(value)
        return value

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class RolesXUsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolesXUsuarios
        fields = '__all__'