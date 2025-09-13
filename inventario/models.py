from django.db import models # Importa el módulo models de Django
from clasificaciones.models import Talle, Color, Modelo, Marca # Importa los modelos de Clasificaciones

class Insumo(models.Model): # Define el modelo Insumo
    Insumo_ID = models.AutoField(primary_key=True) # Campo de clave primaria
    Insumo_nombre = models.CharField(max_length=30) # Campo de nombre del insumo
    Insumo_precio_unitario = models.FloatField() # Campo de precio unitario del insumo
    Insumo_cantidad = models.IntegerField() # Campo de cantidad del insumo
    Insumo_unidad_medida = models.CharField(max_length=10) # Campo de unidad de medida del insumo
    Insumo_precio_total = models.FloatField() # Campo de precio total del insumo

    def __str__(self): # Método para representar el objeto como una cadena
        return self.Insumo_nombre # Retorna el nombre del insumo

class Prenda(models.Model): # Define el modelo Prenda
    Prenda_ID = models.AutoField(primary_key=True) # Campo de clave primaria
    Prenda_nombre = models.CharField(max_length=100) # Campo de nombre de la prenda
    Prenda_stock = models.IntegerField() # Campo de stock de la prenda
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