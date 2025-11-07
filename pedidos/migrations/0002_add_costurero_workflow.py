# Generated migration file for pedidos app

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('pedidos', '0001_initial'),  # Ajusta según tu última migration
    ]

    operations = [
        # Actualizar los estados incluyendo el nuevo PENDIENTE_COSTURERO
        migrations.AlterField(
            model_name='pedido',
            name='Pedido_estado',
            field=models.CharField(
                choices=[
                    ('PENDIENTE_DUENO', 'Pendiente Dueño'),
                    ('APROBADO_DUENO', 'Aprobado Dueño'),
                    ('PENDIENTE_COSTURERO', 'Pendiente Costurero'),
                    ('EN_PROCESO_COSTURERO', 'En Proceso Costurero'),
                    ('PENDIENTE_ESTAMPADO', 'Pendiente Estampado'),
                    ('EN_PROCESO_ESTAMPADO', 'En Proceso Estampado'),
                    ('COMPLETADO', 'Completado'),
                    ('CANCELADO', 'Cancelado'),
                ],
                default='PENDIENTE_COSTURERO',  # Nuevo estado por defecto
                max_length=30
            ),
        ),
        
        # Agregar campo para costurero asignado
        migrations.AddField(
            model_name='pedido',
            name='costurero_asignado',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='pedidos_costurero',
                to=settings.AUTH_USER_MODEL
            ),
        ),
        
        # Agregar campo para estampador asignado
        migrations.AddField(
            model_name='pedido',
            name='estampador_asignado',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='pedidos_estampador',
                to=settings.AUTH_USER_MODEL
            ),
        ),
    ]