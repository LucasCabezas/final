from rest_framework.views import APIView # Importa la clase base para las vistas de la API
from rest_framework.response import Response # Importa la clase para manejar las respuestas HTTP
from .models import Insumo, Prenda # Importa los modelos desde el archivo models.py
from .serializers import InsumoSerializer, PrendaSerializer # Importa los serializadores desde el archivo serializers.py

# View de Insumos
class InsumoList(APIView): # Vista para listar y crear insumos
    def get(self, request): # Maneja las solicitudes GET
        insumos = Insumo.objects.all() # Obtiene todos los insumos de la base de datos
        serializer = InsumoSerializer(insumos, many=True) # Serializa los insumos
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def post(self, request): # Maneja las solicitudes POST
        serializer = InsumoSerializer(data=request.data) # Deserializa los datos recibidos
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda el nuevo insumo en la base de datos
            return Response(serializer.data, status=201) # Devuelve los datos del nuevo insumo con estado 201 (creado)
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)
    
class InsumoDetail(APIView): # Vista para obtener, actualizar o eliminar un insumo específico
    def get(self, request, pk): # Maneja las solicitudes GET para un insumo específico
        insumo = Insumo.objects.get(pk=pk) # Obtiene el insumo por su clave primaria (pk)
        serializer = InsumoSerializer(insumo) # Serializa el insumo
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar un insumo específico
        insumo = Insumo.objects.get(pk=pk) # Obtiene el insumo por su clave primaria (pk)
        serializer = InsumoSerializer(insumo, data=request.data) # Deserializa los datos recibidos para actualizar el insumo
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda los cambios en la base de datos
            return Response(serializer.data) # Devuelve los datos actualizados del insumo
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar un insumo específico
        insumo = Insumo.objects.get(pk=pk) # Obtiene el insumo por su clave primaria (pk)
        insumo.delete() # Elimina el insumo de la base de datos
        return Response(status=204) # Devuelve una respuesta con estado 204 (sin contenido)

# View de Prendas    
class PrendaList(APIView): # Vista para listar y crear prendas
    def get(self, request): # Maneja las solicitudes GET
        prendas = Prenda.objects.all() # Obtiene todas las prendas de la base de datos
        serializer = PrendaSerializer(prendas, many=True) # Serializa las prendas
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def post(self, request): # Maneja las solicitudes POST
        serializer = PrendaSerializer(data=request.data) # Deserializa los datos recibidos
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda la nueva prenda en la base de datos
            return Response(serializer.data, status=201) # Devuelve los datos de la nueva prenda con estado 201 (creado)
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

class PrendaDetail(APIView): # Vista para obtener, actualizar o eliminar una prenda específica
    def get(self, request, pk): # Maneja las solicitudes GET para una prenda específica
        prenda = Prenda.objects.get(pk=pk) # Obtiene la prenda por su clave primaria (pk)
        serializer = PrendaSerializer(prenda) # Serializa la prenda
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar una prenda específica
        prenda = Prenda.objects.get(pk=pk) # Obtiene la prenda por su clave primaria (pk)
        serializer = PrendaSerializer(prenda, data=request.data) # Deserializa los datos recibidos para actualizar la prenda
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda los cambios en la base de datos
            return Response(serializer.data) # Devuelve los datos actualizados de la prenda
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar una prenda específica
        prenda = Prenda.objects.get(pk=pk) # Obtiene la prenda por su clave primaria (pk)
        prenda.delete() # Elimina la prenda de la base de datos
        return Response(status=204) # Devuelve una respuesta con estado 204 (sin contenido)
