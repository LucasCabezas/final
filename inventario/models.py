from django.db import models
from django.utils import timezone
from clasificaciones.models import Talle, Color, Modelo, Marca

class UnidadMedida(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre


class TipoInsumo(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre
    
from django.db import models

class Insumo(models.Model):
    Insumo_ID = models.AutoField(primary_key=True)
    Insumo_nombre = models.CharField(max_length=30)
    Insumo_cantidad = models.FloatField()
    Insumo_precio_unitario = models.FloatField()
    Insumo_precio_total = models.FloatField()
    Insumo_cantidad_minima = models.IntegerField()
    unidad_medida = models.ForeignKey('UnidadMedida', on_delete=models.CASCADE)
    tipo_insumo = models.ForeignKey('TipoInsumo', on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        # 🔹 Calculamos el precio total antes de guardar
        self.Insumo_precio_total = self.Insumo_cantidad * self.Insumo_precio_unitario
        super().save(*args, **kwargs)

    # 🔹 Método que usa tu señal para detectar bajo stock
    def esta_bajo_stock(self):
        """
        Retorna True si la cantidad actual es menor o igual al mínimo permitido.
        """
        return self.Insumo_cantidad <= self.Insumo_cantidad_minima

    def __str__(self):
        return self.Insumo_nombre


# ==========================
# 🔹 MODELO DE ALERTA STOCK
# ==========================
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
    Prenda_nombre = models.CharField(max_length=50)
    Prenda_marca = models.ForeignKey(Marca, on_delete=models.PROTECT, null=False)
    Prenda_modelo = models.ForeignKey(Modelo, on_delete=models.PROTECT, null=False)
    Prenda_color = models.ForeignKey(Color, on_delete=models.PROTECT, null=False)
    Prenda_precio_unitario = models.FloatField(default=0)
    
    # 🔹 Nuevo campo: costo total de producción (suma insumos + precio base)
    Prenda_costo_total_produccion = models.FloatField(default=0)
    
    Prenda_imagen = models.ImageField(upload_to='prendas/', null=True, blank=True)

    def __str__(self):
        return f"{self.Prenda_nombre} ({self.Prenda_marca.Marca_nombre if self.Prenda_marca else '-'})"

    class Meta:
        db_table = 'Prenda'
        verbose_name = 'Prenda'
        verbose_name_plural = 'Prendas'
        
class InsumosXPrendas(models.Model):
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE)
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE, related_name='insumos_prendas')
    Insumo_prenda_cantidad_utilizada = models.IntegerField()
    Insumo_prenda_unidad_medida = models.CharField(max_length=10)
    Insumo_prenda_costo_total = models.FloatField()

    class Meta:
        unique_together = ('insumo', 'prenda')