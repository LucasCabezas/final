from django.shortcuts import render
def inicio(request):
    return render(request, "mi_app/inicio.html")

def menu_dueño(request):
    return render(request, "mi_app/menu_dueño.html")

def menu_costurero(request):
    return render(request, "mi_app/menu_costurero.html")

def menu_vendedores(request):
    return render(request, "mi_app/menu_vendedores.html")

# Create your views here.
