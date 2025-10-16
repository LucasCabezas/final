# clasificaciones/models.py

from django.db import models

class Talle(models.Model):
    Talle_ID = models.AutoField(primary_key=True)
    Talle_codigo = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.Talle_codigo

    class Meta:
        verbose_name = "Talle"
        verbose_name_plural = "Talles"
        ordering = ['Talle_codigo']


class TallesXPrendas(models.Model):
    talle = models.ForeignKey(Talle, on_delete=models.CASCADE)
    prenda = models.ForeignKey(
        'inventario.Prenda', 
        on_delete=models.CASCADE, 
        related_name='talles_disponibles'
    )
    stock = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('talle', 'prenda')
        verbose_name = "Talle disponible"
        verbose_name_plural = "Talles disponibles"
    
    def __str__(self):
        return f"{self.prenda.Prenda_nombre} - Talle {self.talle.Talle_codigo} (Stock: {self.stock})"


class Color(models.Model):
    Color_ID = models.AutoField(primary_key=True)
    Color_nombre = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.Color_nombre

    class Meta:
        verbose_name = "Color"
        verbose_name_plural = "Colores"
        ordering = ['Color_nombre']


class Modelo(models.Model):
    Modelo_ID = models.AutoField(primary_key=True)
    Modelo_nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.Modelo_nombre

    class Meta:
        verbose_name = "Modelo"
        verbose_name_plural = "Modelos"
        ordering = ['Modelo_nombre']


class Marca(models.Model):
    Marca_ID = models.AutoField(primary_key=True)
    Marca_nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.Marca_nombre

    class Meta:
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"
        ordering = ['Marca_nombre']