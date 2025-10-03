from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from pedidos.models import Pedido
from usuarios.models import Usuario
from django.db import transaction

class Command(BaseCommand):
    help = 'Migra las relaciones de Pedido de Usuario antiguo a User de Django'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Iniciando migración de pedidos...'))
        
        try:
            with transaction.atomic():
                pedidos_migrados = 0
                pedidos_sin_usuario = 0
                
                # Obtener todos los pedidos
                pedidos = Pedido.objects.all()
                
                for pedido in pedidos:
                    if pedido.Usuario:
                        # Buscar el Usuario antiguo por su ID
                        try:
                            usuario_antiguo = Usuario.objects.get(Usuario_ID=pedido.Usuario.id)
                            
                            # Buscar el User nuevo que corresponde al email del usuario antiguo
                            user_nuevo = User.objects.get(username=usuario_antiguo.Usuario_email)
                            
                            # Actualizar la relación
                            pedido.Usuario = user_nuevo
                            pedido.save()
                            
                            pedidos_migrados += 1
                            self.stdout.write(f'  ✓ Pedido {pedido.Pedido_ID} migrado')
                            
                        except Usuario.DoesNotExist:
                            self.stdout.write(self.style.WARNING(f'  ⚠ Usuario antiguo no encontrado para pedido {pedido.Pedido_ID}'))
                        except User.DoesNotExist:
                            self.stdout.write(self.style.WARNING(f'  ⚠ User nuevo no encontrado para pedido {pedido.Pedido_ID}'))
                    else:
                        pedidos_sin_usuario += 1
                        self.stdout.write(f'  - Pedido {pedido.Pedido_ID} sin usuario')
                
                self.stdout.write(self.style.SUCCESS(f'\n✓ Pedidos migrados: {pedidos_migrados}'))
                self.stdout.write(self.style.SUCCESS(f'Pedidos sin usuario: {pedidos_sin_usuario}'))
                self.stdout.write(self.style.SUCCESS('\n¡Migración de pedidos completada!'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\nError durante la migración: {str(e)}'))
            import traceback
            self.stdout.write(traceback.format_exc())
            raise