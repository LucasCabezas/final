from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
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
            usuario_tipo = request.query_params.get("usuario_tipo", None)  # NUEVO

            pedidos = Pedido.objects.prefetch_related(
                'detalles',
                'detalles__prenda',
                'detalles__talle',
                'detalles__color',
                'detalles__modelo',
                'detalles__marca',
            ).all().order_by("-Pedido_ID")

            # 🔥 Filtros por tipo de usuario
            if usuario_tipo == "costurero":
                # Mostrar pedidos que están en estados de costura
                pedidos = pedidos.filter(
                    Pedido_estado__in=[
                        'PENDIENTE_COSTURERO',  # Estado inicial para costurero
                        'EN_PROCESO_COSTURERO'
                    ]
                )
            elif usuario_tipo == "estampador":
                # Mostrar pedidos que están en estados de estampado
                pedidos = pedidos.filter(
                    Pedido_estado__in=[
                        'PENDIENTE_ESTAMPADO', 
                        'EN_PROCESO_ESTAMPADO'
                    ]
                )
            elif usuario_tipo == "dueno":
                # Para el dueño, mostrar todos los pedidos
                pass  # No aplicar filtro adicional

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
                        "precio_unitario": round(d.precio_unitario or 0, 2) if usuario_tipo != "costurero" and usuario_tipo != "estampador" else None,
                        "precio_total": subtotal if usuario_tipo != "costurero" and usuario_tipo != "estampador" else None,
                    })

                total_pedido = round(sum(d["precio_total"] for d in detalles if d["precio_total"]), 2) if usuario_tipo != "costurero" and usuario_tipo != "estampador" else None

                # Mapear estados para mostrar en la interfaz
                estado_display = p.Pedido_estado
                if usuario_tipo == "costurero":
                    if p.Pedido_estado == 'PENDIENTE_COSTURERO':
                        estado_display = 'PENDIENTE'
                    elif p.Pedido_estado == 'EN_PROCESO_COSTURERO':
                        estado_display = 'EN_PROCESO'
                elif usuario_tipo == "estampador":
                    if p.Pedido_estado == 'PENDIENTE_ESTAMPADO':
                        estado_display = 'PENDIENTE'
                    elif p.Pedido_estado == 'EN_PROCESO_ESTAMPADO':
                        estado_display = 'EN_PROCESO'

                data.append({
                    "Pedido_ID": p.Pedido_ID,
                    "Usuario": p.Usuario_id,
                    "usuario": getattr(p.Usuario, "email", None),
                    "Pedido_fecha": p.Pedido_fecha,
                    "Pedido_estado": estado_display,
                    "Pedido_estado_real": p.Pedido_estado,  # Estado real para las acciones
                    "total_pedido": total_pedido,
                    "detalles": detalles,
                    "requiere_estampado": p.requiere_estampado(),
                    "puede_trasladar_estampado": p.puede_ser_trasladado_a_estampado(),
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
            # 🔥 CAMBIO: Los pedidos van directo al costurero con estado específico
            estado = 'PENDIENTE_COSTURERO'  # Estado específico para el flujo del costurero

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

            # 🔹 2️⃣ Si todo bien, crear el pedido directamente para costurero
            pedido = Pedido.objects.create(
                Usuario=usuario,
                Pedido_fecha=timezone.now().date(),
                Pedido_estado=estado  # PENDIENTE_COSTURERO = va directo al costurero
            )

            total_pedido = 0.0
            from clasificaciones.models import Talle

            for item in prendas:
                prenda_id = item.get("id_prenda")
                cantidad = int(item.get("cantidad", 0))
                tipo = item.get("tipo", "LISA").upper()
                if tipo not in ['LISA', 'ESTAMPADA']:
                    tipo = 'LISA'
                talle_codigo = item.get("talle")

                prenda = Prenda.objects.get(pk=prenda_id)

                talle = None
                if talle_codigo:
                    try:
                        talle = Talle.objects.get(Talle_codigo=talle_codigo)
                    except Talle.DoesNotExist:
                        pass

                # Crear detalle
                detalle = DetallePedido.objects.create(
                    pedido=pedido,
                    prenda=prenda,
                    cantidad=cantidad,
                    tipo=tipo,
                    talle=talle,
                    marca=prenda.Prenda_marca,
                    modelo=prenda.Prenda_modelo,
                    color=prenda.Prenda_color,
                )

                # Calcular precio
                precio_unitario = detalle.calcular_precio_unitario()
                precio_total = precio_unitario * cantidad
                precio_con_ganancia = precio_total * (1 + porcentaje_ganancia / 100)

                detalle.precio_unitario = precio_unitario
                detalle.precio_total = precio_con_ganancia
                detalle.save()

                total_pedido += precio_con_ganancia

                # 🔥 3️⃣ Descontar stock de insumos
                for rel in InsumosXPrendas.objects.filter(prenda=prenda):
                    cantidad_necesaria = rel.Insumo_prenda_cantidad_utilizada * cantidad
                    rel.insumo.Insumo_cantidad -= cantidad_necesaria
                    rel.insumo.save()

            return Response({
                "message": "Pedido creado exitosamente",
                "pedido_id": pedido.Pedido_ID,
                "total": round(total_pedido, 2),
                "estado": pedido.Pedido_estado
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PedidoDetail(APIView):
    """
    API: Obtener, actualizar o eliminar un pedido específico desde React.
    """
    
    def get(self, request, pk):
        try:
            # Buscar el pedido con relaciones precargadas
            pedido = Pedido.objects.prefetch_related(
                'detalles', 
                'detalles__prenda',
                'detalles__talle',
                'detalles__color',
                'detalles__modelo',
                'detalles__marca',
            ).get(pk=pk)
            
            # Serializar detalles
            detalles = []
            for d in pedido.detalles.all():
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
                    "tipo": d.tipo,
                    "talle": str(getattr(d.talle, "Talle_codigo", "-")),
                    "precio_unitario": round(d.precio_unitario or 0, 2),
                    "precio_total": subtotal,
                })
            
            # Calcular total del pedido
            total_pedido = round(sum(d["precio_total"] for d in detalles), 2)
            
            # Estructurar respuesta
            data = {
                "Pedido_ID": pedido.Pedido_ID,
                "Usuario": pedido.Usuario_id,
                "usuario": getattr(pedido.Usuario, "email", None),
                "Pedido_fecha": pedido.Pedido_fecha,
                "Pedido_estado": pedido.Pedido_estado,
                "total_pedido": total_pedido,
                "detalles": detalles,
            }
            
            return Response(data, status=status.HTTP_200_OK)

        except Pedido.DoesNotExist:
            return Response({'error': 'Pedido no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        """Actualizar solo ciertos campos del pedido (ej: estado)"""
        try:
            pedido = Pedido.objects.get(pk=pk)
            
            # Solo actualizar campos permitidos
            nuevo_estado = request.data.get('Pedido_estado')
            if nuevo_estado:
                pedido.Pedido_estado = nuevo_estado
                pedido.save()
                
                return Response({
                    "message": f"Estado actualizado a {nuevo_estado}",
                    "estado": pedido.Pedido_estado
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No se especificó un nuevo estado"}, status=status.HTTP_400_BAD_REQUEST)
                
        except Pedido.DoesNotExist:
            return Response({'error': 'Pedido no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        """Eliminar un pedido"""
        try:
            pedido = Pedido.objects.get(pk=pk)
            pedido.delete()
            return Response({'message': 'Pedido eliminado exitosamente'}, status=status.HTTP_200_OK)
        except Pedido.DoesNotExist:
            return Response({'error': 'Pedido no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# =====================================================
# 🔥 NUEVAS VISTAS PARA COSTURERO Y ESTAMPADOR - SIN JWT
# =====================================================

@api_view(['POST'])
def aceptar_pedido_costurero(request, pedido_id):
    """Costurero acepta un pedido"""
    try:
        pedido = get_object_or_404(Pedido, pk=pedido_id)
        
        if pedido.Pedido_estado != 'PENDIENTE_COSTURERO':
            return Response({
                "error": "El pedido no está en estado válido para ser aceptado por costurero"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        pedido.Pedido_estado = 'EN_PROCESO_COSTURERO'
        
        # 🔥 SOLUCIÓN SIN JWT: Manejar usuario autenticado o anónimo
        if request.user.is_authenticated:
            # Verificar que el usuario tenga rol de costurero
            user_roles = [group.name for group in request.user.groups.all()]
            if 'Costurero' in user_roles:
                pedido.costurero_asignado = request.user
                print(f"✅ Pedido {pedido_id} aceptado por costurero: {request.user.username}")
            else:
                print(f"⚠️ Usuario {request.user.username} no tiene rol de costurero")
                pedido.costurero_asignado = None
        else:
            # Usuario no autenticado - asignar None
            print(f"⚠️ Usuario no autenticado aceptando pedido {pedido_id}")
            pedido.costurero_asignado = None
        
        pedido.save()
        
        return Response({
            "mensaje": f"✅ Pedido aceptado por costurero {getattr(request.user, 'username', 'Anónimo')}",
            "nuevo_estado": pedido.Pedido_estado,
            "costurero": getattr(request.user, 'username', None)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def terminar_pedido_costurero(request, pedido_id):
    """Costurero termina un pedido"""
    try:
        pedido = get_object_or_404(Pedido, pk=pedido_id)
        
        if pedido.Pedido_estado != 'EN_PROCESO_COSTURERO':
            return Response({
                "error": "El pedido no está en estado válido para ser terminado por costurero"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar rol de costurero (opcional sin JWT)
        if request.user.is_authenticated:
            user_roles = [group.name for group in request.user.groups.all()]
            if 'Costurero' not in user_roles:
                return Response({
                    "error": "Solo costurer@s pueden terminar pedidos"
                }, status=status.HTTP_403_FORBIDDEN)
        
        # Si requiere estampado, va a estampado. Si no, se completa.
        if pedido.requiere_estampado():
            return Response({
                "error": "Este pedido requiere estampado. Debes usar la acción 'Enviar a Estampado'."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Si no requiere estampado, se completa.
        pedido.Pedido_estado = 'COMPLETADO'
        mensaje = f"✅ Pedido completado por costurero {getattr(request.user, 'username', 'Anónimo')}."

        pedido.save()

        print(f"✅ Pedido {pedido_id} terminado por costurero: {getattr(request.user, 'username', 'Anónimo')}")

        return Response({
            "mensaje": mensaje,
            "nuevo_estado": pedido.Pedido_estado,
            "costurero": getattr(request.user, 'username', None)
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def trasladar_pedido_estampado(request, pedido_id):
    """Costurero traslada un pedido a estampado"""
    try:
        pedido = get_object_or_404(Pedido, pk=pedido_id)
        
        # Verificar que el usuario es costurero (opcional sin JWT)
        if request.user.is_authenticated:
            user_roles = [group.name for group in request.user.groups.all()]
            if 'Costurero' not in user_roles:
                return Response({
                    "error": "Solo costurer@s pueden trasladar pedidos a estampado"
                }, status=status.HTTP_403_FORBIDDEN)
        
        if not pedido.puede_ser_trasladado_a_estampado():
            return Response({
                "error": "El pedido no puede ser trasladado a estampado"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        pedido.Pedido_estado = 'PENDIENTE_ESTAMPADO'
        pedido.save()
        
        print(f"✅ Pedido {pedido_id} trasladado a estampado por: {getattr(request.user, 'username', 'Anónimo')}")
        
        return Response({
            "mensaje": f"✅ Pedido trasladado a estampado por {getattr(request.user, 'username', 'Anónimo')}",
            "nuevo_estado": pedido.Pedido_estado,
            "costurero": getattr(request.user, 'username', None)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def aceptar_pedido_estampador(request, pedido_id):
    """Estampador acepta un pedido"""
    try:
        pedido = get_object_or_404(Pedido, pk=pedido_id)
        
        if pedido.Pedido_estado != 'PENDIENTE_ESTAMPADO':
            return Response({
                "error": "El pedido no está en estado válido para ser aceptado por estampador"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar que el usuario tiene rol de estampador (opcional sin JWT)
        if request.user.is_authenticated:
            user_roles = [group.name for group in request.user.groups.all()]
            if 'Estampador' not in user_roles:
                return Response({
                    "error": "Solo estampador@s pueden aceptar pedidos de estampado"
                }, status=status.HTTP_403_FORBIDDEN)
            
            pedido.estampador_asignado = request.user
        else:
            # Usuario no autenticado - asignar None
            print(f"⚠️ Usuario no autenticado aceptando pedido de estampado {pedido_id}")
            pedido.estampador_asignado = None
        
        pedido.Pedido_estado = 'EN_PROCESO_ESTAMPADO'
        pedido.save()
        
        print(f"✅ Pedido {pedido_id} aceptado por estampador: {getattr(request.user, 'username', 'Anónimo')}")
        
        return Response({
            "mensaje": f"✅ Pedido aceptado por estampador {getattr(request.user, 'username', 'Anónimo')}",
            "nuevo_estado": pedido.Pedido_estado,
            "estampador": getattr(request.user, 'username', None)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def terminar_pedido_estampador(request, pedido_id):
    """Estampador termina un pedido"""
    try:
        pedido = get_object_or_404(Pedido, pk=pedido_id)
        
        if pedido.Pedido_estado != 'EN_PROCESO_ESTAMPADO':
            return Response({
                "error": "El pedido no está en estado válido para ser terminado por estampador"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar que el usuario tiene rol de estampador (opcional sin JWT)
        if request.user.is_authenticated:
            user_roles = [group.name for group in request.user.groups.all()]
            if 'Estampador' not in user_roles:
                return Response({
                    "error": "Solo estampador@s pueden terminar pedidos de estampado"
                }, status=status.HTTP_403_FORBIDDEN)
        
        pedido.Pedido_estado = 'COMPLETADO'
        pedido.save()
        
        print(f"✅ Pedido {pedido_id} completado por estampador: {getattr(request.user, 'username', 'Anónimo')}")
        
        return Response({
            "mensaje": f"✅ Pedido completado por estampador {getattr(request.user, 'username', 'Anónimo')}",
            "nuevo_estado": pedido.Pedido_estado,
            "estampador": getattr(request.user, 'username', None)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# =====================================================
# 💻 Vistas del panel Django (uso interno / administrativo)
# =====================================================

def crear_pedido(request):
    try:
        data = request.data
        usuario_id = data.get('usuario')
        prendas = data.get('prendas', [])
        porcentaje_ganancia = float(data.get('porcentaje_ganancia', 0))
        estado = data.get('estado', 'PENDIENTE_COSTURERO')  # Van directo al costurero

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
            "mensaje": "✅ Pedido creado correctamente y enviado al costurero.",
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
    pedido.Pedido_estado = 'COMPLETADO'
    pedido.save()
    messages.success(request, '🎉 ¡Pedido realizado exitosamente!')
    return redirect('crear_pedido')