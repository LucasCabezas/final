# usuarios/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from django.db import transaction
from django.core.files.storage import default_storage
from django.conf import settings
import os
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
                "correo": user.email,  # Cambiado de "email" a "correo"
                "dni": user.perfil.dni if hasattr(user, 'perfil') else None,
                "rol": roles[0] if roles else None,
                "rol_id": user.groups.first().id if user.groups.exists() else None,
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
                
                import re
                if not re.search(r'[A-Z]', nueva_contrasena):
                    return Response(
                        {"error": "La contraseña debe contener al menos una mayúscula"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if not re.search(r'[a-z]', nueva_contrasena):
                    return Response(
                        {"error": "La contraseña debe contener al menos una minúscula"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if not re.search(r'\d', nueva_contrasena):
                    return Response(
                        {"error": "La contraseña debe contener al menos un número"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                user.set_password(nueva_contrasena)
            
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
            
            # Devolver los datos actualizados
            return Response({
                "id": user.id,
                "nombre": user.first_name,
                "apellido": user.last_name,
                "correo": user.email,
                "message": "Usuario actualizado exitosamente"
            })
            
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)
        except Exception as e:
            logger.error(f"Error al actualizar usuario: {str(e)}")
            return Response(
                {"error": f"Error al actualizar usuario: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response(status=204)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

# 🆕 NUEVO: Endpoint para subir foto de perfil
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