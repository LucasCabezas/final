from django.db import models
from django.utils import timezone
from clasificaciones.models import Talle, Color, Modelo, Marca

class Insumo(models.Model):
    Insumo_ID = models.AutoField(primary_key=True)
    Insumo_nombre = models.CharField(max_length=30)
    Insumo_precio_unitario = models.FloatField()
    Insumo_cantidad = models.IntegerField()
    Insumo_unidad_medida = models.CharField(max_length=10)
    Insumo_precio_total = models.FloatField(editable=False)
    Insumo_cantidad_minima = models.IntegerField(default=10)

    def save(self, *args, **kwargs):
        self.Insumo_precio_total = self.Insumo_cantidad * self.Insumo_precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return self.Insumo_nombre

    def esta_bajo_stock(self):
        return self.Insumo_cantidad <= self.Insumo_cantidad_minima


class AlertaStock(models.Model):
    ESTADO_CHOICES = [
        ('activa', 'Activa'),
        ('resuelta', 'Resuelta'),
    ]
    
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE)
    cantidad_actual = models.IntegerField()
    cantidad_minima = models.IntegerField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activa')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_resolucion = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Alerta: {self.insumo.Insumo_nombre}"
    
    class Meta:
        ordering = ['-fecha_creacion']


class Prenda(models.Model):
    Prenda_ID = models.AutoField(primary_key=True)
    Prenda_nombre = models.CharField(max_length=100)
    
    # 🔥 CAMBIADO: De CharField a ForeignKey
    Prenda_marca = models.ForeignKey(
        'clasificaciones.Marca',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='prendas'
    )
    Prenda_modelo = models.ForeignKey(
        'clasificaciones.Modelo',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='prendas'
    )
    Prenda_color = models.ForeignKey(
        'clasificaciones.Color',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='prendas'
    )
    
    Prenda_precio_unitario = models.FloatField()
    Prenda_imagen = models.ImageField(upload_to='prendas/', blank=True, null=True)

    def __str__(self):
        marca_nombre = self.Prenda_marca.Marca_nombre if self.Prenda_marca else ''
        return f"{self.Prenda_nombre} - {marca_nombre}"


class InsumosXPrendas(models.Model):
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE)
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE, related_name='insumos_prendas')
    Insumo_prenda_cantidad_utilizada = models.IntegerField()
    Insumo_prenda_unidad_medida = models.CharField(max_length=10)
    Insumo_prenda_costo_total = models.FloatField()

    class Meta:
        unique_together = ('insumo', 'prenda')