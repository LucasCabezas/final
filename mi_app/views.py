from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Prenda
from .serializers import PrendaSerializer
from .models import Insumo
from .serializers import InsumoSerializer
from .models import Pedido
from .serializers import PedidoSerializer
from .models import Taller
from .serializers import TallerSerializer

# Vista para la lista de prendas
class PrendaList(APIView):

    # El método get devuelve todas las prendas
    def get(self, request):
        prendas = Prenda.objects.all()  # Obtiene todas las instancias de Prenda de la base de datos
        serializer = PrendaSerializer(prendas, many=True)  # Serializa la lista de prendas
        return Response(serializer.data)  # Devuelve la lista serializada como respuesta

    # El método post crea una nueva prenda
    def post(self, request):
        serializer = PrendaSerializer(data=request.data)  # Crea un serializador con los datos recibidos
        if serializer.is_valid():  # Verifica si los datos son válidos
            serializer.save()  # Guarda la nueva prenda en la base de datos
            return Response(serializer.data, status=201)  # Devuelve la prenda creada y el estado 201
        return Response(serializer.errors, status=400)  # Devuelve los errores y el estado 400 si no es válido

class PrendaDetail(APIView):
    # El método get devuelve una prenda por su ID
    def get(self, request, pk):
        prenda = Prenda.objects.get(pk=pk)  # Busca la prenda por su clave primaria (ID)
        serializer = PrendaSerializer(prenda)  # Serializa la prenda encontrada
        return Response(serializer.data)  # Devuelve la prenda serializada

    # El método put actualiza una prenda existente
    def put(self, request, pk):
        prenda = Prenda.objects.get(pk=pk)  # Busca la prenda por su ID
        serializer = PrendaSerializer(prenda, data=request.data)  # Crea un serializador con la prenda y los nuevos datos
        if serializer.is_valid():  # Verifica si los datos son válidos
            serializer.save()  # Guarda los cambios en la base de datos
            return Response(serializer.data)  # Devuelve la prenda actualizada
        return Response(serializer.errors, status=400)  # Devuelve los errores si los datos no son válidos

    # El método delete elimina una prenda existente
    def delete(self, request, pk):
        prenda = Prenda.objects.get(pk=pk)  # Busca la prenda por su ID
        prenda.delete()  # Elimina la prenda de la base de datos
        return Response(status=204)  # Devuelve el estado 204 (sin contenido)

# Vista para la lista de insumos
class InsumoList(APIView):
    def get(self, request):
        insumos = Insumo.objects.all()  # Obtiene todos los insumos
        serializer = InsumoSerializer(insumos, many=True)  # Serializa la lista de insumos
        return Response(serializer.data)  # Devuelve la lista serializada

    def post(self, request):
        serializer = InsumoSerializer(data=request.data)  # Crea un serializador con los datos recibidos
        if serializer.is_valid():  # Verifica si los datos son válidos
            serializer.save()  # Guarda el nuevo insumo
            return Response(serializer.data, status=201)  # Devuelve el insumo creado y estado 201
        return Response(serializer.errors, status=400)  # Devuelve errores si no es válido

class InsumoDetail(APIView):
    def get(self, request, pk):
        insumo = Insumo.objects.get(pk=pk)  # Busca el insumo por ID
        serializer = InsumoSerializer(insumo)  # Serializa el insumo encontrado
        return Response(serializer.data)  # Devuelve el insumo serializado

    def put(self, request, pk):
        insumo = Insumo.objects.get(pk=pk)  # Busca el insumo por ID
        serializer = InsumoSerializer(insumo, data=request.data)  # Serializa con los nuevos datos
        if serializer.is_valid():  # Verifica si los datos son válidos
            serializer.save()  # Guarda los cambios
            return Response(serializer.data)  # Devuelve el insumo actualizado
        return Response(serializer.errors, status=400)  # Devuelve errores si no es válido

    def delete(self, request, pk):
        insumo = Insumo.objects.get(pk=pk)  # Busca el insumo por ID
        insumo.delete()  # Elimina el insumo
        return Response(status=204)  # Devuelve estado 204

# Vista para la lista de pedidos
class PedidoList(APIView):

    def get(self, request):
        pedidos = Pedido.objects.all()  # Obtiene todos los pedidos
        serializer = PedidoSerializer(pedidos, many=True)  # Serializa la lista de pedidos
        return Response(serializer.data)  # Devuelve la lista serializada

    def post(self, request):
        serializer = PedidoSerializer(data=request.data)  # Crea un serializador con los datos recibidos
        if serializer.is_valid():  # Verifica si los datos son válidos
            serializer.save()  # Guarda el nuevo pedido
            return Response(serializer.data, status=201)  # Devuelve el pedido creado y estado 201
        return Response(serializer.errors, status=400)  # Devuelve errores si no es válido

class PedidoDetail(APIView):

    def get(self, request, pk):
        pedido = Pedido.objects.get(pk=pk)  # Busca el pedido por ID
        serializer = PedidoSerializer(pedido)  # Serializa el pedido encontrado
        return Response(serializer.data)  # Devuelve el pedido serializado

    def put(self, request, pk):
        pedido = Pedido.objects.get(pk=pk)  # Busca el pedido por ID
        serializer = PedidoSerializer(pedido, data=request.data)  # Serializa con los nuevos datos
        if serializer.is_valid():  # Verifica si los datos son válidos
            serializer.save()  # Guarda los cambios
            return Response(serializer.data)  # Devuelve el pedido actualizado
        return Response(serializer.errors, status=400)  # Devuelve errores si no es válido

    def delete(self, request, pk):
        pedido = Pedido.objects.get(pk=pk)  # Busca el pedido por ID
        pedido.delete()  # Elimina el pedido
        return Response(status=204)  # Devuelve estado 204

class TallerList(APIView):
    def get(self, request):
        talleres = Taller.objects.all()  # Obtiene todos los talleres
        serializer = TallerSerializer(talleres, many=True)  # Serializa la lista de talleres
        return Response(serializer.data)  # Devuelve la lista serializada

    def post(self, request):
        serializer = TallerSerializer(data=request.data)  # Crea un serializador con los datos recibidos
        if serializer.is_valid():  # Verifica si los datos son válidos
            serializer.save()  # Guarda el nuevo taller
            return Response(serializer.data, status=201)  # Devuelve el taller creado y estado 201
        return Response(serializer.errors, status=400)  # Devuelve errores si no es válido

class TallerDetail(APIView):
    def get(self, request, pk):
        taller = Taller.objects.get(pk=pk)  # Busca el taller por ID
        serializer = TallerSerializer(taller)  # Serializa el taller encontrado
        return Response(serializer.data)  # Devuelve el taller serializado

    def put(self, request, pk):
        taller = Taller.objects.get(pk=pk)  # Busca el taller por ID
        serializer = TallerSerializer(taller, data=request.data)  # Serializa con los nuevos datos
        if serializer.is_valid():  # Verifica si los datos son válidos
            serializer.save()  # Guarda los cambios
            return Response(serializer.data)  # Devuelve el taller actualizado
        return Response(serializer.errors, status=400)  # Devuelve errores si no es válido

    def delete(self, request, pk):
        taller = Taller.objects.get(pk=pk)  # Busca el taller por ID
        taller.delete()  # Elimina el taller
        return Response(status=204)  # Devuelve estado 204
