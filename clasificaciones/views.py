from rest_framework.views import APIView # Importa la clase base APIView de Django REST Framework
from rest_framework.response import Response # Importa la clase Response para enviar respuestas HTTP
from .models import Talle, Color, Modelo, Marca # Importa los modelos necesarios desde el archivo models.py
from .serializers import TalleSerializer, ColorSerializer, ModeloSerializer, MarcaSerializer # Importa los serializadores desde el archivo serializers.py

# View de Talles
class TalleList(APIView): # Define una vista para listar y crear talles
    def get(self, request): # Maneja las solicitudes GET
        talles = Talle.objects.all() # Obtiene todos los objetos Talle
        serializer = TalleSerializer(talles, many=True) # Serializa los objetos obtenidos
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta
    
    def post(self, request): # Maneja las solicitudes POST
        serializer = TalleSerializer(data=request.data) # Deserializa los datos recibidos en la solicitud
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda el nuevo objeto Talle
            return Response(serializer.data, status=201) # Devuelve los datos del nuevo objeto con estado 201 (creado)
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

class TalleDetail(APIView): # Define una vista para obtener, actualizar o eliminar un talle específico
    def get(self, request, pk): # Maneja las solicitudes GET para un talle específico
        talle = Talle.objects.get(pk=pk) # Obtiene el objeto Talle por su clave primaria (pk)
        serializer = TalleSerializer(talle) # Serializa el objeto obtenido
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar un talle específico
        talle = Talle.objects.get(pk=pk) # Obtiene el objeto Talle por su clave primaria (pk)
        serializer = TalleSerializer(talle, data=request.data) # Deserializa los datos recibidos en la solicitud
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda los cambios en el objeto Talle
            return Response(serializer.data) # Devuelve los datos actualizados del objeto
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar un talle específico
        talle = Talle.objects.get(pk=pk) # Obtiene el objeto Talle por su clave primaria (pk)
        talle.delete() # Elimina el objeto Talle
        return Response(status=204) # Devuelve una respuesta con estado 204 (sin contenido)

# View de Colores
class ColorList(APIView): # Define una vista para listar y crear colores
    def get(self, request): # Maneja las solicitudes GET
        colors = Color.objects.all() # Obtiene todos los objetos Color
        serializer = ColorSerializer(colors, many=True) # Serializa los objetos obtenidos
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def post(self, request): # Maneja las solicitudes POST
        serializer = ColorSerializer(data=request.data) # Deserializa los datos recibidos en la solicitud
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda el nuevo objeto Color
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class ColorDetail(APIView): # Define una vista para obtener, actualizar o eliminar un color específico
    def get(self, request, pk): # Maneja las solicitudes GET para un color específico
        color = Color.objects.get(pk=pk) # Obtiene el objeto Color por su clave primaria (pk)
        serializer = ColorSerializer(color) # Serializa el objeto obtenido
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar un color específico
        color = Color.objects.get(pk=pk) # Obtiene el objeto Color por su clave primaria (pk)
        serializer = ColorSerializer(color, data=request.data) # Deserializa los datos recibidos en la solicitud
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda los cambios en el objeto Color
            return Response(serializer.data) # Devuelve los datos actualizados del objeto
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar un color específico
        color = Color.objects.get(pk=pk) # Obtiene el objeto Color por su clave primaria (pk)
        color.delete() # Elimina el objeto Color
        return Response(status=204) # Devuelve una respuesta con estado 204 (sin contenido)

# View de Modelos
class ModeloList(APIView): # Define una vista para listar y crear modelos
    def get(self, request): # Maneja las solicitudes GET
        modelos = Modelo.objects.all() # Obtiene todos los objetos Modelo
        serializer = ModeloSerializer(modelos, many=True) # Serializa los objetos obtenidos
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def post(self, request): # Maneja las solicitudes POST
        serializer = ModeloSerializer(data=request.data) # Deserializa los datos recibidos en la solicitud
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda el nuevo objeto Modelo
            return Response(serializer.data, status=201) # Devuelve los datos del nuevo objeto con estado 201 (creado)
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

class ModeloDetail(APIView): # Define una vista para obtener, actualizar o eliminar un modelo específico
    def get(self, request, pk): # Maneja las solicitudes GET para un modelo específico
        modelo = Modelo.objects.get(pk=pk) # Obtiene el objeto Modelo por su clave primaria (pk)
        serializer = ModeloSerializer(modelo) # Serializa el objeto obtenido
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar un modelo específico
        modelo = Modelo.objects.get(pk=pk) # Obtiene el objeto Modelo por su clave primaria (pk)
        serializer = ModeloSerializer(modelo, data=request.data) # Deserializa los datos recibidos en la solicitud
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda los cambios en el objeto Modelo
            return Response(serializer.data) # Devuelve los datos actualizados del objeto
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar un modelo específico
        modelo = Modelo.objects.get(pk=pk) # Obtiene el objeto Modelo por su clave primaria (pk)
        modelo.delete() # Elimina el objeto Modelo
        return Response(status=204) # Devuelve una respuesta con estado 204 (sin contenido)

# View de Marcas
class MarcaList(APIView): # Define una vista para listar y crear marcas
    def get(self, request): # Maneja las solicitudes GET
        marcas = Marca.objects.all() # Obtiene todos los objetos Marca
        serializer = MarcaSerializer(marcas, many=True) # Serializa los objetos obtenidos
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def post(self, request): # Maneja las solicitudes POST
        serializer = MarcaSerializer(data=request.data) # Deserializa los datos recibidos en la solicitud
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda el nuevo objeto Marca
            return Response(serializer.data, status=201) # Devuelve los datos del nuevo objeto con estado 201 (creado)
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

class MarcaDetail(APIView): # Define una vista para obtener, actualizar o eliminar una marca específica
    def get(self, request, pk): # Maneja las solicitudes GET para una marca específica
        marca = Marca.objects.get(pk=pk) # Obtiene el objeto Marca por su clave primaria (pk)  
        serializer = MarcaSerializer(marca) # Serializa el objeto obtenido
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar una marca específica
        marca = Marca.objects.get(pk=pk) # Obtiene el objeto Marca por su clave primaria (pk)
        serializer = MarcaSerializer(marca, data=request.data) # Deserializa los datos recibidos en la solicitud
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda los cambios en el objeto Marca
            return Response(serializer.data) # Devuelve los datos actualizados del objeto
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400 (solicitud incorrecta)

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar una marca específica
        marca = Marca.objects.get(pk=pk) # Obtiene el objeto Marca por su clave primaria (pk)
        marca.delete() # Elimina el objeto Marca
        return Response(status=204) # Devuelve una respuesta con estado 204 (sin contenido)