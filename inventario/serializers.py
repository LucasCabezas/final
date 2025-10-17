# inventario/serializers.py

from rest_framework import serializers
from .models import Insumo, Prenda, InsumosXPrendas, AlertaStock


# === INSUMO ===
class InsumoSerializer(serializers.ModelSerializer):
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
    # 🔥 CAMPOS DE SOLO LECTURA PARA EL FRONTEND
    # IDs (se usan para crear/editar)
    Prenda_marca_id = serializers.IntegerField(source='Prenda_marca.Marca_ID', read_only=True)
    Prenda_modelo_id = serializers.IntegerField(source='Prenda_modelo.Modelo_ID', read_only=True)
    Prenda_color_id = serializers.IntegerField(source='Prenda_color.Color_ID', read_only=True)
    
    # Nombres (para mostrar en el frontend)
    Prenda_marca_nombre = serializers.CharField(source='Prenda_marca.Marca_nombre', read_only=True)
    Prenda_modelo_nombre = serializers.CharField(source='Prenda_modelo.Modelo_nombre', read_only=True)
    Prenda_color_nombre = serializers.CharField(source='Prenda_color.Color_nombre', read_only=True)
    
    # Imagen
    Prenda_imagen = serializers.ImageField(required=False)
    Prenda_imagen_url = serializers.SerializerMethodField()
    
    # Relaciones - SOLO LECTURA (se procesan manualmente en las vistas)
    insumos_prendas = InsumosXPrendasSerializer(many=True, read_only=True)
    talles = serializers.SerializerMethodField()
    
    class Meta:
        model = Prenda
        fields = [
            'Prenda_ID',
            'Prenda_nombre',
            'Prenda_marca',  # ID para escritura
            'Prenda_marca_id',  # ID para lectura
            'Prenda_marca_nombre',  # Nombre para frontend
            'Prenda_modelo',  # ID para escritura
            'Prenda_modelo_id',  # ID para lectura
            'Prenda_modelo_nombre',  # Nombre para frontend
            'Prenda_color',  # ID para escritura
            'Prenda_color_id',  # ID para lectura
            'Prenda_color_nombre',  # Nombre para frontend
            'Prenda_precio_unitario',
            'Prenda_imagen',
            'Prenda_imagen_url',
            'insumos_prendas',
            'talles',
        ]
    
    def get_talles(self, obj):
        """Devuelve los códigos de los talles disponibles"""
        from clasificaciones.models import TallesXPrendas
        talles = TallesXPrendas.objects.filter(prenda=obj).select_related('talle')
        return [t.talle.Talle_codigo for t in talles]

    def get_Prenda_imagen_url(self, obj):
        """Devuelve la URL completa de la imagen si existe"""
        if obj.Prenda_imagen:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.Prenda_imagen.url)
            else:
                return obj.Prenda_imagen.url
        return None