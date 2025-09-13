from rest_framework import serializers # Importa el módulo serializers de Django REST Framework
from .models import Insumo, Prenda, InsumosXPrendas # Importa los modelos necesarios desde el archivo models.py

class InsumoSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Insumo
    class Meta: # Clase Meta para definir la configuración del serializador
        model = Insumo # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class PrendaSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Prenda
    class Meta: # Clase Meta para definir la configuración del serializador
        model = Prenda # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class InsumosXPrendasSerializer(serializers.ModelSerializer): # Define un serializador para el modelo InsumosXPrendas
    class Meta: # Clase Meta para definir la configuración del serializador
        model = InsumosXPrendas # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización