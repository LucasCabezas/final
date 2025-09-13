from rest_framework import serializers # Importa el módulo serializers de Django REST Framework
from .models import Usuario, Rol, RolesXUsuarios # Importa los modelos Usuario, Rol y RolesXUsuarios desde el archivo models.py en el mismo directorio

class UsuarioSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Usuario
    class Meta: # Clase interna Meta para definir la configuración del serializador
        model = Usuario # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class RolSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Rol
    class Meta: # Clase interna Meta para definir la configuración del serializador
        model = Rol # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class RolesXUsuariosSerializer(serializers.ModelSerializer): # Define un serializador para el modelo RolesXUsuarios
    class Meta: # Clase interna Meta para definir la configuración del serializador
        model = RolesXUsuarios # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización