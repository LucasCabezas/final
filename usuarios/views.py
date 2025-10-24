# usuarios/views.py
# usuarios/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
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
            
            # ✅ Obtener la URL de la foto de perfil si existe
            foto_perfil_url = None
            if hasattr(user, 'perfil') and user.perfil.foto_perfil:
                foto_perfil_url = user.perfil.foto_perfil.url

            # ✅ CORRECCIÓN: Devolver TODOS los datos del usuario
            return Response({
                "message": "Login exitoso",
                "id": user.id,
                "nombre": user.first_name,
                "apellido": user.last_name,
                "correo": user.email,
                "rol": rol_nombre,
                "foto_perfil": foto_perfil_url
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
                    username=email,
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
            
            # Obtener la URL de la foto de perfil si existe
            foto_perfil_url = None
            if hasattr(user, 'perfil') and user.perfil.foto_perfil:
                foto_perfil_url = user.perfil.foto_perfil.url
            
            return Response({
                "id": user.id,
                "nombre": user.first_name,
                "apellido": user.last_name,
                "correo": user.email,
                "dni": user.perfil.dni if hasattr(user, 'perfil') else None,
                "rol": roles[0] if roles else None,
                "rol_id": user.groups.first().id if user.groups.exists() else None,  # ✅ CORREGIDO: era 'u', ahora es 'user'
                "foto_perfil": foto_perfil_url
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
            new_email = request.data.get('correo') or request.data.get('email')
            if new_email and new_email != user.email:
                if User.objects.filter(email=new_email).exclude(pk=pk).exists():
                    return Response(
                        {"error": "Ya existe un usuario con este correo electrónico"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                user.email = new_email
                user.username = new_email
            
            # Validar y actualizar contraseña si se proporciona
            contrasena_actual = request.data.get('contrasenaActual')
            nueva_contrasena = request.data.get('nuevaContrasena')
            
            if nueva_contrasena:
                # Verificar que la contraseña actual sea correcta
                if not contrasena_actual:
                    return Response(
                        {"error": "Debe proporcionar la contraseña actual"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if not user.check_password(contrasena_actual):
                    return Response(
                        {"error": "La contraseña actual es incorrecta"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Validar requisitos de la nueva contraseña
                if len(nueva_contrasena) < 6:
                    return Response(
                        {"error": "La contraseña debe tener al menos 6 caracteres"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if not any(c.isupper() for c in nueva_contrasena):
                    return Response(
                        {"error": "La contraseña debe contener al menos una mayúscula"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if not any(c.islower() for c in nueva_contrasena):
                    return Response(
                        {"error": "La contraseña debe contener al menos una minúscula"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if not any(c.isdigit() for c in nueva_contrasena):
                    return Response(
                        {"error": "La contraseña debe contener al menos un número"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Actualizar contraseña
                user.set_password(nueva_contrasena)
            
            user.save()
            
            # Obtener la URL de la foto de perfil actual
            foto_perfil_url = None
            if hasattr(user, 'perfil') and user.perfil.foto_perfil:
                foto_perfil_url = user.perfil.foto_perfil.url
            
            return Response({
                "id": user.id,
                "nombre": user.first_name,
                "apellido": user.last_name,
                "correo": user.email,
                "dni": user.perfil.dni if hasattr(user, 'perfil') else None,
                "foto_perfil": foto_perfil_url,
                "message": "Usuario actualizado exitosamente"
            })
            
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)
        except Exception as e:
            logger.error(f"Error al actualizar usuario: {str(e)}")
            return Response(
                {"error": f"Error al actualizar usuario: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            
            # Eliminar foto de perfil si existe
            if hasattr(user, 'perfil') and user.perfil.foto_perfil:
                foto_path = user.perfil.foto_perfil.path
                if os.path.exists(foto_path):
                    os.remove(foto_path)
            
            user.delete()
            return Response({"message": "Usuario eliminado exitosamente"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

# ===== SUBIDA DE FOTO DE PERFIL =====
class UsuarioFotoView(APIView):
    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            
            if not hasattr(user, 'perfil'):
                return Response(
                    {"error": "El usuario no tiene un perfil asociado"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            foto = request.FILES.get('foto_perfil')
            if not foto:
                return Response(
                    {"error": "No se proporcionó ninguna imagen"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar tipo de archivo
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
            if foto.content_type not in allowed_types:
                return Response(
                    {"error": "Tipo de archivo no permitido. Use JPG, PNG o GIF"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar tamaño (5MB máximo)
            if foto.size > 5 * 1024 * 1024:
                return Response(
                    {"error": "La imagen debe ser menor a 5MB"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Eliminar foto anterior si existe
            if user.perfil.foto_perfil:
                old_photo_path = user.perfil.foto_perfil.path
                if os.path.exists(old_photo_path):
                    os.remove(old_photo_path)
            
            # Guardar nueva foto
            user.perfil.foto_perfil = foto
            user.perfil.save()
            
            return Response({
                "message": "Foto de perfil actualizada exitosamente",
                "foto_perfil": user.perfil.foto_perfil.url
            })
            
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)
        except Exception as e:
            logger.error(f"Error al subir foto: {str(e)}")
            return Response(
                {"error": f"Error al subir foto: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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


# ========================================
# 🔐 RECUPERACIÓN DE CONTRASEÑA
# ========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """
    Endpoint para solicitar recuperación de contraseña.
    Recibe un email y envía un correo con el link de recuperación.
    """
    serializer = PasswordResetRequestSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email'].lower()
        
        try:
            user = User.objects.get(email__iexact=email)
            
            # Generar token JWT
            token = generate_password_reset_token(user)
            
            # Crear URL de recuperación
            reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
            
            # Contexto para el template del email
            context = {
                'user': user,
                'reset_url': reset_url,
                'expiry_minutes': settings.JWT_PASSWORD_RESET_TOKEN_EXPIRY
            }
            
            # Renderizar el email HTML
            html_message = render_to_string('emails/password_reset.html', context)
            plain_message = strip_tags(html_message)
            
            # Enviar email
            send_mail(
                subject='Recuperación de Contraseña - King Importados',
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Email de recuperación enviado a: {email}")
            
            return Response({
                'message': 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña.'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            # Por seguridad, retornamos el mismo mensaje aunque el usuario no exista
            # Esto evita que alguien pueda verificar qué emails están registrados
            logger.warning(f"Intento de recuperación con email no registrado: {email}")
            return Response({
                'message': 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña.'
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error al enviar email de recuperación: {str(e)}")
            return Response({
                'error': 'Hubo un error al enviar el correo. Por favor, inténtalo más tarde.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    """
    Endpoint para confirmar el cambio de contraseña.
    Recibe el token y la nueva contraseña.
    """
    serializer = PasswordResetConfirmSerializer(data=request.data)
    
    if serializer.is_valid():
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        # Verificar token
        user = verify_password_reset_token(token)
        
        if user is None:
            return Response({
                'error': 'El token es inválido o ha expirado.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Cambiar la contraseña
        user.set_password(new_password)
        user.save()
        
        logger.info(f"Contraseña actualizada correctamente para usuario: {user.email}")
        
        return Response({
            'message': 'Tu contraseña ha sido actualizada correctamente.'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_reset_token(request):
    """
    Endpoint opcional para verificar si un token es válido antes de mostrar el formulario.
    """
    token = request.query_params.get('token')
    
    if not token:
        return Response({
            'valid': False,
            'error': 'Token no proporcionado.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = verify_password_reset_token(token)
    
    if user:
        return Response({
            'valid': True,
            'email': user.email
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'valid': False,
            'error': 'El token es inválido o ha expirado.'
        }, status=status.HTTP_400_BAD_REQUEST)