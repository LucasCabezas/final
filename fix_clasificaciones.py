import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mi_proyecto.settings')
django.setup()

from inventario.models import Prenda
from clasificaciones.models import Marca, Modelo, Color

print("🔧 Iniciando corrección de datos...\n")

# Obtener o crear valores por defecto válidos
marca_default, _ = Marca.objects.get_or_create(Marca_nombre="Sin Marca")
modelo_default, _ = Modelo.objects.get_or_create(Modelo_nombre="Sin Modelo")
color_default, _ = Color.objects.get_or_create(Color_nombre="Sin Color")

print(f"✅ Valores por defecto creados:")
print(f"   Marca: {marca_default.Marca_nombre} (ID: {marca_default.Marca_ID})")
print(f"   Modelo: {modelo_default.Modelo_nombre} (ID: {modelo_default.Modelo_ID})")
print(f"   Color: {color_default.Color_nombre} (ID: {color_default.Color_ID})\n")

# Corregir prendas con marcas inválidas (IDs 6 y 7)
print("🔄 Corrigiendo prendas con marcas inválidas...")
prendas_marca_invalida = Prenda.objects.filter(Prenda_marca_id__in=[6, 7])
count = prendas_marca_invalida.count()
prendas_marca_invalida.update(Prenda_marca=marca_default)
print(f"   ✅ {count} prendas actualizadas\n")

# Corregir prendas con modelos inválidos (IDs 6 y 8)
print("🔄 Corrigiendo prendas con modelos inválidos...")
prendas_modelo_invalido = Prenda.objects.filter(Prenda_modelo_id__in=[6, 8])
count = prendas_modelo_invalido.count()
prendas_modelo_invalido.update(Prenda_modelo=modelo_default)
print(f"   ✅ {count} prendas actualizadas\n")

# Corregir prendas con colores inválidos (ID 5)
print("🔄 Corrigiendo prendas con colores inválidos...")
prendas_color_invalido = Prenda.objects.filter(Prenda_color_id=5)
count = prendas_color_invalido.count()
prendas_color_invalido.update(Prenda_color=color_default)
print(f"   ✅ {count} prendas actualizadas\n")

# Eliminar registros inválidos
print("🗑️  Eliminando registros inválidos...")
Marca.objects.filter(Marca_ID__in=[6, 7]).delete()
print("   ✅ Marcas inválidas eliminadas")

Modelo.objects.filter(Modelo_ID__in=[6, 8]).delete()
print("   ✅ Modelos inválidos eliminados")

Color.objects.filter(Color_ID=5).delete()
print("   ✅ Colores inválidos eliminados\n")

# Verificar resultado
print("✨ Verificando resultado final...")
for p in Prenda.objects.all():
    print(f"\nPrenda: {p.Prenda_nombre}")
    print(f"   Marca: {p.Prenda_marca.Marca_nombre if p.Prenda_marca else 'Sin marca'}")
    print(f"   Modelo: {p.Prenda_modelo.Modelo_nombre if p.Prenda_modelo else 'Sin modelo'}")
    print(f"   Color: {p.Prenda_color.Color_nombre if p.Prenda_color else 'Sin color'}")

print("\n🎉 ¡Corrección completada exitosamente!")