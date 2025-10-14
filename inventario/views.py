from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Insumo, Prenda, AlertaStock
from .serializers import InsumoSerializer, PrendaSerializer, AlertaStockSerializer

class InsumoList(APIView):
    def get(self, request):
        try:
            insumos = Insumo.objects.all()
            serializer = InsumoSerializer(insumos, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        serializer = InsumoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class InsumoDetail(APIView):
    def get_object(self, pk):
        try:
            return Insumo.objects.get(pk=pk)
        except Insumo.DoesNotExist:
            return None

    def get(self, request, pk):
        insumo = self.get_object(pk)
        if insumo is None:
            return Response(
                {'error': 'Insumo no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = InsumoSerializer(insumo)
        return Response(serializer.data)

    def put(self, request, pk):
        insumo = self.get_object(pk)
        if insumo is None:
            return Response(
                {'error': 'Insumo no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = InsumoSerializer(insumo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        insumo = self.get_object(pk)
        if insumo is None:
            return Response(
                {'error': 'Insumo no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        insumo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# NUEVO: Vista para obtener alertas de bajo stock activas
class AlertaStockList(APIView):
    def get(self, request):
        try:
            alertas = AlertaStock.objects.filter(estado='activa').order_by('-fecha_creacion')
            serializer = AlertaStockSerializer(alertas, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# NUEVO: Endpoint para obtener insumos bajo stock
@api_view(['GET'])
def obtener_insumos_bajo_stock(request):
    try:
        insumos_bajo_stock = Insumo.objects.filter(
            Insumo_cantidad__lte=models.F('Insumo_cantidad_minima')
        )
        serializer = InsumoSerializer(insumos_bajo_stock, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

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