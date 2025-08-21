from django.urls import path
from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('menu_dueño', views.menu_dueño, name='menu_dueño'),
    path('menu_costurero', views.menu_costurero, name='menu_costurero'),
    path('menu_vendedores', views.menu_vendedores, name='menu_vendedores'),
    
]