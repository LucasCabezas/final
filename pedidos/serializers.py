from rest_framework import serializers # Importa el módulo serializers de Django REST Framework
from .models import Pedido, PedidosXPrendas # Importa los modelos necesarios desde el archivo models.py

class PedidoSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Pedido
    class Meta: # Clase Meta para definir la configuración del serializador
        model = Pedido # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class PedidosXPrendasSerializer(serializers.ModelSerializer): # Define un serializador para el modelo PedidosXPrendas
    class Meta: # Clase Meta para definir la configuración del serializador
        model = PedidosXPrendas # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización