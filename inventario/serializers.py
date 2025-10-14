from rest_framework import serializers
from .models import Insumo, Prenda, InsumosXPrendas, AlertaStock


# === INSUMO ===
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


# === ALERTA DE STOCK ===
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


# === RELACIÓN INSUMOS X PRENDA ===
class InsumosXPrendasSerializer(serializers.ModelSerializer):
    # Nombre del insumo para mostrarlo fácilmente en detalle
    insumo_nombre = serializers.CharField(source='insumo.Insumo_nombre', read_only=True)
    insumo_unidad = serializers.CharField(source='insumo.Insumo_unidad_medida', read_only=True)
    insumo_precio_unitario = serializers.FloatField(source='insumo.Insumo_precio_unitario', read_only=True)
    insumo_stock = serializers.FloatField(source='insumo.Insumo_cantidad', read_only=True)

    class Meta:
        model = InsumosXPrendas
        fields = [
            'id',
            'insumo',
            'insumo_nombre',
            'insumo_unidad',
            'insumo_precio_unitario',
            'insumo_stock',
            'Insumo_prenda_cantidad_utilizada',
            'Insumo_prenda_unidad_medida',
            'Insumo_prenda_costo_total',
        ]


# === PRENDA ===
class PrendaSerializer(serializers.ModelSerializer):
    Prenda_imagen = serializers.ImageField(required=False)
    insumos_prendas = InsumosXPrendasSerializer(many=True, required=False)

    class Meta:
        model = Prenda
        fields = '__all__'

    # --- CREAR PRENDA CON INSUMOS ---
    def create(self, validated_data):
        insumos_data = validated_data.pop('insumos_prendas', [])
        prenda = Prenda.objects.create(**validated_data)

        for insumo_data in insumos_data:
            InsumosXPrendas.objects.create(prenda=prenda, **insumo_data)

        return prenda

    # --- ACTUALIZAR PRENDA CON INSUMOS ---
    def update(self, instance, validated_data):
        insumos_data = validated_data.pop('insumos_prendas', [])

        # Actualizar campos base de la prenda
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizar insumos
        instance.insumos_prendas.all().delete()
        for insumo_data in insumos_data:
            InsumosXPrendas.objects.create(prenda=instance, **insumo_data)

        return instance