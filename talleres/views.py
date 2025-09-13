from rest_framework.views import APIView # Importa la clase APIView de Django REST Framework
from rest_framework.response import Response # Importa la clase Response para manejar respuestas HTTP
from .models import Taller, PrendasXTalleres # Importa los modelos necesarios desde el archivo models.py
from .serializers import TallerSerializer, PrendasXTalleresSerializer # Importa los serializadores necesarios desde el archivo serializers.py

# View de Talleres
class TallerList(APIView): # Define una vista para listar y crear talleres
    def get(self, request): # Maneja las solicitudes GET
        talleres = Taller.objects.all() # Obtiene todos los objetos Taller
        serializer = TallerSerializer(talleres, many=True) # Serializa los objetos obtenidos
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta
    
    def post(self, request): # Maneja las solicitudes POST
        serializer = TallerSerializer(data=request.data) # Deserializa los datos recibidos
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda el nuevo taller
            return Response(serializer.data, status=201) # Devuelve los datos del nuevo taller con estado 201
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400
    
class TallerDetail(APIView): # Define una vista para obtener, actualizar o eliminar un taller específico
    def get(self, request, pk): # Maneja las solicitudes GET para un taller específico
        taller = Taller.objects.get(pk=pk) # Obtiene el taller por su clave primaria
        serializer = TallerSerializer(taller) # Serializa el taller obtenido
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar un taller específico
        taller = Taller.objects.get(pk=pk) # Obtiene el taller por su clave primaria
        serializer = TallerSerializer(taller, data=request.data) # Serializa el taller obtenido con los nuevos datos
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda los cambios en el taller
            return Response(serializer.data) # Devuelve los datos actualizados del taller
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar un taller específico
        taller = Taller.objects.get(pk=pk) # Obtiene el taller por su clave primaria
        taller.delete() # Elimina el taller
        return Response(status=204) # Devuelve una respuesta vacía con estado 204

# View de PrendasXTalleres
class PrendasXTalleresList(APIView): # Define una vista para listar y crear relaciones PrendasXTalleres
    def get(self, request): # Maneja las solicitudes GET
        prendas_xtalleres = PrendasXTalleres.objects.all()
        serializer = PrendasXTalleresSerializer(prendas_xtalleres, many=True) # Serializa los objetos obtenidos
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta
    
    def post(self, request): # Maneja las solicitudes POST
        serializer = PrendasXTalleresSerializer(data=request.data) # Deserializa los datos recibidos
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda la nueva relación PrendasXTalleres
            return Response(serializer.data, status=201) # Devuelve los datos de la nueva relación con estado 201
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400

class PrendasXTalleresDetail(APIView): # Define una vista para obtener, actualizar o eliminar una relación PrendasXTalleres específica
    def get(self, request, pk): # Maneja las solicitudes GET para una relación específica
        prendas_xtalleres = PrendasXTalleres.objects.get(pk=pk) # Obtiene la relación por su clave primaria
        serializer = PrendasXTalleresSerializer(prendas_xtalleres) # Serializa la relación obtenida
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar una relación específica
        prendas_xtalleres = PrendasXTalleres.objects.get(pk=pk) # Obtiene la relación por su clave primaria
        serializer = PrendasXTalleresSerializer(prendas_xtalleres, data=request.data) # Serializa la relación obtenida con los nuevos datos
        if serializer.is_valid(): # Valida los datos deserializados
            serializer.save() # Guarda los cambios en la relación
            return Response(serializer.data) # Devuelve los datos actualizados de la relación
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar una relación específica
        prendas_xtalleres = PrendasXTalleres.objects.get(pk=pk) # Obtiene la relación por su clave primaria
        prendas_xtalleres.delete() # Elimina la relación
        return Response(status=204) # Devuelve una respuesta vacía con estado 204