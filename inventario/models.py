from django.db import models
from django.utils import timezone
from clasificaciones.models import Talle, Color, Modelo, Marca
# 🔥 NECESARIO: Importar Sum y F para la lógica de recálculo
from django.db.models import Sum, F 

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
        # 1. Almacenar el precio unitario anterior (solo si el objeto ya existe)
        if self.Insumo_ID:
            original_insumo = Insumo.objects.filter(Insumo_ID=self.Insumo_ID).first()
            precio_anterior = original_insumo.Insumo_precio_unitario if original_insumo else None
        else:
            precio_anterior = None
            
        # 2. Calculamos el precio total antes de guardar
        self.Insumo_precio_total = self.Insumo_cantidad * self.Insumo_precio_unitario
        super().save(*args, **kwargs) # Guardar el insumo actualizado

        # 3. 🔥 RECALCULAR PRENDAS SI EL PRECIO UNITARIO CAMBIÓ 🔥
        # Utilizamos > 0.00001 para manejar errores de precisión de punto flotante
        if precio_anterior is not None and abs(precio_anterior - self.Insumo_precio_unitario) > 0.00001:
            self._recalcular_prendas_afectadas()


    def _recalcular_prendas_afectadas(self):
        """
        Método privado para recalcular Prenda_costo_total_produccion 
        de todas las prendas que usan este insumo.
        """
        # Obtenemos todas las relaciones InsumosXPrendas que usan este insumo
        relaciones = InsumosXPrendas.objects.filter(insumo=self).select_related('prenda')
        
        for rel in relaciones:
            prenda = rel.prenda
            
            # A. Actualizar el costo total del insumo DENTRO DE LA RELACIÓN
            nuevo_costo_relacion = rel.Insumo_prenda_cantidad_utilizada * self.Insumo_precio_unitario
            rel.Insumo_prenda_costo_total = nuevo_costo_relacion
            rel.save()
            
            # B. Recalcular el costo total de la prenda
            
            # 1. Sumar los costos de TODAS las relaciones de la prenda
            costo_insumos_total = InsumosXPrendas.objects.filter(prenda=prenda).aggregate(
                total=Sum('Insumo_prenda_costo_total')
            )['total'] or 0.0
            
            # 2. Sumar el costo de la Mano de Obra (Prenda_precio_unitario)
            precio_mo = prenda.Prenda_precio_unitario # Esto es el costo de MO/confección

            costo_final = costo_insumos_total + precio_mo
            
            # 3. Guardar el nuevo costo total en la prenda (usando update para evitar recursión)
            Prenda.objects.filter(Prenda_ID=prenda.Prenda_ID).update(
                Prenda_costo_total_produccion=costo_final
            )

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
    Prenda_precio_unitario = models.FloatField(default=0.0)
    
    # 🔹 Nuevo campo: costo total de producción (suma insumos + precio base)
    Prenda_costo_total_produccion = models.FloatField(default=0.0)
    
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
    Insumo_prenda_unidad_medida = models.CharField(max_length=50)
    Insumo_prenda_costo_total = models.FloatField()

    class Meta:
        unique_together = ('insumo', 'prenda')