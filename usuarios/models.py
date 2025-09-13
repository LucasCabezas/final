from django.db import models # Importa el módulo de modelos de Django

class Rol(models.Model): # Define el modelo Rol
    Rol_ID = models.AutoField(primary_key=True) # Campo de clave primaria auto incrementable
    Rol_nombre = models.CharField(max_length=20) # Campo de texto con longitud máxima de 20 caracteres

    def __str__(self): # Método para representar el objeto como una cadena
        return self.Rol_nombre # Retorna el nombre del rol

    class Meta: # Metadatos del modelo
        verbose_name = "Rol" # Nombre singular del modelo
        verbose_name_plural = "Roles" # Nombre plural del modelo

class Usuario(models.Model): # Define el modelo Usuario
    Usuario_ID = models.AutoField(primary_key=True) # Campo de clave primaria auto incrementable
    Usuario_nombre = models.CharField(max_length=20) # Campo de texto con longitud máxima de 20 caracteres
    Usuario_apellido = models.CharField(max_length=20) # Campo de texto con longitud máxima de 20 caracteres
    Usuario_email = models.CharField(max_length=40) # Campo de texto con longitud máxima de 40 caracteres
    Usuario_dni = models.BigIntegerField() # Campo de número entero grande
    Usuario_contrasena = models.CharField(max_length=30) # Campo de texto con longitud máxima de 30 caracteres

    def __str__(self): # Método para representar el objeto como una cadena
        return f"{self.Usuario_nombre} {self.Usuario_apellido} {self.Usuario_dni}" # Retorna una representación del usuario

class RolesXUsuarios(models.Model): # Define el modelo intermedio RolesXUsuarios
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE) # Clave foránea al modelo Rol
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE) # Clave foránea al modelo Usuario

    class Meta: # Metadatos del modelo
        unique_together = ('rol', 'usuario') # Asegura que la combinación de rol y usuario sea única