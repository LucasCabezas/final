from django.db import models
from django.contrib.auth.models import User  
from inventario.models import Prenda

class Pedido(models.Model):
    ESTADO_CHOICES = [
        ('PENDIENTE_DUENO', 'Pendiente Dueño'),
        ('APROBADO_DUENO', 'Aprobado - En Costura'),
        ('PENDIENTE_ESTAMPADO', 'Pendiente Estampado'),
        ('COMPLETADO', 'Completado'),
        ('CANCELADO', 'Cancelado'),
    ]
    Pedido_ID = models.AutoField(primary_key=True)
    Usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    Pedido_fecha = models.DateField(auto_now_add=True)
    Pedido_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    Pedido_estado = models.CharField(max_length=30, choices=ESTADO_CHOICES, default='PENDIENTE_DUENO')

    def __str__(self):
        return f"Pedido {self.Pedido_ID} - {self.Usuario}"

class PedidosXPrendas(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    prenda = models.ForeignKey(Prenda, on_delete=models.CASCADE)
    Pedido_prenda_cantidad = models.IntegerField()
    Pedido_prenda_precio_total = models.FloatField()

    class Meta: # Metadatos del modelo
        unique_together = ('pedido', 'prenda') # Asegura que la combinación de pedido y prenda sea única

class DetallePedido(models.Model):
    """Detalle completo de cada item en un pedido con cálculo automático de costos"""
    
    # Relaciones
    pedido = models.ForeignKey('Pedido', related_name='detalles', on_delete=models.CASCADE)
    prenda = models.ForeignKey('inventario.Prenda', on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    tipo = models.CharField(max_length=50, default='LISA')
    talle = models.ForeignKey('clasificaciones.Talle', on_delete=models.SET_NULL, null=True, blank=True)
    color = models.ForeignKey('clasificaciones.Color', on_delete=models.SET_NULL, null=True, blank=True)
    modelo = models.ForeignKey('clasificaciones.Modelo', on_delete=models.SET_NULL, null=True, blank=True)
    marca = models.ForeignKey('clasificaciones.Marca', on_delete=models.SET_NULL, null=True, blank=True)
    
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
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    precio_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    def calcular_costo_materiales(self):
        """Calcula el costo total de materiales/insumos para esta prenda"""
        from inventario.models import InsumosXPrendas
        
        insumos = InsumosXPrendas.objects.filter(prenda=self.prenda)
        total = sum(insumo.Insumo_prenda_costo_total for insumo in insumos)
        return total if total > 0 else 5000  # Valor por defecto si no hay insumos
    
    def calcular_costo_mano_obra_costura(self):
        """Calcula el costo de mano de obra del taller de costura"""
        from talleres.models import PrendasXTalleres, Taller
        
        try:
            # Buscar el taller de costura
            taller_costura = Taller.objects.filter(Taller_nombre__icontains='costura').first()
            if taller_costura:
                prenda_taller = PrendasXTalleres.objects.get(
                    prenda=self.prenda,
                    taller=taller_costura
                )
                return prenda_taller.Prenda_taller_mano_obra
        except PrendasXTalleres.DoesNotExist:
            pass
        
        return 2000  # Valor por defecto
    
    def calcular_costo_estampado(self):
        """Calcula el costo de estampado si la prenda es estampada"""
        if self.tipo == 'ESTAMPADA':
            from talleres.models import PrendasXTalleres, Taller
            
            try:
                # Buscar el taller de estampado
                taller_estampado = Taller.objects.filter(Taller_nombre__icontains='estampado').first()
                if taller_estampado:
                    prenda_taller = PrendasXTalleres.objects.get(
                        prenda=self.prenda,
                        taller=taller_estampado
                    )
                    return prenda_taller.Prenda_taller_mano_obra
            except PrendasXTalleres.DoesNotExist:
                pass
            
            return 1500  # Valor por defecto para estampado
        
        return 0  # Si es lisa, no hay costo de estampado
    
    def calcular_precio_unitario(self):
        """Calcula el precio unitario sumando todos los costos"""
        return (
            self.costo_materiales +
            self.costo_mano_obra_costura +
            self.costo_estampado
        )
    
    def calcular_precio_total(self):
        """Calcula el precio total multiplicando precio unitario por cantidad"""
        return self.precio_unitario * self.cantidad
    
    def calcular_costos(self):
        """Método principal que calcula todos los costos"""
        self.costo_materiales = self.calcular_costo_materiales()
        self.costo_mano_obra_costura = self.calcular_costo_mano_obra_costura()
        self.costo_estampado = self.calcular_costo_estampado()
        self.precio_unitario = self.calcular_precio_unitario()
        self.precio_total = self.calcular_precio_total()
    
    def save(self, *args, **kwargs):
        skip_auto_costs = kwargs.pop("skip_auto_costs", False)
        if not skip_auto_costs:
            self.calcular_costos()
        super().save(*args, **kwargs)

    
    def __str__(self):
        return f"{self.prenda.Prenda_nombre} - {self.marca.Marca_nombre} {self.modelo.Modelo_nombre} ({self.cantidad}u)"
    
    class Meta:
        verbose_name = "Detalle de Pedido"
        verbose_name_plural = "Detalles de Pedidos"