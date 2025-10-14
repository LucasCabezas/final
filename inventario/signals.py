from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Insumo, AlertaStock

@receiver(post_save, sender=Insumo)
def crear_alerta_bajo_stock(sender, instance, **kwargs):
    """
    Signal que se ejecuta cada vez que se guarda un Insumo.
    Crea o resuelve alertas de bajo stock automáticamente.
    """
    
    if instance.esta_bajo_stock():
        # El insumo está bajo stock
        # Verificar si ya existe una alerta activa
        alerta_existente = AlertaStock.objects.filter(
            insumo=instance, 
            estado='activa'
        ).exists()
        
        if not alerta_existente:
            # Si no existe alerta activa, crear una nueva
            AlertaStock.objects.create(
                insumo=instance,
                cantidad_actual=instance.Insumo_cantidad,
                cantidad_minima=instance.Insumo_cantidad_minima
            )
    else:
        # El insumo volvió a stock normal
        # Marcar todas las alertas activas como resueltas
        AlertaStock.objects.filter(
            insumo=instance,
            estado='activa'
        ).update(
            estado='resuelta', 
            fecha_resolucion=timezone.now()
        )