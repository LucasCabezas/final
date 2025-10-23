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
    // Usamos el campo 'estado' si existe
    const estadoRaw = pedido.estado;

    if (typeof estadoRaw === 'string') {
        return estadoRaw.toUpperCase();
    }
    return 'ESTADO DESCONOCIDO';
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
            // Se asume que el endpoint está bien: "http://localhost:8000/api/pedidos/"
            const response = await fetch(API_PEDIDOS_URL); 
            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo cargar la lista de pedidos.`);
            }
            let data = await response.json();
            
            // FILTRADO DE PEDIDOS SEGÚN EL ROL
            if (userRole === 'Costurero') {
                // El costurero ve pedidos en APROBADO_DUENO, PENDIENTE_ESTAMPADO y COMPLETADO
                data = data.filter(p => p.estado === 'APROBADO_DUENO' || p.estado === 'PENDIENTE_ESTAMPADO' || p.estado === 'COMPLETADO');
            } else if (userRole === 'Estampador') {
                // El estampador ve pedidos en PENDIENTE_ESTAMPADO y COMPLETADO
                data = data.filter(p => p.estado === 'PENDIENTE_ESTAMPADO' || p.estado === 'COMPLETADO');
            } else if (userRole === 'Dueño') {
                // El dueño ve solo los pendientes de su aprobación (PENDIENTE_DUENO) y los que ya aprobó
                data = data.filter(p => p.estado === 'PENDIENTE_DUENO' || p.estado === 'CANCELADO' || p.estado === 'APROBADO_DUENO');
            } else {
                // Si el rol es desconocido o no autorizado, no mostrar nada
                data = [];
            }

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
                    <h2 style={styles.title}>
                        Gestión y Aprobación de Pedidos
                    </h2>
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
                                        <th style={styles.th}>Descripción</th>
                                        <th style={styles.th}>Cantidad</th>
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
                                                <td style={styles.td}>PED{pedido.Pedido_ID.toString().padStart(3, '0')}</td>
                                                <td style={styles.td}>{pedido.Cliente_nombre || 'N/A'}</td>
                                                <td style={styles.td}>{pedido.Descripcion_pedido || 'N/A'}</td>
                                                <td style={styles.td}>{pedido.Cantidad_prendas || 0}</td>
                                                <td style={styles.td}>
                                                    <span style={{ ...styles.estadoBadge, ...estilo }}> 
                                                        {texto}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    {renderActions(pedido)}
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
                            <h3 style={{ marginTop: '16px', color: '#9ca3af' }}>
                                No hay pedidos para tu rol.
                            </h3>
                            <p style={{ color: '#6b7280' }}>
                                Si eres Dueño, no hay pedidos pendientes de aprobación. 
                                Si eres Costurero/Estampador, no hay pedidos en tu etapa.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AprobacionPedidos;