from django import forms
from .models import DetallePedido, Pedido
from inventario.models import Prenda
from clasificaciones.models import Talle, Color, Modelo, Marca


class DetallePedidoForm(forms.ModelForm):
    """Formulario para agregar items al pedido"""
    
    class Meta:
        model = DetallePedido
        fields = ['prenda', 'marca', 'modelo', 'color', 'talle', 'tipo', 'cantidad']
        widgets = {
            'prenda': forms.Select(attrs={'class': 'form-control'}),
            'marca': forms.Select(attrs={'class': 'form-control'}),
            'modelo': forms.Select(attrs={'class': 'form-control'}),
            'color': forms.Select(attrs={'class': 'form-control'}),
            'talle': forms.Select(attrs={'class': 'form-control'}),
            'tipo': forms.Select(attrs={'class': 'form-control'}),
            'cantidad': forms.NumberInput(attrs={'class': 'form-control', 'min': '1', 'value': '1'}),
        }
        labels = {
            'prenda': 'Nombre de la Prenda',
            'marca': 'Marca',
            'modelo': 'Modelo',
            'color': 'Color',
            'talle': 'Talle',
            'tipo': 'Tipo de Prenda',
            'cantidad': 'Cantidad',
        }