from rest_framework import serializers # Importa el módulo serializers de Django REST Framework
from .models import Taller, PrendasXTalleres # Importa los modelos necesarios desde el archivo models.py

class TallerSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Taller
    class Meta: # Clase Meta para definir la configuración del serializador
        model = Taller # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class PrendasXTalleresSerializer(serializers.ModelSerializer): # Define un serializador para el modelo PrendasXTalleres
    class Meta: # Clase Meta para definir la configuración del serializador
        model = PrendasXTalleres # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización