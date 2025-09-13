from rest_framework.views import APIView # Importa la clase base para las vistas de la API
from rest_framework.response import Response # Importa la clase para manejar respuestas HTTP
from .models import Pedido # Importa el modelo Pedido
from .serializers import PedidoSerializer  # Importa el serializador para el modelo Pedido

# View de Pedidos
class PedidoList(APIView): # Vista para listar y crear pedidos
    def get(self, request): # Maneja las solicitudes GET
        pedidos = Pedido.objects.all() # Obtiene todos los pedidos
        serializer = PedidoSerializer(pedidos, many=True) # Serializa los pedidos
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def post(self, request): # Maneja las solicitudes POST
        serializer = PedidoSerializer(data=request.data) # Deserializa los datos recibidos
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda el nuevo pedido
            return Response(serializer.data, status=201) # Devuelve los datos del nuevo pedido con estado 201
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400

class PedidoDetail(APIView): # Vista para obtener, actualizar o eliminar un pedido específico
    def get(self, request, pk): # Maneja las solicitudes GET para un pedido específico
        pedido = Pedido.objects.get(pk=pk) # Obtiene el pedido por su clave primaria
        serializer = PedidoSerializer(pedido) # Serializa el pedido
        return Response(serializer.data) # Devuelve los datos serializados en la respuesta

    def put(self, request, pk): # Maneja las solicitudes PUT para actualizar un pedido específico
        pedido = Pedido.objects.get(pk=pk) # Obtiene el pedido por su clave primaria
        serializer = PedidoSerializer(pedido, data=request.data) # Deserializa los datos recibidos
        if serializer.is_valid(): # Valida los datos
            serializer.save() # Guarda los cambios en el pedido
            return Response(serializer.data) # Devuelve los datos actualizados del pedido
        return Response(serializer.errors, status=400) # Devuelve los errores de validación con estado 400

    def delete(self, request, pk): # Maneja las solicitudes DELETE para eliminar un pedido específico
        pedido = Pedido.objects.get(pk=pk) # Obtiene el pedido por su clave primaria
        pedido.delete() # Elimina el pedido
        return Response(status=204) # Devuelve una respuesta vacía con estado 204