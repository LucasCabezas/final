// src/components/AprobacionPedidos.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Componente from './componente.jsx';
import fondoImg from "./assets/fondo.png";
import { XCircle, CheckCircle, Package } from 'lucide-react'; // Importar iconos necesarios

// =================================================================
// CONFIGURACIÓN Y ESTILOS (ADOPTADOS DE RealizarPedido.js/PedidosView)
// =================================================================

const API_PEDIDOS_URL = "http://localhost:8000/api/pedidos/"; 

// Estilos de badges (adaptados del componente RealizarPedido/PedidosView)
const styles = {
    container: { // Este estilo será el del div principal que contiene el sidebar y el main
        display: "flex", 
        minHeight: "100vh", 
        width: "100%",
    },
    main: (navbarWidth) => ({ // Estilo adaptado para la zona de contenido
        minHeight: "100vh", 
        flex: 1, 
        marginLeft: `${navbarWidth}px`, 
        width: `calc(100% - ${navbarWidth}px)`, 
        transition: "margin-left 0.3s ease",
        padding: "32px",
        backgroundImage: `url(${fondoImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        overflowY: "auto",
    }),
    contentWrapper: { // Mantener el mismo maxWidth para consistencia
        maxWidth: "1400px", 
        margin: "0 auto" 
    },
    title: { // Estilo de título más oscuro
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '8px'
    },
    subtitle: { // Estilo de subtítulo más claro
        fontSize: '16px',
        color: '#d1d5db',
        marginBottom: '32px'
    },
    tableContainer: { // Estilo para el contenedor de la tabla
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '16px',
        textAlign: 'left',
        color: '#9ca3af',
        fontSize: '13px',
        fontWeight: '600',
        textTransform: 'uppercase',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    td: {
        padding: '16px',
        color: '#fff',
        fontSize: '14px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    },
    // Estilos de badges de RealizarPedido.js
    estadoBadge: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block'
    },
    estadoPendiente: { // PENDIENTE_DUENO
        backgroundColor: '#fbbf24', // Amarillo
        color: '#000'
    },
    estadoAprobado: { // APROBADO_DUENO, PENDIENTE_COSTURA, PENDIENTE_ESTAMPADO
        backgroundColor: '#3b82f6', // Azul
        color: '#fff'
    },
    estadoCompletado: { // COMPLETADO
        backgroundColor: '#10b981', // Verde
        color: '#fff'
    },
    estadoCancelado: { // CANCELADO
        backgroundColor: '#ef4444', // Rojo
        color: '#fff'
    },
    actionsContainer: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    },
    actionButton: (type) => ({ // Botones de acción
        padding: '8px 15px',
        borderRadius: '6px', // Ligeramente más pequeños que los originales para la tabla
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        color: 'white',
        fontSize: '13px',
        transition: 'background-color 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: 
            type === 'approve' ? '#10b981' : // Verde para aprobar
            type === 'complete' ? '#3b82f6' : // Azul para completar/avanzar
            type === 'cancel' ? '#ef4444' : // Rojo para cancelar
            '#6b7280', // Gris por defecto
    }),
    emptyState: { // Estilo de estado vacío
        textAlign: 'center',
        padding: '60px 20px',
        color: '#9ca3af',
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '24px'
    }
};

// Función para obtener el estado (compatibilidad con la lógica de RealizarPedido)
const obtenerEstadoPedido = (pedido) => {
  const estadoRaw = pedido.Pedido_estado || pedido.estado || "";
  return estadoRaw.toUpperCase();
};

// Función para obtener texto y estilo del badge (adaptada de RealizarPedido.js)
const obtenerEstiloEstado = (estado) => {
    switch(estado) {
        case 'PENDIENTE_DUENO':
            return { texto: 'Pendiente Aprobación Dueño', estilo: styles.estadoPendiente };
        case 'APROBADO_DUENO':
            return { texto: 'En Costura', estilo: styles.estadoAprobado };
        case 'PENDIENTE_ESTAMPADO':
            return { texto: 'Pendiente Estampado', estilo: styles.estadoAprobado }; // Usar estilo 'Aprobado' para procesos en curso
        case 'PENDIENTE_COSTURA':
            return { texto: 'Pendiente Costura', estilo: styles.estadoAprobado };
        case 'COMPLETADO':
            return { texto: 'Completado', estilo: styles.estadoCompletado };
        case 'CANCELADO':
            return { texto: 'Cancelado', estilo: styles.estadoCancelado };
        default:
            return { texto: 'Desconocido', estilo: { backgroundColor: '#95a5a6', color: '#fff' } };
    }
};

// =================================================================
// ESTRUCTURA PRINCIPAL DEL COMPONENTE
// =================================================================

function AprobacionPedidos() {
    const { user, loading } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

    const userRole = user ? user.rol : null; 
    const navbarWidth = isNavbarCollapsed ? 70 : 250;


    // -------------------------------------------------------------
    // LÓGICA DE CARGA Y ACCIÓN (Mantenida)
    // -------------------------------------------------------------
    useEffect(() => {
        if (!user || loading) return;
        cargarPedidos();
    }, [user, loading, userRole]); 

    const cargarPedidos = async () => {
    setIsLoading(true);
    setError(null);
        try {
            const response = await fetch(API_PEDIDOS_URL);
            if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo cargar la lista de pedidos.`);
            }

            let data = await response.json();

            // ⚙️ Normalizar clave del estado (Django la envía como "Pedido_estado")
            data = data.map(p => ({
            ...p,
            estado: p.Pedido_estado?.toUpperCase() || "DESCONOCIDO"
            }));

            // 🔹 FILTRADO SEGÚN ROL
            if (userRole === "Costurero") {
            data = data.filter(
                p =>
                p.estado === "APROBADO_DUENO" ||
                p.estado === "PENDIENTE_ESTAMPADO" ||
                p.estado === "COMPLETADO"
            );
            } else if (userRole === "Estampador") {
            data = data.filter(
                p => p.estado === "PENDIENTE_ESTAMPADO" || p.estado === "COMPLETADO"
            );
            } else if (userRole === "Dueño") {
            data = data.filter(
                p =>
                p.estado === "PENDIENTE_DUENO" ||
                p.estado === "CANCELADO" ||
                p.estado === "APROBADO_DUENO"
            );
            } else {
            data = [];
            }

            console.log(`✅ Pedidos filtrados (${userRole}):`, data);
            setPedidos(data);
        } catch (err) {
            console.error("Error cargando pedidos:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
        };


    // La URL de PATCH necesita el ID al final, ajustamos la llamada fetch
    const actualizarEstadoPedido = async (pedidoId, newStatus) => {
        const confirmMsg = `¿Estás seguro de cambiar el estado del pedido #${pedidoId} a "${newStatus.replace('_', ' ')}"?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            // **AJUSTE DE URL:** Se asume que el endpoint para PATCH necesita el ID *después* de la base URL de pedidos, 
            // no después de 'DetalledePedidos' como estaba incorrectamente concatenado en el código original. 
            // Por lo tanto, se usa una URL base hipotética para la actualización:
            const UPDATE_API_URL = "http://localhost:8000/api/pedidos/";
            
            const response = await fetch(`${UPDATE_API_URL}${pedidoId}/`, {
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: newStatus }), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Error al actualizar el estado del pedido: ${response.statusText}`);
            }

            cargarPedidos(); 
        } catch (err) {
            alert(`Fallo en la actualización: ${err.message}`);
            console.error(err);
        }
    };

    const renderActions = (pedido) => {
        const currentStatus = obtenerEstadoPedido(pedido);

        if (userRole === 'Dueño' && currentStatus === 'PENDIENTE_DUENO') {
            return (
                <div style={styles.actionsContainer}>
                    <button 
                        onClick={() => actualizarEstadoPedido(pedido.Pedido_ID, 'APROBADO_DUENO')}
                        style={styles.actionButton('approve')}
                        title="Aprobar y Enviar a Costura"
                    >
                        <CheckCircle size={16} /> Aprobar
                    </button>
                    <button 
                        onClick={() => actualizarEstadoPedido(pedido.Pedido_ID, 'CANCELADO')}
                        style={styles.actionButton('cancel')}
                        title="Cancelar Pedido"
                    >
                        <XCircle size={16} /> Cancelar
                    </button>
                </div>
            );
        }
        
        if (userRole === 'Costurero' && currentStatus === 'APROBADO_DUENO') {
            return (
                <button 
                    onClick={() => actualizarEstadoPedido(pedido.Pedido_ID, 'PENDIENTE_ESTAMPADO')}
                    style={styles.actionButton('complete')}
                    title="Finalizar Costura y Enviar a Estampado"
                >
                    Finalizar Costura 
                </button>
            );
        }

        if (userRole === 'Estampador' && currentStatus === 'PENDIENTE_ESTAMPADO') {
            return (
                <button 
                    onClick={() => actualizarEstadoPedido(pedido.Pedido_ID, 'COMPLETADO')}
                    style={styles.actionButton('complete')}
                    title="Finalizar Estampado y Entregar"
                >
                    Finalizar Estampado
                </button>
            );
        }
        
        // Muestra el botón de cancelar para los Dueños en pedidos APROBADO_DUENO o para otros roles que puedan cancelar etapas anteriores si el negocio lo permite (aquí simplificamos solo las acciones de avance)
        if (userRole === 'Dueño' && currentStatus === 'APROBADO_DUENO') {
             return (
                <div style={styles.actionsContainer}>
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>En proceso de Costura</span>
                    <button 
                        onClick={() => actualizarEstadoPedido(pedido.Pedido_ID, 'CANCELADO')}
                        style={{...styles.actionButton('cancel'), padding: '4px 8px'}}
                        title="Cancelar Pedido"
                    >
                        <XCircle size={14} /> 
                    </button>
                </div>
            );
        }
        
        return <span style={{ color: '#9ca3af', fontSize: '13px' }}>Sin acción pendiente</span>;
    };

