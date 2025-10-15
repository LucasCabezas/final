from rest_framework import serializers
from .models import Pedido, PedidosXPrendas, DetallePedido

class DetallePedidoSerializer(serializers.ModelSerializer):
    prenda_nombre = serializers.CharField(source='prenda.Prenda_nombre', read_only=True)
    talle_nombre = serializers.CharField(source='talle.Talle_nombre', read_only=True)

    class Meta:
        model = DetallePedido
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(source='detallepedido_set', many=True, read_only=True)
    
    class Meta:
        model = Pedido
        fields = '__all__'

class PedidosXPrendasSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedidosXPrendas
        fields = '__all__'