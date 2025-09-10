from rest_framework import serializers  # Importa el módulo serializers de Django REST Framework
from .models import Prenda  # Importa el modelo Prenda
from .models import Insumo  # Importa el modelo Insumo
from .models import Pedido  # Importa el modelo Pedido
from .models import Taller  # Importa el modelo Taller

class PrendaSerializer(serializers.ModelSerializer):  # Define un serializador para el modelo Prenda
    class Meta:  # Clase interna Meta para configurar el serializador
        model = Prenda  # Especifica que el modelo a serializar es Prenda
        fields = '__all__'  # Incluye todos los campos del modelo en el serializador

class InsumoSerializer(serializers.ModelSerializer):  # Define un serializador para el modelo Insumo
    class Meta:  # Clase interna Meta para configurar el serializador
        model = Insumo  # Especifica que el modelo a serializar es Insumo
        fields = '__all__'  # Incluye todos los campos del modelo en el serializador

class PedidoSerializer(serializers.ModelSerializer):  # Define un serializador para el modelo Pedido
    class Meta:  # Clase interna Meta para configurar el serializador
        model = Pedido  # Especifica que el modelo a serializar es Pedido
        fields = '__all__'  # Incluye todos los campos del modelo en el serializador

class TallerSerializer(serializers.ModelSerializer):  # Define un serializador para el modelo Taller
    class Meta:  # Clase interna Meta para configurar el serializador
        model = Taller  # Especifica que el modelo a serializar es Taller
        fields = '__all__'  # Incluye todos los campos del modelo