// =========================
// 🧾 Modal Detalle Pedido
// =========================
const [modalOpen, setModalOpen] = useState(false);
const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

const abrirModalDetalles = async (pedido) => {
  try {
    // Si ya tiene detalles cargados, los mostramos
    if (pedido.detalles && pedido.detalles.length > 0) {
      setPedidoSeleccionado(pedido);
      setModalOpen(true);
      return;
    }

    // Si no los tiene, los obtenemos del backend
    const res = await fetch(`${API_PEDIDOS_URL}${pedido.Pedido_ID}/`);
    if (!res.ok) throw new Error("No se pudo cargar el detalle del pedido.");
    const data = await res.json();
    setPedidoSeleccionado(data);
    setModalOpen(true);
  } catch (error) {
    console.error("❌ Error al cargar detalles:", error);
  }
};

const cerrarModal = () => {
  setModalOpen(false);
  setPedidoSeleccionado(null);
};

    
    if (isLoading) {
        return (
            <div style={{...styles.container, justifyContent: 'center', alignItems: 'center'}}>
                <div style={{ color: 'white', padding: '50px', fontSize: '20px' }}>Cargando pedidos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{...styles.container, justifyContent: 'center', alignItems: 'center'}}>
                <div style={{ color: '#ef4444', padding: '50px', fontSize: '16px' }}>Error al cargar los pedidos: {error}</div>
            </div>
        );
    }

    return (
  <div style={styles.container}>
    <Componente onToggle={setIsNavbarCollapsed} />
    <main style={styles.main(navbarWidth)}>
      <div style={styles.contentWrapper}>
        <h2 style={styles.title}>Gestión y Aprobación de Pedidos</h2>
        <p style={styles.subtitle}>
          {userRole}: Vista de los pedidos pendientes de tu acción o seguimiento.
        </p>

        {pedidos.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
  <thead>
    <tr>
      <th style={styles.th}>ID</th>
      <th style={styles.th}>Cliente</th>
      <th style={styles.th}>Estado Actual</th>
      <th style={styles.th}>Acción</th>
    </tr>
  </thead>
  <tbody>
    {pedidos.map((pedido) => {
      const estado = obtenerEstadoPedido(pedido);
      const { texto, estilo } = obtenerEstiloEstado(estado);

      return (
        <tr key={pedido.Pedido_ID}>
          <td style={styles.td}>
            PED{pedido.Pedido_ID.toString().padStart(3, "0")}
          </td>
          <td style={styles.td}>{pedido.Cliente_nombre || "N/A"}</td>
          <td style={styles.td}>
            <span style={{ ...styles.estadoBadge, ...estilo }}>
              {texto}
            </span>
          </td>
          <td style={styles.td}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                alignItems: "flex-start",
              }}
            >
              {renderActions(pedido)}
              <button
                onClick={() => abrirModalDetalles(pedido)}
                style={{
                  ...styles.actionButton("detail"),
                  backgroundColor: "#6b7280",
                  fontSize: "12px",
                  padding: "6px 10px",
                }}
              >
                Ver Detalle
              </button>
            </div>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <Package size={64} color="#4b5563" />
            <h3 style={{ marginTop: "16px", color: "#9ca3af" }}>
              No hay pedidos para tu rol.
            </h3>
            <p style={{ color: "#6b7280" }}>
              Si eres Dueño, no hay pedidos pendientes de aprobación. Si eres
              Costurero/Estampador, no hay pedidos en tu etapa.
            </p>
          </div>
        )}
      </div>
    </main>

    {/* ====================== 🧾 MODAL DETALLES DEL PEDIDO ====================== */}
    {modalOpen && pedidoSeleccionado && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={cerrarModal}
      >
        <div
          style={{
            backgroundColor: "rgba(30,30,30,0.95)",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "700px",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>
              Detalles del Pedido #{pedidoSeleccionado.Pedido_ID}
            </h2>
            <button
              onClick={cerrarModal}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          <div>
            {pedidoSeleccionado.detalles &&
            pedidoSeleccionado.detalles.length > 0 ? (
              pedidoSeleccionado.detalles.map((d, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  {d.prenda_imagen && (
                    <img
                      src={`http://localhost:8000${d.prenda_imagen}`}
                      alt="prenda"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "6px",
                        marginRight: "12px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "bold", fontSize: "15px" }}>
                      {d.prenda_nombre}
                    </div>
                    <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                      Talle: {d.talle} | Cantidad: {d.cantidad}
                    </div>
                    <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                      Tipo: {d.tipo} | Color: {d.prenda_color} | Modelo:{" "}
                      {d.prenda_modelo}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      fontWeight: "600",
                      minWidth: "80px",
                    }}
                  >
                    ${d.precio_total.toLocaleString("es-AR")}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#9ca3af" }}>No hay detalles disponibles.</p>
            )}
          </div>

          <div
            style={{
              marginTop: "20px",
              textAlign: "right",
              fontWeight: "bold",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "10px",
            }}
          >
            Total del pedido: $
            {pedidoSeleccionado.total_pedido?.toLocaleString("es-AR")}
          </div>
        </div>
      </div>
    )}
  </div>
);

}

export default AprobacionPedidos;