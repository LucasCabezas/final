from django.db import models

# TABLA ROLES
class Rol(models.Model):
    Rol_ID = models.AutoField(primary_key=True)
    Rol_nombre = models.CharField(max_length=20)

    def __str__(self):
        return self.Rol_nombre
    
    class Meta:
        verbose_name = "Rol"
        verbose_name_plural = "Roles"

# TABLA USUARIOS
class Usuario(models.Model):
    Usuario_ID = models.AutoField(primary_key=True)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, related_name="usuarios")  
    Usuario_nombre = models.CharField(max_length=20)
    Usuario_apellido = models.CharField(max_length=20)
    Usuario_email = models.CharField(max_length=40)
    Usuario_dni = models.BigIntegerField()
    Usuario_contrasena = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.Usuario_nombre} {self.Usuario_apellido}"

# TABLA INTERMEDIA ROLES X USUARIOS
class RolesXUsuarios(models.Model):
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('rol', 'usuario')

# TABLA INSUMOS
class Insumo(models.Model):
    Insumo_ID = models.AutoField(primary_key=True)
    Insumo_nombre = models.CharField(max_length=30)
    Insumo_precio_unitario = models.FloatField()
    Insumo_cantidad = models.IntegerField()
    Insumo_unidad_medida = models.CharField(max_length=10)
    Insumo_precio_total = models.FloatField()

    def __str__(self):
        return self.Insumo_nombre

# TABLA PRENDAS
class Prenda(models.Model):
    Prenda_ID = models.AutoField(primary_key=True)
    Prenda_stock = models.IntegerField()
    Prenda_precio_unitario = models.FloatField()
    Prenda_descripcion = models.CharField(max_length=100)
    Prenda_color = models.CharField(max_length=20)
    Prenda_talle = models.CharField(max_length=10)

    def __str__(self):
        return self.Prenda_descripcion

# TABLA INTERMEDIA INSUMOS X PRENDAS
class InsumosXPrendas(models.Model):
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE) 
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)
    Insumo_prenda_cantidad_utilizada = models.IntegerField()
    Insumo_prenda_unidad_medida = models.CharField(max_length=10)
    Insumo_prenda_costo_total = models.FloatField()

    class Meta:
        unique_together = ('insumo', 'prenda')

# TABLA TALLERES
class Taller(models.Model):
    Taller_ID = models.AutoField(primary_key=True)
    Taller_nombre = models.CharField(max_length=30)
    Taller_direccion = models.CharField(max_length=100)

    def __str__(self):
        return self.Taller_nombre
    
    class Meta:
        verbose_name = "Taller"
        verbose_name_plural = "Talleres"

# TABLA INTERMEDIA PRENDAS X TALLERES
class PrendasXTalleres(models.Model):
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)
    taller = models.ForeignKey(Taller, on_delete=models.CASCADE)
    insumo_x_prenda = models.ForeignKey('InsumosXPrendas', on_delete=models.CASCADE, null=True,  blank=True, related_name="prendas_talleres")
    Prenda_taller_mano_obra = models.FloatField()
    Prenda_taller_total = models.FloatField()

    class Meta:
        unique_together = ('prenda', 'taller')

# TABLA PEDIDOS
class Pedido(models.Model):
    Pedido_ID = models.AutoField(primary_key=True)
    Pedido_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE) 
    Pedido_fecha = models.DateField()
    Pedido_estado = models.BooleanField()

    def __str__(self):
        return f"Pedido {self.Pedido_ID} - {self.Pedido_usuario}"

# TABLA INTERMEDIA PEDIDOS X PRENDAS
class PedidosXPrendas(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)
    Pedido_prenda_cantidad = models.IntegerField()
    Pedido_prenda_precio_total = models.FloatField()

    class Meta:
        unique_together = ('pedido', 'prenda')