from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
import logging

logger = logging.getLogger(__name__)

# Login ACTUALIZADO para usar Django Auth
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # Intentar autenticar con Django
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # Usuario autenticado correctamente
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

# Validación de correo ACTUALIZADA
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

# Roles por usuario ACTUALIZADO
class RolesPorUsuarioView(APIView):
    def get(self, request, usuario_id):
        try:
            user = User.objects.get(id=usuario_id)
            roles = user.groups.all()
            data = [{"rol_id": rol.id, "rol_nombre": rol.name} for rol in roles]
            return Response(data)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

# CRUD Usuarios ACTUALIZADO
class UsuarioList(APIView):
    def get(self, request):
        users = User.objects.all()
        data = [{
            "id": u.id,
            "nombre": u.first_name,
            "apellido": u.last_name,
            "email": u.email,
            "dni": u.perfil.dni if hasattr(u, 'perfil') else None
        } for u in users]
        return Response(data)

    def post(self, request):
        try:
            user = User.objects.create_user(
                username=request.data.get('email'),
                email=request.data.get('email'),
                password=request.data.get('password'),
                first_name=request.data.get('nombre'),
                last_name=request.data.get('apellido')
            )
            
            if hasattr(user, 'perfil'):
                user.perfil.dni = request.data.get('dni')
                user.perfil.save()
            
            rol_id = request.data.get('rol_id')
            if rol_id:
                group = Group.objects.get(id=rol_id)
                user.groups.add(group)
            
            return Response({
                "id": user.id,
                "nombre": user.first_name,
                "apellido": user.last_name,
                "email": user.email
            }, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class UsuarioDetail(APIView):
    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            return Response({
                "id": user.id,
                "nombre": user.first_name,
                "apellido": user.last_name,
                "email": user.email,
                "dni": user.perfil.dni if hasattr(user, 'perfil') else None
            })
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.first_name = request.data.get('nombre', user.first_name)
            user.last_name = request.data.get('apellido', user.last_name)
            user.email = request.data.get('email', user.email)
            
            if request.data.get('password'):
                user.set_password(request.data.get('password'))
            
            user.save()
            
            if hasattr(user, 'perfil') and request.data.get('dni'):
                user.perfil.dni = request.data.get('dni')
                user.perfil.save()
            
            return Response({"message": "Usuario actualizado"})
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response(status=204)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

# CRUD Roles ACTUALIZADO
class RolList(APIView):
    def get(self, request):
        groups = Group.objects.all()
        data = [{"id": g.id, "nombre": g.name} for g in groups]
        return Response(data)

    def post(self, request):
        group, created = Group.objects.get_or_create(name=request.data.get('nombre'))
        return Response({"id": group.id, "nombre": group.name}, status=201 if created else 200)

class RolDetail(APIView):
    def get(self, request, pk):
        try:
            group = Group.objects.get(pk=pk)
            return Response({"id": group.id, "nombre": group.name})
        except Group.DoesNotExist:
            return Response({"error": "Rol no encontrado"}, status=404)

    def put(self, request, pk):
        try:
            group = Group.objects.get(pk=pk)
            group.name = request.data.get('nombre', group.name)
            group.save()
            return Response({"id": group.id, "nombre": group.name})
        except Group.DoesNotExist:
            return Response({"error": "Rol no encontrado"}, status=404)

    def delete(self, request, pk):
        try:
            group = Group.objects.get(pk=pk)
            group.delete()
            return Response(status=204)
        except Group.DoesNotExist:
            return Response({"error": "Rol no encontrado"}, status=404)

# Asignar roles a usuarios
class RolesXUsuariosList(APIView):
    def post(self, request):
        try:
            user = User.objects.get(id=request.data.get('usuario_id'))
            group = Group.objects.get(id=request.data.get('rol_id'))
            user.groups.add(group)
            return Response({"message": "Rol asignado"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class RolesXUsuariosDetail(APIView):
    def delete(self, request, pk):
        # pk debería ser usuario_id y rol_id separados por guión
        try:
            usuario_id, rol_id = pk.split('-')
            user = User.objects.get(id=usuario_id)
            group = Group.objects.get(id=rol_id)
            user.groups.remove(group)
            return Response(status=204)
        except Exception as e:
            return Response({"error": str(e)}, status=400)