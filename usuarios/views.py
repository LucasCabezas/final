from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario, Rol, RolesXUsuarios
from .serializers import UsuarioSerializer, RolSerializer, RolesXUsuariosSerializer
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import RolesXUsuarios, Rol

class RolesPorUsuarioView(APIView):
    def get(self, request, usuario_id):
        roles_x_usuarios = RolesXUsuarios.objects.filter(usuario_id=usuario_id)
        data = []
        for ru in roles_x_usuarios:
            rol_obj = Rol.objects.get(pk=ru.rol_id)
            data.append({
                "rol_id": rol_obj.pk,
                "rol_nombre": rol_obj.Rol_nombre
            })
        return Response(data)
logger = logging.getLogger(__name__)
# Login
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            user = Usuario.objects.get(Usuario_email=username)

            if user.Usuario_contrasena == password:  # ⚠️ texto plano
                # Obtener el rol
                rol_x_usuario = RolesXUsuarios.objects.filter(usuario=user).first()
                rol_nombre = rol_x_usuario.rol.Rol_nombre if rol_x_usuario else None

                return Response({
                    "message": "Login exitoso",
                    "usuario": f"{user.Usuario_nombre} {user.Usuario_apellido}",
                    "id": user.Usuario_ID,
                    "rol": rol_nombre
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Contraseña incorrecta"}, status=status.HTTP_401_UNAUTHORIZED)

        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

# Validación de correo para recuperación de contraseña
class ValidarCorreoView(APIView):
    def post(self, request):
        logger.info(f"Datos recibidos en ValidarCorreoView: {request.data}")

        email = request.data.get("email")
        if not email:
            logger.warning("No se recibió el campo 'email'")
            return Response({"error": "El campo 'email' es obligatorio"}, status=400)

        try:
            usuario = Usuario.objects.get(Usuario_email=email)
            logger.info(f"Usuario encontrado: {usuario.Usuario_nombre} {usuario.Usuario_apellido}")
            return Response({"message": "Correo válido", "usuario_id": usuario.Usuario_ID}, status=200)
        except Usuario.DoesNotExist:
            logger.warning(f"Correo no registrado: {email}")
            return Response({"error": "Correo no registrado"}, status=404)

# CRUD Usuarios
class UsuarioList(APIView):
    def get(self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class UsuarioDetail(APIView):
    def get(self, request, pk):
        usuario = Usuario.objects.get(pk=pk)
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)

    def put(self, request, pk):
        usuario = Usuario.objects.get(pk=pk)
        serializer = UsuarioSerializer(usuario, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        usuario = Usuario.objects.get(pk=pk)
        usuario.delete()
        return Response(status=204)

# CRUD Roles
class RolList(APIView):
    def get(self, request):
        roles = Rol.objects.all()
        serializer = RolSerializer(roles, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RolSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class RolDetail(APIView):
    def get(self, request, pk):
        rol = Rol.objects.get(pk=pk)
        serializer = RolSerializer(rol)
        return Response(serializer.data)

    def put(self, request, pk):
        rol = Rol.objects.get(pk=pk)
        serializer = RolSerializer(rol, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        rol = Rol.objects.get(pk=pk)
        rol.delete()
        return Response(status=204)

# CRUD RolesXUsuarios
class RolesXUsuariosList(APIView):
    def get(self, request):
        roles_x_usuarios = RolesXUsuarios.objects.all()
        serializer = RolesXUsuariosSerializer(roles_x_usuarios, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RolesXUsuariosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class RolesXUsuariosDetail(APIView):
    def get(self, request, pk):
        rol_x_usuario = RolesXUsuarios.objects.get(pk=pk)
        serializer = RolesXUsuariosSerializer(rol_x_usuario)
        return Response(serializer.data)

    def put(self, request, pk):
        rol_x_usuario = RolesXUsuarios.objects.get(pk=pk)
        serializer = RolesXUsuariosSerializer(rol_x_usuario, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        rol_x_usuario = RolesXUsuarios.objects.get(pk=pk)
        rol_x_usuario.delete()
        return Response(status=204)