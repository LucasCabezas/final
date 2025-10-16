from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from django.db import transaction
from django.contrib.auth.models import User

from .models import Pedido, DetallePedido
from .serializers import PedidoSerializer
from .forms import DetallePedidoForm
from inventario.models import Prenda, InsumosXPrendas, Insumo


# =====================================================
# 🧩 API REST - Integración con React
# =====================================================

class PedidoList(APIView):
    """
    API: Listar o crear pedidos desde el frontend React.
    """

    def get(self, request):
        try:
            pedidos = Pedido.objects.all().order_by('-Pedido_fecha')
            serializer = PedidoSerializer(pedidos, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @transaction.atomic
    def post(self, request):
        """
        Recibe un JSON del frontend con el siguiente formato:
        {
            "usuario": 1,
            "prendas": [
                {"id_prenda": 3, "cantidad": 2, "talle": "M", "tipo": "LISA"},
                {"id_prenda": 5, "cantidad": 1, "talle": "L", "tipo": "ESTAMPADA"}
            ]
        }
        """
        try:
            data = request.data
            usuario_id = data.get("usuario", 1)
            prendas = data.get("prendas", [])

            print(f"📦 Recibiendo pedido con {len(prendas)} prendas")

            if not prendas:
                return Response({
                    "error": "No se enviaron prendas.",
                    "tipo": "sin_prendas"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Obtener el usuario
            try:
                usuario = User.objects.get(pk=usuario_id)
            except User.DoesNotExist:
                return Response({
                    "error": "Usuario no encontrado.",
                    "tipo": "usuario_no_encontrado"
                }, status=status.HTTP_400_BAD_REQUEST)

            # 🔍 VALIDAR STOCK DE INSUMOS ANTES DE CREAR EL PEDIDO
            insumos_faltantes = []
            
            print("🔍 Iniciando validación de stock...")
            
            for item in prendas:
                prenda_id = item.get("id_prenda")
                cantidad = int(item.get("cantidad", 0))

                try:
                    prenda = Prenda.objects.get(pk=prenda_id)
                    print(f"   ✓ Validando prenda: {prenda.Prenda_nombre} (x{cantidad})")
                except Prenda.DoesNotExist:
                    return Response({
                        "error": f"La prenda con ID {prenda_id} no existe.",
                        "tipo": "prenda_no_encontrada"
                    }, status=status.HTTP_400_BAD_REQUEST)

                # Verificar insumos necesarios
                relaciones = InsumosXPrendas.objects.filter(prenda=prenda)
                
                if not relaciones.exists():
                    print(f"   ⚠️ Prenda sin insumos configurados: {prenda.Prenda_nombre}")
                    insumos_faltantes.append({
                        "prenda": prenda.Prenda_nombre,
                        "mensaje": f"La prenda '{prenda.Prenda_nombre}' no tiene insumos configurados."
                    })
                    continue

                for rel in relaciones:
                    insumo = rel.insumo
                    cantidad_necesaria = rel.Insumo_prenda_cantidad_utilizada * cantidad
                    cantidad_disponible = insumo.Insumo_cantidad

                    print(f"      - Insumo: {insumo.Insumo_nombre}")
                    print(f"        Disponible: {cantidad_disponible} | Necesaria: {cantidad_necesaria}")

                    if cantidad_disponible < cantidad_necesaria:
                        print(f"        ❌ STOCK INSUFICIENTE!")
                        insumos_faltantes.append({
                            "prenda": prenda.Prenda_nombre,
                            "insumo": insumo.Insumo_nombre,
                            "necesaria": float(cantidad_necesaria),
                            "disponible": float(cantidad_disponible),
                            "faltante": float(cantidad_necesaria - cantidad_disponible)
                        })

            # ❌ Si hay insumos faltantes, NO CREAR EL PEDIDO y devolver error
            if insumos_faltantes:
                print(f"❌ Pedido RECHAZADO - {len(insumos_faltantes)} problemas de stock detectados")
                
                mensajes = []
                for falta in insumos_faltantes:
                    if "insumo" in falta:
                        mensajes.append(
                            f"⚠️ {falta['prenda']}: Falta {falta['faltante']:.2f} unidades de '{falta['insumo']}' "
                            f"(Disponible: {falta['disponible']:.2f}, Necesaria: {falta['necesaria']:.2f})"
                        )
                    else:
                        mensajes.append(f"⚠️ {falta['mensaje']}")

                # IMPORTANTE: Hacer rollback explícito
                transaction.set_rollback(True)
                
                return Response({
                    "error": "Stock insuficiente para completar el pedido",
                    "tipo": "stock_insuficiente",
                    "detalles": insumos_faltantes,
                    "mensajes": mensajes
                }, status=status.HTTP_400_BAD_REQUEST)

            # ✅ Si llegamos aquí, HAY STOCK SUFICIENTE - Crear el pedido
            print("✅ Stock verificado - Creando pedido...")
            
            # 🔥 CAMBIADO: Crear pedido con estado PENDIENTE
            pedido = Pedido.objects.create(
                Usuario=usuario,
                Pedido_fecha=timezone.now().date(),
                Pedido_estado='PENDIENTE'  # <-- Ahora usa string 'PENDIENTE'
            )

            print(f"📦 Pedido creado con ID: {pedido.Pedido_ID} - Estado: PENDIENTE")

            total_pedido = 0

            for item in prendas:
                prenda_id = item.get("id_prenda")
                cantidad = int(item.get("cantidad", 0))
                talle = item.get("talle", "")
                tipo = item.get("tipo", "LISA")

                prenda = Prenda.objects.get(pk=prenda_id)

                # Crear detalle del pedido
                detalle = DetallePedido.objects.create(
                    pedido=pedido,
                    prenda=prenda,
                    cantidad=cantidad,
                    tipo=tipo,
                    talle_id=1,   # Ajusta según tu modelo
                    color_id=1,   # Ajusta según tu modelo
                    modelo_id=1,  # Ajusta según tu modelo
                    marca_id=1,   # Ajusta según tu modelo
                )

                total_pedido += detalle.precio_total
                print(f"   + Agregado: {prenda.Prenda_nombre} x{cantidad}")

                # 🔥 Descontar insumos utilizados
                relaciones = InsumosXPrendas.objects.filter(prenda=prenda)
                for rel in relaciones:
                    insumo = rel.insumo
                    cantidad_usada = rel.Insumo_prenda_cantidad_utilizada * cantidad
                    stock_anterior = insumo.Insumo_cantidad
                    insumo.Insumo_cantidad -= cantidad_usada
                    insumo.save()
                    print(f"      Descuento: {insumo.Insumo_nombre} {stock_anterior} → {insumo.Insumo_cantidad}")

            # 🔥 ELIMINADO: Ya no cambiamos el estado a True aquí
            # El pedido permanece en estado PENDIENTE
            # pedido.Pedido_estado = True  <-- ESTA LÍNEA FUE ELIMINADA
            # pedido.save()

            print(f"✅ Pedido {pedido.Pedido_ID} creado exitosamente con estado PENDIENTE")

            return Response({
                "mensaje": "✅ Pedido creado correctamente.",
                "tipo": "exito",
                "pedido_id": pedido.Pedido_ID,
                "estado": pedido.Pedido_estado,
                "total": round(total_pedido, 2)
            }, status=status.HTTP_201_CREATED)

        except ValueError as e:
            print(f"❌ Error de validación: {str(e)}")
            transaction.set_rollback(True)
            return Response({
                "error": str(e),
                "tipo": "error_validacion"
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"❌ Error del servidor: {str(e)}")
            transaction.set_rollback(True)
            return Response({
                "error": str(e),
                "tipo": "error_servidor"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PedidoDetail(APIView):
    """API: Ver, editar o eliminar un pedido existente."""

    def get(self, request, pk):
        pedido = get_object_or_404(Pedido, pk=pk)
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data)

    # 🔥 NUEVO: Método PATCH para actualizar estado (cancelar, completar, etc.)
    def patch(self, request, pk):
        """
        Permite actualizar parcialmente un pedido.
        Usado principalmente para cambiar el estado del pedido.
        
        Ejemplo de request body:
        { "estado": "CANCELADO" }
        """
        pedido = get_object_or_404(Pedido, pk=pk)
        
        # Obtener el nuevo estado del request
        nuevo_estado = request.data.get('estado')
        
        if nuevo_estado:
            # Validar que el estado sea válido
            estados_validos = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO']
            
            if nuevo_estado in estados_validos:
                pedido.Pedido_estado = nuevo_estado
                pedido.save()
                
                print(f"✅ Pedido {pedido.Pedido_ID} actualizado a estado: {nuevo_estado}")
                
                serializer = PedidoSerializer(pedido)
                return Response(serializer.data)
            else:
                return Response(
                    {
                        "error": f"Estado '{nuevo_estado}' no válido. Estados permitidos: {', '.join(estados_validos)}",
                        "tipo": "estado_invalido"
                    }, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Si no hay estado específico, actualizar con serializer normal
        serializer = PedidoSerializer(pedido, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        pedido = get_object_or_404(Pedido, pk=pk)
        serializer = PedidoSerializer(pedido, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        pedido = get_object_or_404(Pedido, pk=pk)
        pedido.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# =====================================================
# 💻 Vistas del panel Django (uso interno / administrativo)
# =====================================================

def crear_pedido(request):
    """Permite crear un pedido manualmente desde el panel de administración."""

    usuario = User.objects.first()

    # 🔥 CAMBIADO: Filtrar por estado 'PENDIENTE' en lugar de False
    pedido_actual = Pedido.objects.filter(Usuario=usuario, Pedido_estado='PENDIENTE').first()
    
    if not pedido_actual:
        # 🔥 CAMBIADO: Crear con estado 'PENDIENTE'
        pedido_actual = Pedido.objects.create(
            Usuario=usuario,
            Pedido_fecha=timezone.now().date(),
            Pedido_estado='PENDIENTE'
        )

    items_pedido = DetallePedido.objects.filter(pedido=pedido_actual)
    total_pedido = sum(item.precio_total for item in items_pedido)

    if request.method == 'POST':
        form = DetallePedidoForm(request.POST)
        if form.is_valid():
            detalle = form.save(commit=False)
            detalle.pedido = pedido_actual
            detalle.save()
            messages.success(request, '✅ Ítem agregado al pedido.')
            return redirect('crear_pedido')
    else:
        form = DetallePedidoForm()

    context = {
        'form': form,
        'pedido': pedido_actual,
        'items': items_pedido,
        'total': total_pedido,
    }
    return render(request, 'pedidos/crear_pedido.html', context)


def eliminar_item(request, item_id):
    """Elimina un ítem del pedido desde el panel web."""
    item = get_object_or_404(DetallePedido, id=item_id)
    item.delete()
    messages.success(request, '🗑️ Ítem eliminado del pedido.')
    return redirect('crear_pedido')


def finalizar_pedido(request, pedido_id):
    """Finaliza un pedido manualmente en el panel Django."""
    pedido = get_object_or_404(Pedido, Pedido_ID=pedido_id)
    # 🔥 CAMBIADO: Cambiar a estado 'COMPLETADO' en lugar de True
    pedido.Pedido_estado = 'COMPLETADO'
    pedido.save()
    messages.success(request, '🎉 ¡Pedido realizado exitosamente!')
    return redirect('crear_pedido')