from django.shortcuts import render
def inicio(request):
    return render(request, "mi_app/inicio.html")
# Create your views here.
