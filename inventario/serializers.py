from rest_framework import serializers
from .models import Insumo, Prenda, InsumosXPrendas, AlertaStock

class InsumoSerializer(serializers.ModelSerializer):
    # Campo calculado solo para lectura
    Insumo_precio_total = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Insumo
        fields = '__all__'
    
    def validate_Insumo_cantidad(self, value):
        if value < 0:
            raise serializers.ValidationError("La cantidad no puede ser negativa")
        return value
    
    def validate_Insumo_precio_unitario(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo")
        return value

class PrendaSerializer(serializers.ModelSerializer): # Define un serializador para el modelo Prenda
    class Meta: # Clase Meta para definir la configuración del serializador
        model = Prenda # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class InsumosXPrendasSerializer(serializers.ModelSerializer): # Define un serializador para el modelo InsumosXPrendas
    class Meta: # Clase Meta para definir la configuración del serializador
        model = InsumosXPrendas # Especifica el modelo que se va a serializar
        fields = '__all__' # Incluye todos los campos del modelo en la serialización

class AlertaStockSerializer(serializers.ModelSerializer):
    insumo_nombre = serializers.CharField(source='insumo.Insumo_nombre', read_only=True)
    insumo_id = serializers.IntegerField(source='insumo.Insumo_ID', read_only=True)
    
    class Meta:
        model = AlertaStock
        fields = [
            'id',
            'insumo_id',
            'insumo_nombre',
            'cantidad_actual',
            'cantidad_minima',
            'estado',
            'fecha_creacion',
            'fecha_resolucion'
        ]
        read_only_fields = [
            'id',
            'fecha_creacion',
            'fecha_resolucion'
        ]