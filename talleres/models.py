from django.db import models # Importa el módulo de modelos de Django
from inventario.models import Prenda, InsumosXPrendas # Importa los modelos Prenda e InsumosXPrendas desde la aplicación Inventario

class Taller(models.Model): # Define el modelo Taller
    Taller_ID = models.AutoField(primary_key=True) # Campo de clave primaria autoincremental
    Taller_nombre = models.CharField(max_length=30) # Campo de texto para el nombre del taller
    Taller_direccion = models.CharField(max_length=100) # Campo de texto para la dirección del taller

    def __str__(self): # Método para representar el objeto como una cadena
        return self.Taller_nombre # Devuelve el nombre del taller

    class Meta: # Metadatos del modelo
        verbose_name = "Taller" # Nombre singular del modelo
        verbose_name_plural = "Talleres" # Nombre plural del modelo

class PrendasXTalleres(models.Model): # Define el modelo intermedio PrendasXTalleres
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE) # Relación de clave foránea con el modelo Prenda
    taller = models.ForeignKey(Taller, on_delete=models.CASCADE) # Relación de clave foránea con el modelo Taller
    insumo_x_prenda = models.ForeignKey( 
        InsumosXPrendas, on_delete=models.CASCADE,
        null=True, blank=True, related_name="prendas_talleres"
    ) # Relación de clave foránea con el modelo InsumosXPrendas, permite nulos y blancos
    Prenda_taller_mano_obra = models.FloatField() # Campo de tipo float para el costo de mano de obra
    Prenda_taller_total = models.FloatField() # Campo de tipo float para el costo total

    class Meta: # Metadatos del modelo
        unique_together = ('prenda', 'taller') # Asegura que la combinación de prenda y taller sea única