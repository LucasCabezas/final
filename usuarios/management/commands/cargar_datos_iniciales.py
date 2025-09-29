from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from usuarios.models import PerfilUsuario

class Command(BaseCommand):
    help = 'Carga datos iniciales de usuarios y roles'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Cargando datos iniciales...'))
        
        # 1. Crear grupos (roles)
        self.stdout.write('\nCreando grupos (roles)...')
        roles = ['Dueño', 'Vendedor', 'Costurero', 'Estampador']
        
        for rol in roles:
            group, created = Group.objects.get_or_create(name=rol)
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Grupo creado: {rol}'))
            else:
                self.stdout.write(f'  - Grupo ya existe: {rol}')
        
        # 2. Crear usuarios de prueba
        self.stdout.write('\nCreando usuarios de prueba...')
        
        usuarios_datos = [
            {
                'username': 'admin@king.com',
                'email': 'admin@king.com',
                'password': 'admin123',
                'first_name': 'Admin',
                'last_name': 'Sistema',
                'dni': 12345678,
                'rol': 'Dueño'
            },
            {
                'username': 'vendedor@king.com',
                'email': 'vendedor@king.com',
                'password': 'vendedor123',
                'first_name': 'Juan',
                'last_name': 'Pérez',
                'dni': 87654321,
                'rol': 'Vendedor'
            },
            {
                'username': 'costurero@king.com',
                'email': 'costurero@king.com',
                'password': 'costurero123',
                'first_name': 'María',
                'last_name': 'González',
                'dni': 11223344,
                'rol': 'Costurero'
            },
            {
                'username': 'estampador@king.com',
                'email': 'estampador@king.com',
                'password': 'estampador123',
                'first_name': 'Carlos',
                'last_name': 'Rodríguez',
                'dni': 55667788,
                'rol': 'Estampador'
            }
        ]
        
        for datos in usuarios_datos:
            if User.objects.filter(username=datos['username']).exists():
                self.stdout.write(f"  - Usuario ya existe: {datos['username']}")
            else:
                user = User.objects.create_user(
                    username=datos['username'],
                    email=datos['email'],
                    password=datos['password'],
                    first_name=datos['first_name'],
                    last_name=datos['last_name']
                )
                
                # Asignar DNI al perfil
                if hasattr(user, 'perfil'):
                    user.perfil.dni = datos['dni']
                    user.perfil.save()
                else:
                    PerfilUsuario.objects.create(user=user, dni=datos['dni'])
                
                # Asignar rol
                group = Group.objects.get(name=datos['rol'])
                user.groups.add(group)
                
                self.stdout.write(self.style.SUCCESS(
                    f"  ✓ Usuario creado: {datos['username']} / {datos['password']} ({datos['rol']})"
                ))
        
        self.stdout.write(self.style.SUCCESS('\n¡Datos iniciales cargados correctamente!'))
        self.stdout.write('\nUsuarios disponibles:')
        self.stdout.write('  - admin@king.com / admin123 (Dueño)')
        self.stdout.write('  - vendedor@king.com / vendedor123 (Vendedor)')
        self.stdout.write('  - costurero@king.com / costurero123 (Costurero)')
        self.stdout.write('  - estampador@king.com / estampador123 (Estampador)')