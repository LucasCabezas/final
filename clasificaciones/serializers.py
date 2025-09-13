from rest_framework import serializers # Importa el módulo serializers de Django REST Framework
from .models import Talle, TallesXPrendas, Color, ColoresXPrendas, Modelo, ModelosXPrendas, Marca, MarcasXPrendas # Importa los modelos necesarios desde el archivo models.py

class TalleSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Talle
    class Meta: # Clase Meta para definir la configuración del serializador
        model = Talle # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class TallesXPrendasSerializer(serializers.ModelSerializer): # Define un serializador para el modelo TallesXPrendas
    class Meta: # Clase Meta para definir la configuración del serializador
        model = TallesXPrendas # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class ColorSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Color
    class Meta: # Clase Meta para definir la configuración del serializador
        model = Color # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class ColoresXPrendasSerializer(serializers.ModelSerializer): # Define un serializador para el modelo ColoresXPrendas
    class Meta: # Clase Meta para definir la configuración del serializador
        model = ColoresXPrendas # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class ModeloSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Modelo
    class Meta: # Clase Meta para definir la configuración del serializador
        model = Modelo # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class ModelosXPrendasSerializer(serializers.ModelSerializer): # Define un serializador para el modelo ModelosXPrendas
    class Meta: # Clase Meta para definir la configuración del serializador
        model = ModelosXPrendas # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class MarcaSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Marca
    class Meta: # Clase Meta para definir la configuración del serializador
        model = Marca # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class MarcasXPrendasSerializer(serializers.ModelSerializer): # Define un serializador para el modelo MarcasXPrendas
    class Meta: # Clase Meta para definir la configuración del serializador
        model = MarcasXPrendas # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización