from django.db import models
from django.contrib.auth.models import User  
from inventario.models import Prenda

class Pedido(models.Model):
    ESTADO_CHOICES = [
        # Estados del flujo dueño (para futuras funcionalidades)
        ('PENDIENTE_DUENO', 'Pendiente Dueño'),
        ('APROBADO_DUENO', 'Aprobado Dueño'),
        
        # Estados del flujo costurero
        ('PENDIENTE_COSTURERO', 'Pendiente Costurero'),
        ('EN_PROCESO_COSTURERO', 'En Proceso Costurero'),
        
        # Estados del flujo estampador
        ('PENDIENTE_ESTAMPADO', 'Pendiente Estampado'),
        ('EN_PROCESO_ESTAMPADO', 'En Proceso Estampado'),
        
        # Estados finales
        ('COMPLETADO', 'Completado'),
        ('CANCELADO', 'Cancelado'),
    ]
    Pedido_ID = models.AutoField(primary_key=True)
    Usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    Pedido_fecha = models.DateField(auto_now_add=True)
    Pedido_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    # 🔥 CAMBIO: Estado inicial específico para costurero
    Pedido_estado = models.CharField(max_length=30, choices=ESTADO_CHOICES, default='PENDIENTE_COSTURERO')
    
    # Campos para tracking del flujo
    costurero_asignado = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='pedidos_costurero'
    )
    estampador_asignado = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='pedidos_estampador'
    )

    def __str__(self):
        return f"Pedido {self.Pedido_ID} - {self.Usuario}"

    def requiere_estampado(self):
        """Verifica si el pedido tiene prendas que requieren estampado"""
        return self.detalles.filter(tipo='ESTAMPADA').exists()

    def puede_ser_trasladado_a_estampado(self):
        """Verifica si el pedido puede ser trasladado a estampado"""
        return (
            self.Pedido_estado == 'EN_PROCESO_COSTURERO' and 
            self.requiere_estampado()
        )


class DetallePedido(models.Model):
    """Detalle completo de cada item en un pedido con cálculo automático de costos"""
    
    # Relaciones
    pedido = models.ForeignKey('Pedido', related_name='detalles', on_delete=models.CASCADE)
    prenda = models.ForeignKey('inventario.Prenda', on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
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
        return 0
    
    def calcular_costo_estampado(self):
        return 0 
    
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