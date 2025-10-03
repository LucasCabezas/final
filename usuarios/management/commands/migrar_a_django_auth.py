from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from usuarios.models import Usuario, Rol, RolesXUsuarios, PerfilUsuario
from django.db import transaction

class Command(BaseCommand):
    help = 'Migra datos de Usuario y Rol a User y Group de Django'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Iniciando migración...'))
        
        try:
            with transaction.atomic():
                # 1. Migrar Roles a Groups
                self.stdout.write('Migrando roles a grupos...')
                roles_migrados = 0
                for rol in Rol.objects.all():
                    group, created = Group.objects.get_or_create(name=rol.Rol_nombre)
                    if created:
                        roles_migrados += 1
                        self.stdout.write(f'  ✓ Grupo creado: {group.name}')
                    else:
                        self.stdout.write(f'  - Grupo ya existe: {group.name}')
                
                self.stdout.write(self.style.SUCCESS(f'Roles migrados: {roles_migrados}'))
                
                # 2. Migrar Usuarios a User
                self.stdout.write('\nMigrando usuarios...')
                usuarios_migrados = 0
                usuarios_existentes = 0
                
                for usuario in Usuario.objects.all():
                    username = usuario.Usuario_email
                    
                    if User.objects.filter(username=username).exists():
                        self.stdout.write(f'  - Usuario ya existe: {username}')
                        user = User.objects.get(username=username)
                        usuarios_existentes += 1
                    else:
                        user = User.objects.create_user(
                            username=username,
                            email=usuario.Usuario_email,
                            first_name=usuario.Usuario_nombre,
                            last_name=usuario.Usuario_apellido,
                        )
                        # Establecer contraseña
                        user.set_password(usuario.Usuario_contrasena)
                        user.save()
                        usuarios_migrados += 1
                        self.stdout.write(f'  ✓ Usuario creado: {username}')
                    
                    # 3. Crear o actualizar perfil con DNI
                    perfil, created = PerfilUsuario.objects.get_or_create(
                        user=user,
                        defaults={'dni': usuario.Usuario_dni}
                    )
                    if not created:
                        perfil.dni = usuario.Usuario_dni
                        perfil.save()
                    
                    # 4. Asignar roles (grupos)
                    roles_usuario = RolesXUsuarios.objects.filter(usuario=usuario)
                    for rol_x_usuario in roles_usuario:
                        group = Group.objects.get(name=rol_x_usuario.rol.Rol_nombre)
                        user.groups.add(group)
                        self.stdout.write(f'    → Rol asignado: {group.name}')
                
                self.stdout.write(self.style.SUCCESS(f'\nUsuarios nuevos migrados: {usuarios_migrados}'))
                self.stdout.write(self.style.SUCCESS(f'Usuarios existentes actualizados: {usuarios_existentes}'))
                
                self.stdout.write(self.style.SUCCESS('\n✓ ¡Migración completada exitosamente!'))
                self.stdout.write(self.style.WARNING('\nIMPORTANTE: Verifica que todo funcione antes de eliminar los modelos antiguos.'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\nError durante la migración: {str(e)}'))
            import traceback
            self.stdout.write(traceback.format_exc())
            raise