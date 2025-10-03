from django.db import models
from django.contrib.auth.models import User  
from inventario.models import Prenda

class Pedido(models.Model):
    Pedido_ID = models.AutoField(primary_key=True)
    Usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  
    Pedido_fecha = models.DateField()
    Pedido_estado = models.BooleanField()

    def __str__(self):
        return f"Pedido {self.Pedido_ID} - {self.Usuario} - {self.Pedido_fecha}"

class PedidosXPrendas(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)
    Pedido_prenda_cantidad = models.IntegerField()
    Pedido_prenda_precio_total = models.FloatField()

    class Meta:
        unique_together = ('pedido', 'prenda')