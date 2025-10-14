from rest_framework import serializers # Importa el módulo serializers de Django REST Framework
from .models import Pedido, PedidosXPrendas,DetallePedido # Importa los modelos necesarios desde el archivo models.py

class PedidoSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Pedido
    class Meta: # Clase Meta para definir la configuración del serializador
        model = Pedido # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class PedidosXPrendasSerializer(serializers.ModelSerializer): # Define un serializador para el modelo PedidosXPrendas
    class Meta: # Clase Meta para definir la configuración del serializador
        model = PedidosXPrendas # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización
class DetallePedidoSerializer(serializers.ModelSerializer):
    prenda_nombre = serializers.CharField(source='prenda.Prenda_nombre', read_only=True)
    talle_nombre = serializers.CharField(source='talle.Talle_nombre', read_only=True)

    class Meta:
        model = DetallePedido
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(source='detallepedido_set', many=True, read_only=True)
