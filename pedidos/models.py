from django.db import models # Importa el módulo models de Django
from usuarios.models import Usuario # Importa el modelo Usuario desde la aplicación Usuarios
from inventario.models import Prenda # Importa el modelo Prenda desde la aplicación Inventario

class Pedido(models.Model): # Define el modelo Pedido
    Pedido_ID = models.AutoField(primary_key=True) # Campo de clave primaria auto incrementable
    Usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=True) # Relación con el modelo Usuario
    Pedido_fecha = models.DateField() # Campo de fecha
    Pedido_estado = models.BooleanField() # Campo booleano para el estado del pedido

    def __str__(self): # Representación en cadena del objeto Pedido
        return f"Pedido {self.Pedido_ID} - {self.Usuario} - {self.Pedido_fecha}" # Formato de la representación

class PedidosXPrendas(models.Model): # Define el modelo intermedio PedidosXPrendas
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE) # Relación con el modelo Pedido
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE) # Relación con el modelo Prenda
    Pedido_prenda_cantidad = models.IntegerField() # Campo para la cantidad de prendas en el pedido
    Pedido_prenda_precio_total = models.FloatField() # Campo para el precio total de las prendas en el pedido

    class Meta: # Metadatos del modelo
        unique_together = ('pedido', 'prenda') # Asegura que la combinación de pedido y prenda sea única

class DetallePedido(models.Model):
    """Detalle completo de cada item en un pedido con cálculo automático de costos"""
    
    # Relaciones
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')
    prenda = models.ForeignKey('inventario.Prenda', on_delete=models.CASCADE)
    talle = models.ForeignKey('clasificaciones.Talle', on_delete=models.CASCADE)
    color = models.ForeignKey('clasificaciones.Color', on_delete=models.CASCADE)
    modelo = models.ForeignKey('clasificaciones.Modelo', on_delete=models.CASCADE)
    marca = models.ForeignKey('clasificaciones.Marca', on_delete=models.CASCADE)
    
    # Tipo de prenda
    TIPO_CHOICES = [
        ('LISA', 'Lisa'),
        ('ESTAMPADA', 'Estampada'),
    ]
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='LISA')
    
    # Cantidad
    cantidad = models.IntegerField(default=1)
    
    # Costos (se calculan automáticamente)
    costo_materiales = models.FloatField(default=0, editable=False)
    costo_mano_obra_costura = models.FloatField(default=0, editable=False)
    costo_estampado = models.FloatField(default=0, editable=False)
    precio_unitario = models.FloatField(default=0, editable=False)
    precio_total = models.FloatField(default=0, editable=False)
    
    def __str__(self):
        return f"{self.prenda.Prenda_nombre} - {self.marca.Marca_nombre} {self.modelo.Modelo_nombre} ({self.cantidad}u)"
    
    class Meta:
        verbose_name = "Detalle de Pedido"
        verbose_name_plural = "Detalles de Pedidos"