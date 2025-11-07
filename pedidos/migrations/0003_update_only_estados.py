# Generated migration file for pedidos app

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pedidos', '0001_initial'),  # Ajusta según tu última migration
    ]

    operations = [
        # Solo actualizar los estados, sin agregar campos duplicados
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
    ]