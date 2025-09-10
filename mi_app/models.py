from django.db import models  # Importa el módulo models de Django para definir modelos de base de datos

# TABLA ROLES
class Rol(models.Model):  # Define el modelo Rol
    Rol_ID = models.AutoField(primary_key=True)  # Campo autoincremental como clave primaria
    Rol_nombre = models.CharField(max_length=20)  # Campo de texto para el nombre del rol

    def __str__(self):  # Método para mostrar el nombre del rol como representación de la instancia
        return self.Rol_nombre
    
    class Meta:  # Configuración adicional del modelo
        verbose_name = "Rol"  # Nombre singular en el admin
        verbose_name_plural = "Roles"  # Nombre plural en el admin

# TABLA USUARIOS
class Usuario(models.Model):  # Define el modelo Usuario
    Usuario_ID = models.AutoField(primary_key=True)  # Campo autoincremental como clave primaria
    Usuario_nombre = models.CharField(max_length=20)  # Campo de texto para el nombre
    Usuario_apellido = models.CharField(max_length=20)  # Campo de texto para el apellido
    Usuario_email = models.CharField(max_length=40)  # Campo de texto para el email
    Usuario_dni = models.BigIntegerField()  # Campo numérico para el DNI
    Usuario_contrasena = models.CharField(max_length=30)  # Campo de texto para la contraseña

    def __str__(self):  # Muestra nombre y apellido como representación de la instancia
        return f"{self.Usuario_nombre} {self.Usuario_apellido}"

# TABLA INTERMEDIA ROLES X USUARIOS
class RolesXUsuarios(models.Model):  # Modelo intermedio para relación muchos a muchos entre Rol y Usuario
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)  # Relación con Rol
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)  # Relación con Usuario

    class Meta:  # Configuración adicional
        unique_together = ('rol', 'usuario')  # Garantiza que no se repita la combinación rol-usuario

# TABLA INSUMOS
class Insumo(models.Model):  # Define el modelo Insumo
    Insumo_ID = models.AutoField(primary_key=True)  # Campo autoincremental como clave primaria
    Insumo_nombre = models.CharField(max_length=30)  # Campo de texto para el nombre del insumo
    Insumo_precio_unitario = models.FloatField()  # Campo numérico para el precio unitario
    Insumo_cantidad = models.IntegerField()  # Campo numérico para la cantidad
    Insumo_unidad_medida = models.CharField(max_length=10)  # Campo de texto para la unidad de medida
    Insumo_precio_total = models.FloatField()  # Campo numérico para el precio total

    def __str__(self):  # Muestra el nombre del insumo como representación de la instancia
        return self.Insumo_nombre

# TABLA PRENDAS
class Prenda(models.Model):  # Define el modelo Prenda
    Prenda_ID = models.AutoField(primary_key=True)  # Campo autoincremental como clave primaria
    Prenda_stock = models.IntegerField()  # Campo numérico para el stock
    Prenda_nombre = models.CharField(max_length=100) # Campo de texto para el nombre de la prenda
    Prenda_precio_unitario = models.FloatField()  # Campo numérico para el precio unitario


    def __str__(self):  # Muestra la descripción de la prenda como representación de la instancia
        return self.Prenda_nombre

# TABLA INTERMEDIA INSUMOS X PRENDAS
class InsumosXPrendas(models.Model):  # Modelo intermedio para relación muchos a muchos entre Insumo y Prenda
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE)  # Relación con Insumo
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)  # Relación con Prenda
    Insumo_prenda_cantidad_utilizada = models.IntegerField()  # Cantidad de insumo utilizada en la prenda
    Insumo_prenda_unidad_medida = models.CharField(max_length=10)  # Unidad de medida utilizada
    Insumo_prenda_costo_total = models.FloatField()  # Costo total del insumo en la prenda

    class Meta:  # Configuración adicional
        unique_together = ('insumo', 'prenda')  # Garantiza que no se repita la combinación insumo-prenda

# TABLA TALLERES
class Taller(models.Model):  # Define el modelo Taller
    Taller_ID = models.AutoField(primary_key=True)  # Campo autoincremental como clave primaria
    Taller_nombre = models.CharField(max_length=30)  # Campo de texto para el nombre del taller
    Taller_direccion = models.CharField(max_length=100)  # Campo de texto para la dirección

    def __str__(self):  # Muestra el nombre del taller como representación de la instancia
        return self.Taller_nombre
    
    class Meta:  # Configuración adicional
        verbose_name = "Taller"  # Nombre singular en el admin
        verbose_name_plural = "Talleres"  # Nombre plural en el admin

# TABLA INTERMEDIA PRENDAS X TALLERES
class PrendasXTalleres(models.Model):  # Modelo intermedio para relación muchos a muchos entre Prenda y Taller
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)  # Relación con Prenda
    taller = models.ForeignKey(Taller, on_delete=models.CASCADE)  # Relación con Taller
    insumo_x_prenda = models.ForeignKey('InsumosXPrendas', on_delete=models.CASCADE, null=True,  blank=True, related_name="prendas_talleres")  # Relación opcional con InsumosXPrendas
    Prenda_taller_mano_obra = models.FloatField()  # Costo de mano de obra
    Prenda_taller_total = models.FloatField()  # Costo total en el taller

    class Meta:  # Configuración adicional
        unique_together = ('prenda', 'taller')  # Garantiza que no se repita la combinación prenda-taller

