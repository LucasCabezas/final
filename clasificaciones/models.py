from django.db import models # Importa el módulo de modelos de Django

class Talle(models.Model): # Define el modelo Talle
    Talle_ID = models.AutoField(primary_key=True) # Campo ID autoincremental y clave primaria
    Talle_codigo = models.CharField(max_length=20) # Campo para el código del talle

    def __str__(self): # Define la representación en cadena del objeto
        return self.Talle_codigo # Retorna el código del talle

class TallesXPrendas(models.Model):
    talle = models.ForeignKey(Talle, on_delete=models.CASCADE)
    prenda = models.ForeignKey('inventario.Prenda', on_delete=models.CASCADE, related_name='talles_disponibles')
    # 🔥 ELIMINADO: stock = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('talle', 'prenda')
    
    def __str__(self):
        return f"{self.prenda.Prenda_nombre} - Talle {self.talle.Talle_codigo}"

class Color(models.Model): # Define el modelo Color
    Color_ID = models.AutoField(primary_key=True) # Campo ID autoincremental y clave primaria
    Color_nombre = models.CharField(max_length=30) # Campo para el nombre del color

    def __str__(self): # Define la representación en cadena del objeto
        return self.Color_nombre # Retorna el nombre del color

    class Meta: # Define metadatos para el modelo
        verbose_name = "Color" # Nombre singular en el admin
        verbose_name_plural = "Colores" # Nombre plural en el admin

class ColoresXPrendas(models.Model): # Define el modelo intermedio para la relación muchos a muchos entre Color y Prenda
    color = models.ForeignKey(Color, on_delete=models.CASCADE) # Clave foránea al modelo Color
    prenda = models.ForeignKey('inventario.Prenda', on_delete=models.CASCADE) # Clave foránea al modelo Prenda

    class Meta: # Define metadatos para el modelo
        unique_together = ('color', 'prenda') # Asegura que la combinación de color y prenda sea única

class Modelo(models.Model): # Define el modelo Modelo
    Modelo_ID = models.AutoField(primary_key=True) # Campo ID autoincremental y clave primaria
    Modelo_nombre = models.CharField(max_length=50) # Campo para el nombre del modelo

    def __str__(self): # Define la representación en cadena del objeto
        return self.Modelo_nombre # Retorna el nombre del modelo

class ModelosXPrendas(models.Model): # Define el modelo intermedio para la relación muchos a muchos entre Modelo y Prenda
    modelo = models.ForeignKey(Modelo, on_delete=models.CASCADE) # Clave foránea al modelo Modelo
    prenda = models.ForeignKey('inventario.Prenda', on_delete=models.CASCADE) # Clave foránea al modelo Prenda

    class Meta: # Define metadatos para el modelo
        unique_together = ('modelo', 'prenda') # Asegura que la combinación de modelo y prenda sea única

class Marca(models.Model): # Define el modelo Marca
    Marca_ID = models.AutoField(primary_key=True) # Campo ID autoincremental y clave primaria
    Marca_nombre = models.CharField(max_length=50) # Campo para el nombre de la marca

    def __str__(self): # Define la representación en cadena del objeto
        return self.Marca_nombre # Retorna el nombre de la marca

class MarcasXPrendas(models.Model): # Define el modelo intermedio para la relación muchos a muchos entre Marca y Prenda
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE) # Clave foránea al modelo Marca
    prenda = models.ForeignKey('inventario.Prenda', on_delete=models.CASCADE) # Clave foránea al modelo Prenda

    class Meta: # Define metadatos para el modelo
        unique_together = ('marca', 'prenda') # Asegura que la combinación de marca y prenda sea única