# inventario/serializers.py
from rest_framework import serializers
from .models import Insumo, Prenda, InsumosXPrendas, AlertaStock, UnidadMedida, TipoInsumo


# === UNIDAD DE MEDIDA ===
class UnidadMedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadMedida
        fields = "__all__"


# === TIPO DE INSUMO ===
class TipoInsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoInsumo
        fields = "__all__"


# === INSUMO ===
class InsumoSerializer(serializers.ModelSerializer):
    unidad_medida_nombre = serializers.CharField(source='unidad_medida.nombre', read_only=True)
    tipo_insumo_nombre = serializers.CharField(source='tipo_insumo.nombre', read_only=True)

    class Meta:
        model = Insumo
        fields = "__all__"


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
            'fecha_resolucion',
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_resolucion']


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
    # IDs (para referencia)
    Prenda_marca_id = serializers.IntegerField(source='Prenda_marca.Marca_ID', read_only=True)
    Prenda_modelo_id = serializers.IntegerField(source='Prenda_modelo.Modelo_ID', read_only=True)
    Prenda_color_id = serializers.IntegerField(source='Prenda_color.Color_ID', read_only=True)

    # Nombres (métodos seguros)
    Prenda_marca_nombre = serializers.SerializerMethodField()
    Prenda_modelo_nombre = serializers.SerializerMethodField()
    Prenda_color_nombre = serializers.SerializerMethodField()

    # Imagen
    Prenda_imagen = serializers.ImageField(required=False)
    Prenda_imagen_url = serializers.SerializerMethodField()

    # Relaciones
    insumos_prendas = InsumosXPrendasSerializer(many=True, read_only=True)
    talles = serializers.SerializerMethodField()

    class Meta:
        model = Prenda
        fields = [
            'Prenda_ID',
            'Prenda_nombre',
            'Prenda_marca',
            'Prenda_marca_id',
            'Prenda_marca_nombre',
            'Prenda_modelo',
            'Prenda_modelo_id',
            'Prenda_modelo_nombre',
            'Prenda_color',
            'Prenda_color_id',
            'Prenda_color_nombre',
            'Prenda_precio_unitario',
            'Prenda_costo_total_produccion',
            'Prenda_imagen',
            'Prenda_imagen_url',
            'insumos_prendas',
            'talles',
        ]

    # === MÉTODOS ===
    def get_Prenda_marca_nombre(self, obj):
        return getattr(obj.Prenda_marca, "Marca_nombre", None)

    def get_Prenda_modelo_nombre(self, obj):
        return getattr(obj.Prenda_modelo, "Modelo_nombre", None)

    def get_Prenda_color_nombre(self, obj):
        return getattr(obj.Prenda_color, "Color_nombre", None)

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
            return obj.Prenda_imagen.url
        return None
