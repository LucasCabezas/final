# usuarios/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from django.db import transaction
from django.core.files.storage import default_storage
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import os
import logging

from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from .utils import generate_password_reset_token, verify_password_reset_token
from .models import PerfilUsuario
logger = logging.getLogger(__name__)

# 🔥 NUEVO: Serializer JWT personalizado
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Agregar información adicional al token
        token['username'] = user.username
        token['role'] = user.groups.first().name if user.groups.exists() else None
        
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Agregar datos del usuario a la respuesta
        user = self.user
        roles = [group.name for group in user.groups.all()]
        rol_nombre = roles[0] if roles else None
        
        # Obtener la URL de la foto de perfil si existe
        foto_perfil_url = None
        if hasattr(user, 'perfil') and user.perfil.foto_perfil:
            foto_perfil_url = user.perfil.foto_perfil.url

        data.update({
            'user': {
                'id': user.id,
                'username': user.username,
                'nombre': user.first_name,
                'apellido': user.last_name,
                'correo': user.email,
                'rol': rol_nombre,
                'foto_perfil': foto_perfil_url
            }
        })
        
        return data

# 🔥 NUEVO: Vista JWT personalizada
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ===== LOGIN LEGACY (mantener para compatibilidad) =====
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        
        if user is not None:
            roles = [group.name for group in user.groups.all()]
            rol_nombre = roles[0] if roles else None
            
            # ✅ Obtener la URL de la foto de perfil si existe
            foto_perfil_url = None
            if hasattr(user, 'perfil') and user.perfil.foto_perfil:
                foto_perfil_url = user.perfil.foto_perfil.url

            # 🔥 NUEVO: Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            # ✅ CORRECCIÓN: Devolver TODOS los datos del usuario + tokens
            return Response({
                "message": "Login exitoso",
                "id": user.id,
                "usuario": user.username,  # Para compatibilidad con frontend
                "nombre": user.first_name,
                "apellido": user.last_name,
                "correo": user.email,
                "rol": rol_nombre,
                "foto_perfil": foto_perfil_url,
                # 🔥 NUEVOS: Tokens JWT
                "access_token": str(access_token),
                "refresh_token": str(refresh),
                "token_type": "Bearer"
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Credenciales incorrectas"}, status=status.HTTP_401_UNAUTHORIZED)

# ===== VALIDACIÓN DE CORREO =====
class ValidarCorreoView(APIView):
    permission_classes = [AllowAny]
    
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
    permission_classes = [IsAuthenticated]  # 🔥 CAMBIO: Requiere autenticación
    
    def get(self, request):
        users = User.objects.all().select_related('perfil').prefetch_related('groups')
        data = []
        
        for u in users:
            roles = [g.name for g in u.groups.all()]
            
            # ✅ Obtener la URL de la foto de perfil si existe
            foto_perfil_url = None
            if hasattr(u, 'perfil') and u.perfil.foto_perfil:
                foto_perfil_url = u.perfil.foto_perfil.url
            
            data.append({
                "id": u.id,
                "nombre": u.first_name,
                "apellido": u.last_name,
                "correo": u.email,  # 🔥 CAMBIO: usar 'correo' consistente
                "email": u.email,   # Mantener para compatibilidad
                "dni": u.perfil.dni if hasattr(u, 'perfil') else None,
                "rol": roles[0] if roles else None,
                "rol_id": u.groups.first().id if u.groups.exists() else None,
                "foto_perfil": foto_perfil_url  # 🔥 NUEVO
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
            if email and User.objects.filter(email=email).exists():
                return Response(
                    {"error": "Ya existe un usuario con este email"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar que el username no exista
            username = request.data.get('username')
            if username and User.objects.filter(username=username).exists():
                return Response(
                    {"error": "Ya existe un usuario con este nombre de usuario"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                # Crear usuario
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=request.data.get('nombre', ''),
                    last_name=request.data.get('apellido', ''),
                    password=request.data.get('password')
                )
                
                # Asignar DNI al perfil
                if hasattr(user, 'perfil') and dni:
                    user.perfil.dni = dni
                    user.perfil.save()
                
                # Asignar rol
                rol_id = request.data.get('rol_id')
                if rol_id:
                    try:
                        grupo = Group.objects.get(id=rol_id)
                        user.groups.add(grupo)
                    except Group.DoesNotExist:
                        pass

            return Response({
                "message": "Usuario creado exitosamente",
                "user_id": user.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                "error": f"Error al crear usuario: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UsuarioDetail(APIView):
    permission_classes = [IsAuthenticated]  # 🔥 CAMBIO: Requiere autenticación
    
    def get(self, request, pk):
        try:
            user = User.objects.select_related('perfil').prefetch_related('groups').get(pk=pk)
            roles = [g.name for g in user.groups.all()]
            
            # ✅ Obtener la URL de la foto de perfil si existe
            foto_perfil_url = None
            if hasattr(user, 'perfil') and user.perfil.foto_perfil:
                foto_perfil_url = user.perfil.foto_perfil.url
            
            data = {
                "id": user.id,
                "username": user.username,
                "nombre": user.first_name,
                "apellido": user.last_name,
                "correo": user.email,
                "email": user.email,  # Para compatibilidad
                "dni": user.perfil.dni if hasattr(user, 'perfil') else None,
                "rol": roles[0] if roles else None,
                "rol_id": user.groups.first().id if user.groups.exists() else None,
                "foto_perfil": foto_perfil_url
            }
            
            return Response(data)
            
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            
            # Actualizar campos básicos
            user.first_name = request.data.get('nombre', user.first_name)
            user.last_name = request.data.get('apellido', user.last_name)
            user.email = request.data.get('email', user.email)
            
            # Si hay nueva contraseña
            new_password = request.data.get('password')
            if new_password:
                user.set_password(new_password)
            
            user.save()
            
            # Actualizar DNI si existe
            dni = request.data.get('dni')
            if dni and hasattr(user, 'perfil'):
                user.perfil.dni = dni
                user.perfil.save()
            
            # Actualizar rol si se proporciona
            rol_id = request.data.get('rol_id')
            if rol_id:
                try:
                    user.groups.clear()  # Limpiar roles anteriores
                    grupo = Group.objects.get(id=rol_id)
                    user.groups.add(grupo)
                except Group.DoesNotExist:
                    pass

            return Response({"message": "Usuario actualizado exitosamente"})

        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response({"message": "Usuario eliminado exitosamente"})
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

# ===== GESTIÓN DE ROLES =====
class RolList(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        groups = Group.objects.all()
        data = [{"id": g.id, "nombre": g.name} for g in groups]
        return Response(data)

class RolesPorUsuarioView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, usuario_id):
        try:
            user = User.objects.get(pk=usuario_id)
            roles = [{"id": g.id, "nombre": g.name} for g in user.groups.all()]
            return Response({"roles": roles})
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

# ===== FOTO DE PERFIL =====
class UsuarioFotoView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            
            if 'foto_perfil' not in request.data:
                return Response({"error": "No se envió ninguna imagen (foto_perfil)"}, status=400)

            foto = request.data['foto_perfil']
            
            # ✅ SOLUCIÓN: Obtiene el perfil, o lo crea si no existe
            perfil, created = PerfilUsuario.objects.get_or_create(user=user)

            # Eliminar foto anterior si existe
            if perfil.foto_perfil:
                if default_storage.exists(perfil.foto_perfil.name):
                    default_storage.delete(perfil.foto_perfil.name)
            
            # Guardar nueva foto
            perfil.foto_perfil = foto
            perfil.save()
            
            return Response({
                "message": "Foto de perfil actualizada exitosamente",
                "foto_perfil": perfil.foto_perfil.url
            })
            
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)
        except Exception as e:
            print(f"Error al subir foto: {str(e)}") # (Para depurar)
            return Response({"error": f"Error al actualizar foto: {str(e)}"}, status=500)
    
    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            
            if hasattr(user, 'perfil') and user.perfil.foto_perfil:
                # Eliminar archivo
                if default_storage.exists(user.perfil.foto_perfil.name):
                    default_storage.delete(user.perfil.foto_perfil.name)
                
                # Limpiar campo
                user.perfil.foto_perfil = None
                user.perfil.save()
                
                return Response({"message": "Foto de perfil eliminada exitosamente"})
            else:
                return Response({"error": "El usuario no tiene foto de perfil"}, status=400)
                
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

# ===== RECUPERACIÓN DE CONTRASEÑA (mantener funcionalidad existente) =====
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            
            # Generar token JWT para recuperación
            token = generate_password_reset_token(user)
            
            # Crear enlace de recuperación
            reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
            
            # Preparar el email
            subject = 'Recuperación de Contraseña - King Importados'
            message = f"""
            Hola {user.first_name},
            
            Recibimos una solicitud para restablecer tu contraseña.
            
            Haz clic en el siguiente enlace para crear una nueva contraseña:
            {reset_link}
            
            Este enlace expirará en 30 minutos.
            
            Si no solicitaste este cambio, puedes ignorar este mensaje.
            
            Saludos,
            El equipo de King Importados
            """
            
            # Enviar email
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            
            logger.info(f"Email de recuperación enviado a: {email}")
            
            return Response({
                "message": "Si el correo existe, se enviará un enlace de recuperación.",
                "token_debug": token if settings.DEBUG else None  # Solo en desarrollo
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            # Por seguridad, no revelamos si el email existe o no
            return Response({
                "message": "Si el correo existe, se enviará un enlace de recuperación."
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error enviando email de recuperación: {str(e)}")
            return Response({
                "error": "Error interno del servidor. Intenta más tarde."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_reset_token(request):
    token = request.data.get('token')
    
    if not token:
        return Response({"error": "Token requerido"}, status=status.HTTP_400_BAD_REQUEST)
    
    user_data = verify_password_reset_token(token)
    
    if user_data:
        try:
            user = User.objects.get(id=user_data['user_id'])
            return Response({
                "valid": True,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name
                }
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"valid": False, "error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"valid": False, "error": "Token inválido o expirado"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            # Verificar token
            user_data = verify_password_reset_token(token)
            
            if not user_data:
                return Response({
                    "error": "Token inválido o expirado"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Actualizar contraseña
            user = User.objects.get(id=user_data['user_id'])
            user.set_password(new_password)
            user.save()
            
            logger.info(f"Contraseña actualizada para usuario: {user.email}")
            
            return Response({
                "message": "Contraseña actualizada exitosamente"
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                "error": "Usuario no encontrado"
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error actualizando contraseña: {str(e)}")
            return Response({
                "error": "Error interno del servidor"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)