# TABLA PEDIDOS
class Pedido(models.Model):  # Define el modelo Pedido
    Pedido_ID = models.AutoField(primary_key=True)  # Campo autoincremental como clave primaria
    Usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=True)  # Relación con Usuario
    Pedido_fecha = models.DateField()  # Campo de fecha para el pedido
    Pedido_estado = models.BooleanField()  # Campo booleano para el estado del pedido

    def __str__(self):  # Muestra el ID y usuario del pedido como representación de la instancia
        return f"Pedido {self.Pedido_ID} - {self.Usuario}"

# TABLA INTERMEDIA PEDIDOS X PRENDAS
class PedidosXPrendas(models.Model):  # Modelo intermedio para relación muchos a muchos entre Pedido y Prenda
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)  # Relación con Pedido
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)  # Relación con Prenda
    Pedido_prenda_cantidad = models.IntegerField()  # Cantidad de prendas en el pedido
    Pedido_prenda_precio_total = models.FloatField()  # Precio total de las prendas en el pedido

    class Meta:  # Configuración adicional
        unique_together = ('pedido', 'prenda')  # Garantiza que no se repita la combinación


# TABLA TALLES
class Talle(models.Model):  # Define el modelo Talle
    Talle_ID = models.AutoField(primary_key=True)  # Campo autoincremental como clave primaria
    Talle_codigo = models.CharField(max_length=20)  # Campo de texto para el código del talle

    def __str__(self):  # Muestra el código del talle como representación de la instancia
        return self.Talle_codigo

# TABLA INTERMEDIA TALLES X PRENDAS    
class TallesXPrendas(models.Model):  # Modelo intermedio para relación muchos a muchos entre Talle y Prenda
    talle = models.ForeignKey(Talle, on_delete=models.CASCADE)  # Relación con Talle
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)  # Relación con Prenda

    class Meta:  # Configuración adicional
        unique_together = ('talle', 'prenda')  # Garantiza que no se repita la combinación talle-prenda

# TABLA COLORES
class Color(models.Model):  # Define el modelo Color
    Color_ID = models.AutoField(primary_key=True)  # Campo autoincremental como clave primaria
    Color_nombre = models.CharField(max_length=30)  # Campo de texto para el nombre del color

    def __str__(self):  # Muestra el nombre del color como representación de la instancia
        return self.Color_nombre

    class Meta:  # Configuración adicional
        verbose_name = "Color"  # Nombre singular en el admin
        verbose_name_plural = "Colores"  # Nombre plural en el admin


# TABLA INTERMEDIA COLORES X PRENDAS
class ColoresXPrendas(models.Model):  # Modelo intermedio para relación muchos a muchos entre Color y Prenda
    color = models.ForeignKey(Color, on_delete=models.CASCADE)  # Relación con Color
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)  # Relación con Prenda

    class Meta:  # Configuración adicional
        unique_together = ('color', 'prenda')  # Garantiza que no se repita la combinación color-prenda

# TABLA MODELOS
class Modelo(models.Model):  # Define el modelo Modelo
    Modelo_ID = models.AutoField(primary_key=True)  # Campo autoincremental como clave primaria
    Modelo_nombre = models.CharField(max_length=50)  # Campo de texto para el nombre del modelo

    def __str__(self):  # Muestra el nombre del modelo como representación de la instancia
        return self.Modelo_nombre

# TABLA INTERMEDIA MODELOS X PRENDAS
class ModelosXPrendas(models.Model):  # Modelo intermedio para relación muchos a muchos entre Modelo y Prenda
    modelo = models.ForeignKey(Modelo, on_delete=models.CASCADE)  # Relación con Modelo
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)  # Relación con Prenda

    class Meta:  # Configuración adicional
        unique_together = ('modelo', 'prenda')  # Garantiza que no se repita la combinación modelo-prenda

# TABLA MARCAS
class Marca(models.Model):  # Define el modelo Marca
    Marca_ID = models.AutoField(primary_key=True)  # Campo autoincremental como clave primaria
    Marca_nombre = models.CharField(max_length=50)  # Campo de texto para el nombre de la marca

    def __str__(self):  # Muestra el nombre de la marca como representación de la instancia
        return self.Marca_nombre

# TABLA INTERMEDIA MARCAS X PRENDAS
class MarcasXPrendas(models.Model):  # Modelo intermedio para relación muchos a muchos entre Marca y Prenda
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE)  # Relación con Marca
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)  # Relación con Prenda

    class Meta:  # Configuración adicional
        unique_together = ('marca', 'prenda')  # Garantiza que no se repita la combinación marca-prenda