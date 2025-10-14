from django.db import models # Importa el módulo models de Django
from clasificaciones.models import Talle, Color, Modelo, Marca # Importa los modelos de Clasificaciones

class Insumo(models.Model):
    Insumo_ID = models.AutoField(primary_key=True)
    Insumo_nombre = models.CharField(max_length=30)
    Insumo_precio_unitario = models.FloatField()
    Insumo_cantidad = models.IntegerField()
    Insumo_unidad_medida = models.CharField(max_length=10)
    Insumo_precio_total = models.FloatField(editable=False)  # No editable manualmente
    Insumo_cantidad_minima = models.IntegerField(default=10)  # NUEVO: Cantidad mínima para alerta

    def save(self, *args, **kwargs):
        # Calcula automáticamente el precio total antes de guardar
        self.Insumo_precio_total = self.Insumo_cantidad * self.Insumo_precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return self.Insumo_nombre

    def esta_bajo_stock(self):  # NUEVO: Método para verificar si está bajo stock
        return self.Insumo_cantidad <= self.Insumo_cantidad_minima


class AlertaStock(models.Model):  # NUEVO: Modelo para registrar alertas de bajo stock
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


class Prenda(models.Model): # Define el modelo Prenda
    Prenda_ID = models.AutoField(primary_key=True) # Campo de clave primaria
    Prenda_nombre = models.CharField(max_length=100) # Campo de nombre de la prenda
    Prenda_precio_unitario = models.FloatField() # Campo de precio unitario de la prenda

    def __str__(self): # Método para representar el objeto como una cadena
        return f"{self.Prenda_nombre} {self.Prenda_precio_unitario}" # Retorna el nombre y precio de la prenda

class InsumosXPrendas(models.Model): # Define el modelo InsumosXPrendas para la relación muchos a muchos entre Insumo y Prenda
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE) # Clave foránea al modelo Insumo
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE) # Clave foránea al modelo Prenda
    Insumo_prenda_cantidad_utilizada = models.IntegerField() # Campo de cantidad utilizada del insumo en la prenda
    Insumo_prenda_unidad_medida = models.CharField(max_length=10) # Campo de unidad de medida del insumo en la prenda
    Insumo_prenda_costo_total = models.FloatField() # Campo de costo total del insumo en la prenda

    class Meta: # Clase Meta para definir opciones del modelo
        unique_together = ('insumo', 'prenda') # Asegura que la combinación de insumo y prenda sea única