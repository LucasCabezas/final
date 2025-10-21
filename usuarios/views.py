# usuarios/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

# ===== LOGIN =====
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        
        if user is not None:
            roles = [group.name for group in user.groups.all()]
            rol_nombre = roles[0] if roles else None

            return Response({
                "message": "Login exitoso",
                "usuario": user.get_full_name(),
                "id": user.id,
                "rol": rol_nombre
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Credenciales incorrectas"}, status=status.HTTP_401_UNAUTHORIZED)

# ===== VALIDACIÓN DE CORREO =====
class ValidarCorreoView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "El campo 'email' es obligatorio"}, status=400)

        try:
            usuario = User.objects.get(email=email)
            return Response({"message": "Correo válido", "usuario_id": usuario.id}, status=200)
        except User.DoesNotExist:
            return Response({"error": "Correo no registrado"}, status=404)

# ===== CRUD USUARIOS =====
class UsuarioList(APIView):
    def get(self, request):
        users = User.objects.all().select_related('perfil').prefetch_related('groups')
        data = []
        
        for u in users:
            roles = [g.name for g in u.groups.all()]
            data.append({
                "id": u.id,
                "nombre": u.first_name,
                "apellido": u.last_name,
                "email": u.email,
                "dni": u.perfil.dni if hasattr(u, 'perfil') else None,
                "rol": roles[0] if roles else None,
                "rol_id": u.groups.first().id if u.groups.exists() else None
            })
        
        return Response(data)

    def post(self, request):
        try:
            # Validar que el DNI no exista
            dni = request.data.get('dni')
            if dni:
                from .models import PerfilUsuario
                if PerfilUsuario.objects.filter(dni=dni).exists():
                    return Response(
                        {"error": "Ya existe un usuario con este DNI"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Validar que el email no exista
            email = request.data.get('email')
            if User.objects.filter(email=email).exists():
                return Response(
                    {"error": "Ya existe un usuario con este correo electrónico"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                # Crear usuario
                user = User.objects.create_user(
                    username=email,  # Usamos el email como username
                    email=email,
                    password=request.data.get('password'),
                    first_name=request.data.get('nombre', ''),
                    last_name=request.data.get('apellido', '')
                )
                
                # Asignar DNI al perfil
                if dni and hasattr(user, 'perfil'):
                    user.perfil.dni = dni
                    user.perfil.save()
                
                # Asignar rol
                rol_id = request.data.get('rol_id')
                if rol_id:
                    try:
                        group = Group.objects.get(id=rol_id)
                        user.groups.add(group)
                    except Group.DoesNotExist:
                        pass
                
                return Response({
                    "id": user.id,
                    "nombre": user.first_name,
                    "apellido": user.last_name,
                    "email": user.email,
                    "dni": user.perfil.dni if hasattr(user, 'perfil') else None
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            logger.error(f"Error al crear usuario: {str(e)}")
            return Response(
                {"error": f"Error al crear usuario: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class UsuarioDetail(APIView):
    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            roles = [g.name for g in user.groups.all()]
            
            return Response({
                "id": user.id,
                "nombre": user.first_name,
                "apellido": user.last_name,
                "email": user.email,
                "dni": user.perfil.dni if hasattr(user, 'perfil') else None,
                "rol": roles[0] if roles else None,
                "rol_id": user.groups.first().id if user.groups.exists() else None
            })
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            
            # Actualizar campos básicos
            user.first_name = request.data.get('nombre', user.first_name)
            user.last_name = request.data.get('apellido', user.last_name)
            
            # Actualizar email si cambió
            new_email = request.data.get('email')
            if new_email and new_email != user.email:
                if User.objects.filter(email=new_email).exclude(pk=pk).exists():
                    return Response(
                        {"error": "Ya existe un usuario con este correo electrónico"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                user.email = new_email
                user.username = new_email
            
            # Actualizar contraseña si se proporciona
            if request.data.get('password'):
                user.set_password(request.data.get('password'))
            
            user.save()
            
            # Actualizar DNI
            if hasattr(user, 'perfil'):
                new_dni = request.data.get('dni')
                if new_dni and new_dni != user.perfil.dni:
                    from .models import PerfilUsuario
                    if PerfilUsuario.objects.filter(dni=new_dni).exclude(user=user).exists():
                        return Response(
                            {"error": "Ya existe un usuario con este DNI"}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    user.perfil.dni = new_dni
                    user.perfil.save()
            
            # Actualizar rol
            rol_id = request.data.get('rol_id')
            if rol_id:
                try:
                    user.groups.clear()
                    group = Group.objects.get(id=rol_id)
                    user.groups.add(group)
                except Group.DoesNotExist:
                    pass
            
            return Response({"message": "Usuario actualizado exitosamente"})
            
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response(status=204)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

# ===== ROLES/GRUPOS =====
class RolList(APIView):
    def get(self, request):
        groups = Group.objects.all()
        data = [{"id": g.id, "nombre": g.name} for g in groups]
        return Response(data)

# ===== ROLES POR USUARIO =====
class RolesPorUsuarioView(APIView):
    def get(self, request, usuario_id):
        try:
            user = User.objects.get(id=usuario_id)
            roles = user.groups.all()
            data = [{"rol_id": rol.id, "rol_nombre": rol.name} for rol in roles]
            return Response(data)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)