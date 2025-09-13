from rest_framework.views import APIView # Importa la clase APIView de Django REST Framework
from rest_framework.response import Response # Importa la clase Response para manejar respuestas HTTP
from .models import Usuario, Rol, RolesXUsuarios # Importa los modelos Usuario, Rol y RolesXUsuarios desde el archivo models.py en el mismo directorio
from .serializers import UsuarioSerializer, RolSerializer, RolesXUsuariosSerializer # Importa los serializadores desde el archivo serializers.py en el mismo directorio

# View de Usuarios
class UsuarioList(APIView): # Define una vista para listar y crear usuarios
    def get(self, request): # Maneja las solicitudes GET
        usuarios = Usuario.objects.all() # Obtiene todos los objetos Usuario
        serializer = UsuarioSerializer(usuarios, many=True) # Serializa los objetos Usuario
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def post(self, request): # Maneja las solicitudes POST
        serializer = UsuarioSerializer(data=request.data) # Deserializa los datos recibidos
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda el nuevo objeto Usuario
            return Response(serializer.data, status=201) # Devuelve los datos serializados con estado 201 (creado)
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

class UsuarioDetail(APIView): # Define una vista para obtener, actualizar o eliminar un usuario específico
    def get(self, request, pk): # Maneja las solicitudes GET para un usuario específico
        usuario = Usuario.objects.get(pk=pk) # Obtiene el objeto Usuario por su clave primaria (pk)                                    
        serializer = UsuarioSerializer(usuario) # Serializa el objeto Usuario
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar un usuario específico
        usuario = Usuario.objects.get(pk=pk) # Obtiene el objeto Usuario por su clave primaria (pk)
        serializer = UsuarioSerializer(usuario, data=request.data) # Deserializa los datos recibidos para actualizar el objeto Usuario
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda los cambios en el objeto Usuario
            return Response(serializer.data) # Devuelve los datos serializados en la respuesta
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar un usuario específico
        usuario = Usuario.objects.get(pk=pk) # Obtiene el objeto Usuario por su clave primaria (pk)
        usuario.delete() # Elimina el objeto Usuario
        return Response(status=204) # Devuelve una respuesta con estado 204 (sin contenido)

# View de Roles
class RolList(APIView): # Define una vista para listar y crear roles
    def get(self, request): # Maneja las solicitudes GET
        roles = Rol.objects.all() # Obtiene todos los objetos Rol
        serializer = RolSerializer(roles, many=True) # Serializa los objetos Rol
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def post(self, request): # Maneja las solicitudes POST
        serializer = RolSerializer(data=request.data) # Deserializa los datos recibidos
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda el nuevo objeto Rol
            return Response(serializer.data, status=201) # Devuelve los datos serializados con estado 201 (creado)
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

class RolDetail(APIView): # Define una vista para obtener, actualizar o eliminar un rol específico
    def get(self, request, pk): # Maneja las solicitudes GET para un rol específico
        rol = Rol.objects.get(pk=pk) # Obtiene el objeto Rol por su clave primaria (pk)
        serializer = RolSerializer(rol) # Serializa el objeto Rol
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar un rol específico
        rol = Rol.objects.get(pk=pk) # Obtiene el objeto Rol por su clave primaria (pk)
        serializer = RolSerializer(rol, data=request.data) # Deserializa los datos recibidos para actualizar el objeto Rol
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda los cambios en el objeto Rol
            return Response(serializer.data) # Devuelve los datos serializados en la respuesta
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar un rol específico
        rol = Rol.objects.get(pk=pk) # Obtiene el objeto Rol por su clave primaria (pk)
        rol.delete() # Elimina el objeto Rol
        return Response(status=204) # Devuelve una respuesta con estado 204 (sin contenido)

# View de RolesXUsuarios
class RolesXUsuariosList(APIView): # Define una vista para listar y crear asociaciones entre roles y usuarios
    def get(self, request): # Maneja las solicitudes GET
        roles_x_usuarios = RolesXUsuarios.objects.all() # Obtiene todos los objetos RolesXUsuarios
        serializer = RolesXUsuariosSerializer(roles_x_usuarios, many=True) # Serializa los objetos RolesXUsuarios
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def post(self, request): # Maneja las solicitudes POST
        serializer = RolesXUsuariosSerializer(data=request.data) # Deserializa los datos recibidos
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda el nuevo objeto RolesXUsuarios
            return Response(serializer.data, status=201) # Devuelve los datos serializados con estado 201 (creado)
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

class RolesXUsuariosDetail(APIView): # Define una vista para obtener, actualizar o eliminar una asociación específica entre roles y usuarios
    def get(self, request, pk): # Maneja las solicitudes GET para una asociación específica
        rol_x_usuario = RolesXUsuarios.objects.get(pk=pk) # Obtiene el objeto RolesXUsuarios por su clave primaria (pk)
        serializer = RolesXUsuariosSerializer(rol_x_usuario) # Serializa el objeto RolesXUsuarios
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar una asociación específica
        rol_x_usuario = RolesXUsuarios.objects.get(pk=pk) # Obtiene el objeto RolesXUsuarios por su clave primaria (pk)
        serializer = RolesXUsuariosSerializer(rol_x_usuario, data=request.data) # Deserializa los datos recibidos para actualizar el objeto RolesXUsuarios
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda los cambios en el objeto RolesXUsuarios
            return Response(serializer.data) # Devuelve los datos serializados en la respuesta
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar una asociación específica
        rol_x_usuario = RolesXUsuarios.objects.get(pk=pk) # Obtiene el objeto RolesXUsuarios por su clave primaria (pk)
        rol_x_usuario.delete() # Elimina el objeto RolesXUsuarios
        return Response(status=204) # Devuelve una respuesta con estado 204 (sin contenido)