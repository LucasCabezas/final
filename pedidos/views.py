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
            # 🔹 Leer parámetro opcional de filtro por estado
            estado = request.query_params.get("estado", None)

            pedidos = Pedido.objects.prefetch_related(
                'detalles',
                'detalles__prenda',
                'detalles__talle',
                'detalles__color',
                'detalles__modelo',
                'detalles__marca',
            ).all().order_by("-Pedido_ID")

            # 🔥 Si viene el parámetro ?estado= filtrar
            if estado:
                pedidos = pedidos.filter(Pedido_estado=estado)

            data = []
            for p in pedidos:
                detalles = []
                for d in p.detalles.all():
                    subtotal = round(d.precio_total or (d.precio_unitario * d.cantidad), 2)
                    detalles.append({
                        "id": d.id,
                        "prenda": d.prenda.Prenda_ID,
                        "prenda_nombre": d.prenda.Prenda_nombre,
                        "prenda_marca": getattr(d.prenda.Prenda_marca, "Marca_nombre", ""),
                        "prenda_modelo": getattr(d.prenda.Prenda_modelo, "Modelo_nombre", ""),
                        "prenda_color": getattr(d.prenda.Prenda_color, "Color_nombre", ""),
                        "prenda_imagen": d.prenda.Prenda_imagen.url if d.prenda.Prenda_imagen else None,
                        "cantidad": d.cantidad,
                        "tipo": d.get_tipo_display() if hasattr(d, "get_tipo_display") else d.tipo,
                        "talle": str(getattr(d.talle, "Talle_codigo", "-")),
                        "precio_unitario": round(d.precio_unitario or 0, 2),
                        "precio_total": subtotal,
                    })

                total_pedido = round(sum(d["precio_total"] for d in detalles), 2)

                data.append({
                    "Pedido_ID": p.Pedido_ID,
                    "Usuario": p.Usuario_id,
                    "usuario": getattr(p.Usuario, "email", None),
                    "Pedido_fecha": p.Pedido_fecha,
                    "Pedido_estado": p.Pedido_estado,
                    "total_pedido": total_pedido,
                    "detalles": detalles,
                })

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback; traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    @transaction.atomic
    def post(self, request):
        try:
            data = request.data
            usuario_id = data.get("usuario", 1)
            prendas = data.get("prendas", [])
            porcentaje_ganancia = float(data.get("porcentaje_ganancia", 0))
            estado = data.get("estado", "PENDIENTE_DUENO")

            if not prendas:
                return Response({"error": "No se enviaron prendas."}, status=status.HTTP_400_BAD_REQUEST)

            usuario = User.objects.get(pk=usuario_id)

            # 🔥 1️⃣ Verificar STOCK antes de crear el pedido
            insumos_insuficientes = []

            for item in prendas:
                prenda_id = item.get("id_prenda")
                cantidad = int(item.get("cantidad", 0))
                if not prenda_id or cantidad <= 0:
                    continue

                try:
                    prenda = Prenda.objects.get(pk=prenda_id)
                except Prenda.DoesNotExist:
                    return Response({"tipo": "prenda_no_encontrada", "error": f"Prenda ID {prenda_id} no encontrada."},
                                    status=status.HTTP_400_BAD_REQUEST)

                # Recorremos los insumos asociados
                for rel in InsumosXPrendas.objects.filter(prenda=prenda):
                    insumo = rel.insumo
                    cantidad_necesaria = rel.Insumo_prenda_cantidad_utilizada * cantidad

                    if insumo.Insumo_cantidad < cantidad_necesaria:
                        insumos_insuficientes.append({
                            "nombre": insumo.Insumo_nombre,
                            "disponible": insumo.Insumo_cantidad,
                            "requerido": cantidad_necesaria,
                            "faltante": round(cantidad_necesaria - insumo.Insumo_cantidad, 2),
                            "unidad": getattr(insumo.unidad_medida, "UnidadMedida_nombre", "")
                        })

            # 🔥 Si hay faltantes, cancelar creación
            if insumos_insuficientes:
                return Response({
                    "tipo": "stock_insuficiente",
                    "mensajes": [
                        f"{i['nombre']} → faltan {i['faltante']} {i['unidad']} (Disp: {i['disponible']})"
                        for i in insumos_insuficientes
                    ]
                }, status=status.HTTP_400_BAD_REQUEST)

            # 🔹 2️⃣ Si todo bien, crear el pedido normalmente
            pedido = Pedido.objects.create(
                Usuario=usuario,
                Pedido_fecha=timezone.now().date(),
                Pedido_estado=estado
            )

            total_pedido = 0.0
            from clasificaciones.models import Talle

            for item in prendas:
                prenda_id = item.get("id_prenda")
                cantidad = int(item.get("cantidad", 0))
                tipo = item.get("tipo", "LISA")
                talle_codigo = item.get("talle")

                prenda = Prenda.objects.get(pk=prenda_id)

                talle = None
                if talle_codigo:
                    talle = Talle.objects.filter(Talle_codigo__iexact=str(talle_codigo).strip()).first()
                if not talle:
                    talle, _ = Talle.objects.get_or_create(Talle_codigo="UNICO", defaults={"Talle_nombre": "Único"})

                # 💰 Calcular costos
                if not prenda.Prenda_costo_total_produccion or prenda.Prenda_costo_total_produccion == 0:
                    from django.db.models import Sum, F
                    costo_insumos = (
                        InsumosXPrendas.objects.filter(prenda=prenda)
                        .aggregate(total=Sum(F("Insumo_prenda_costo_total")))["total"] or 0
                    )
                    prenda.Prenda_costo_total_produccion = round(costo_insumos, 2)
                    prenda.save(update_fields=["Prenda_costo_total_produccion"])

                costo_produccion = float(prenda.Prenda_costo_total_produccion)
                precio_unitario = round(costo_produccion * (1 + porcentaje_ganancia / 100), 2)
                precio_total = round(precio_unitario * cantidad, 2)

                detalle = DetallePedido.objects.create(
                    pedido=pedido,
                    prenda=prenda,
                    cantidad=cantidad,
                    tipo=tipo,
                    talle=talle,
                    color=prenda.Prenda_color,
                    modelo=prenda.Prenda_modelo,
                    marca=prenda.Prenda_marca,
                    precio_unitario=precio_unitario,
                    precio_total=precio_total,
                )

                total_pedido += precio_total

                # 🔥 3️⃣ Descontar insumos del stock (ya verificados)
                for rel in InsumosXPrendas.objects.filter(prenda=prenda):
                    insumo = rel.insumo
                    cantidad_usada = rel.Insumo_prenda_cantidad_utilizada * cantidad
                    insumo.Insumo_cantidad -= cantidad_usada
                    insumo.save(update_fields=["Insumo_cantidad"])

            pedido.Pedido_total = total_pedido
            pedido.save(update_fields=["Pedido_total"])

            return Response({
                "mensaje": "✅ Pedido creado correctamente.",
                "tipo": "exito",
                "pedido_id": pedido.Pedido_ID,
                "estado": pedido.Pedido_estado,
                "total": round(total_pedido, 2)
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            import traceback; traceback.print_exc()
            transaction.set_rollback(True)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PedidoDetail(APIView):
    """API: Ver, editar o eliminar un pedido existente."""

    def get(self, request, pk):
        pedido = get_object_or_404(Pedido, pk=pk)
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data)

    # ✅ Agregar PATCH (no está habilitado en tu instancia actual)
    def patch(self, request, pk):
        pedido = get_object_or_404(Pedido, pk=pk)
        nuevo_estado = request.data.get('estado') or request.data.get('Pedido_estado')

        if not nuevo_estado:
            return Response({"error": "Campo 'estado' requerido"}, status=status.HTTP_400_BAD_REQUEST)

        estados_validos = [
            'PENDIENTE_DUENO',
            'APROBADO_DUENO',
            'PENDIENTE_ESTAMPADO',
            'COMPLETADO',
            'CANCELADO'
        ]
        if nuevo_estado not in estados_validos:
            return Response(
                {"error": f"Estado '{nuevo_estado}' no válido. Debe ser uno de {estados_validos}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        pedido.Pedido_estado = nuevo_estado
        pedido.save()
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    try:
        data = request.data
        usuario_id = data.get('usuario')
        prendas = data.get('prendas', [])
        porcentaje_ganancia = float(data.get('porcentaje_ganancia', 0))
        estado = data.get('estado', 'PENDIENTE')

        # Crear el pedido
        pedido = Pedido.objects.create(
            Usuario_id=usuario_id if usuario_id else None,
            Pedido_fecha=timezone.now(),
            Pedido_estado=estado
        )

        total_pedido = 0

        for prenda_data in prendas:
            prenda_id = prenda_data.get('prenda_id')
            cantidad = int(prenda_data.get('cantidad', 1))
            tipo = prenda_data.get('tipo', 'LISA')
            talle_id = prenda_data.get('talle_id')

            # Obtener la prenda base
            prenda = Prenda.objects.get(Prenda_ID=prenda_id)

            # Crear el detalle (usa los cálculos internos)
            detalle = DetallePedido.objects.create(
                pedido=pedido,
                prenda=prenda,
                talle_id=talle_id,
                tipo=tipo,
                cantidad=cantidad,
                marca_id=prenda.Prenda_marca_id,
                modelo_id=prenda.Prenda_modelo_id,
                color_id=prenda.Prenda_color_id,
            )

            # Calcular ganancia aplicada sobre el precio_total base
            precio_con_ganancia = detalle.precio_total * (1 + porcentaje_ganancia / 100)

            # Actualizar el detalle para reflejar precio final
            detalle.precio_total = precio_con_ganancia
            detalle.save(update_fields=['precio_total'])

            # Sumar al total del pedido
            total_pedido += precio_con_ganancia

        return Response({
            "tipo": "exito",
            "mensaje": "✅ Pedido creado correctamente.",
            "pedido_id": pedido.Pedido_ID,
            "estado": pedido.Pedido_estado,
            "total": round(total_pedido, 2)
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({
            "error": str(e),
            "tipo": "error_servidor"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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