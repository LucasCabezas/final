from rest_framework import serializers
from .models import Pedido, PedidosXPrendas, DetallePedido

class DetallePedidoSerializer(serializers.ModelSerializer):
    prenda_nombre = serializers.CharField(source='prenda.Prenda_nombre', read_only=True)
    prenda_color = serializers.CharField(source='prenda.Prenda_color.Color_nombre', read_only=True)
    prenda_modelo = serializers.CharField(source='prenda.Prenda_modelo.Modelo_nombre', read_only=True)
    prenda_marca = serializers.CharField(source='prenda.Prenda_marca.Marca_nombre', read_only=True)
    prenda_imagen = serializers.ImageField(source='prenda.Prenda_imagen', read_only=True)  # 👈 agregado
    talle_nombre = serializers.CharField(source='talle.Talle_codigo', read_only=True)  # 🔥 AGREGADO

    class Meta:
        model = DetallePedido
        fields = [
            'id', 'prenda', 'prenda_nombre', 'prenda_marca', 'prenda_modelo', 'prenda_color',
            'prenda_imagen', 'cantidad', 'tipo', 'talle', 'talle_nombre', 'precio_unitario', 'precio_total'
        ]

class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True, read_only=True)
    usuario = serializers.CharField(source='Usuario.username', read_only=True)

    class Meta:
        model = Pedido
        fields = ['Pedido_ID', 'Usuario', 'usuario', 'Pedido_fecha', 'Pedido_estado', 'detalles']

class PedidosXPrendasSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedidosXPrendas
        fields = '__all__'