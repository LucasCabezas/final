# clasificaciones/serializers.py

from rest_framework import serializers
from .models import Talle, TallesXPrendas, Color, Modelo, Marca


# ========================================
# SERIALIZER PARA TALLE
# ========================================
class TalleSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Talle"""
    class Meta:
        model = Talle
        fields = '__all__'


# ========================================
# SERIALIZER PARA TALLES X PRENDAS
# ========================================
class TallesXPrendasSerializer(serializers.ModelSerializer):
    """Serializador para la relación Talle-Prenda con stock"""
    talle_codigo = serializers.CharField(source='talle.Talle_codigo', read_only=True)
    talle_id = serializers.IntegerField(source='talle.Talle_ID', read_only=True)
    prenda_nombre = serializers.CharField(source='prenda.Prenda_nombre', read_only=True)
    
    class Meta:
        model = TallesXPrendas
        fields = ['id', 'talle', 'talle_id', 'talle_codigo', 'prenda', 'prenda_nombre', 'stock']


# ========================================
# SERIALIZER PARA COLOR
# ========================================
class ColorSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Color"""
    cantidad_prendas = serializers.IntegerField(source='prendas.count', read_only=True)
    
    class Meta:
        model = Color
        fields = ['Color_ID', 'Color_nombre', 'cantidad_prendas']


# ========================================
# SERIALIZER PARA MODELO
# ========================================
class ModeloSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Modelo"""
    cantidad_prendas = serializers.IntegerField(source='prendas.count', read_only=True)
    
    class Meta:
        model = Modelo
        fields = ['Modelo_ID', 'Modelo_nombre', 'cantidad_prendas']


# ========================================
# SERIALIZER PARA MARCA
# ========================================
class MarcaSerializer(serializers.ModelSerializer):
    """Serializador para el modelo Marca"""
    cantidad_prendas = serializers.IntegerField(source='prendas.count', read_only=True)
    
    class Meta:
        model = Marca
        fields = ['Marca_ID', 'Marca_nombre', 'cantidad_prendas']
