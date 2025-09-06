from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Prenda
from .serializers import PrendaSerializer
from .models import Insumo
from .serializers import InsumoSerializer

# Vista para la lista de prendas
class PrendaList(APIView):

    # El metodo get devuelve todas las prendas
    def get(self, request):
        prendas = Prenda.objects.all()
        serializer = PrendaSerializer(prendas, many=True)
        return Response(serializer.data)

    # El metodo post crea una nueva prenda
    def post(self, request):
        serializer = PrendaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

        
class PrendaDetail(APIView):
    # El metodo get devuelve una prenda por su ID
    def get(self, request, pk):
        prenda = Prenda.objects.get(pk=pk)
        serializer = PrendaSerializer(prenda)
        return Response(serializer.data)

    # El metodo put actualiza una prenda existente
    def put(self, request, pk):
        prenda = Prenda.objects.get(pk=pk)
        serializer = PrendaSerializer(prenda, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    # El metodo delete elimina una prenda existente
    def delete(self, request, pk):
        prenda = Prenda.objects.get(pk=pk)
        prenda.delete()
        return Response(status=204)


# Vista para la lista de insumos
class InsumoList(APIView):
    def get(self, request):
        insumos = Insumo.objects.all()
        serializer = InsumoSerializer(insumos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = InsumoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class InsumoDetail(APIView):
    def get(self, request, pk):
        insumo = Insumo.objects.get(pk=pk)
        serializer = InsumoSerializer(insumo)
        return Response(serializer.data)

    def put(self, request, pk):
        insumo = Insumo.objects.get(pk=pk)
        serializer = InsumoSerializer(insumo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        insumo = Insumo.objects.get(pk=pk)
        insumo.delete()
        return Response(status=204)