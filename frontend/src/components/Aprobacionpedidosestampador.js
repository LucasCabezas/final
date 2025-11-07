import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Componente from './componente.jsx';
import fondoImg from "./assets/fondo.png";
import { CheckCircle, Package, PlayCircle, StopCircle, AlertCircle, Clock, Palette } from 'lucide-react';

const API_PEDIDOS_URL = "http://localhost:8000/api/pedidos/";

const AprobacionPedidosEstampador = () => {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [alert, setAlert] = useState(null);
    const [navbarWidth, setNavbarWidth] = useState(250);

    // 🔥 HANDLE NAVBAR TOGGLE
    const handleNavbarToggle = (collapsed) => {
        setNavbarWidth(collapsed ? 70 : 250);
    };

    // Cargar pedidos del estampador
    const cargarPedidos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_PEDIDOS_URL}?usuario_tipo=estampador`);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            setPedidos(data);
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
            mostrarAlerta("Error al cargar pedidos: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            cargarPedidos();
        }
    }, [user]);

    const mostrarAlerta = (mensaje, tipo = "info") => {
        setAlert({ mensaje, tipo });
        setTimeout(() => setAlert(null), 5000);
    };

    const realizarAccion = async (pedidoId, accion) => {
        try {
            const endpoint = `${API_PEDIDOS_URL}${pedidoId}/${accion}/`;
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}`);
            }

            const data = await response.json();
            mostrarAlerta(data.mensaje, "success");
            cargarPedidos(); // Recargar pedidos
            
        } catch (error) {
            console.error(`Error en acción ${accion}:`, error);
            mostrarAlerta(`Error: ${error.message}`, "error");
        }
    };

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const abrirDetalles = (pedido) => {
        setSelectedPedido(pedido);
    };

    const cerrarDetalles = () => {
        setSelectedPedido(null);
    };

    // Filtrar solo las prendas estampadas para mostrar
    const obtenerPrendasEstampadas = (detalles) => {
        return detalles.filter(detalle => detalle.tipo === "ESTAMPADA");
    };

    // 🎨 ESTILOS SIGUIENDO EL PATRÓN DE APROBACIONPEDIDOS
    const styles = {
        container: {
            display: "flex", 
            minHeight: "100vh", 
            width: "100%",
        },
        main: {
            minHeight: "100vh", 
            flex: 1, 
            marginLeft: `${navbarWidth}px`, 
            width: `calc(100% - ${navbarWidth}px)`, 
            transition: "margin-left 0.3s ease, width 0.3s ease",
            padding: "32px",
            backgroundImage: `url(${fondoImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            overflowY: "auto",
        },
        contentWrapper: {
            maxWidth: "1400px", 
            margin: "0 auto" 
        },
        title: {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        subtitle: {
            fontSize: '16px',
            color: '#d1d5db',
            marginBottom: '32px'
        },
        tableContainer: {
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        th: {
            padding: '16px',
            textAlign: 'left',
            color: '#9ca3af',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
        },
        td: {
            padding: '16px',
            color: '#fff',
            fontSize: '14px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        },
        estadoBadge: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase'
        },
        estadoPendiente: {
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            color: '#a855f7',
            border: '1px solid rgba(168, 85, 247, 0.3)'
        },
        estadoEnProceso: {
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            color: '#8b5cf6',
            border: '1px solid rgba(139, 92, 246, 0.3)'
        },
        estadoCompletado: {
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            color: '#22c55e',
            border: '1px solid rgba(34, 197, 94, 0.3)'
        },
        btnAceptar: {
            backgroundColor: '#a855f7',
            color: '#fff',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginRight: '8px',
            transition: 'all 0.3s ease'
        },
        btnTerminar: {
            backgroundColor: '#8b5cf6',
            color: '#fff',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginRight: '8px',
            transition: 'all 0.3s ease'
        },
        btnVer: {
            backgroundColor: '#6366f1',
            color: '#fff',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.3s ease'
        },
        estampadoCounter: {
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            color: '#a855f7',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        alertContainer: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            maxWidth: '400px'
        },
        alert: (tipo) => ({
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideInFromRight 0.3s ease',
            backgroundColor: tipo === "success" ? 'rgba(34, 197, 94, 0.1)' : 
                           tipo === "error" ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            border: `1px solid ${tipo === "success" ? 'rgba(34, 197, 94, 0.3)' : 
                                tipo === "error" ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
            color: tipo === "success" ? '#22c55e' : 
                   tipo === "error" ? '#ef4444' : '#3b82f6'
        }),
        emptyState: {
            textAlign: 'center',
            padding: '80px 20px',
            color: '#9ca3af'
        },
        emptyStateIcon: {
            fontSize: '64px',
            marginBottom: '16px',
            opacity: 0.5
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '80px',
            color: '#9ca3af'
        },
        // Modal styles
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        modalContent: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        modalHeader: {
            padding: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        modalTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        modalCloseBtn: {
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '24px',
            cursor: 'pointer'
        },
        modalBody: {
            padding: '24px'
        },
        modalInfo: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
        },
        modalInfoItem: {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '12px',
            borderRadius: '8px'
        },
        modalInfoLabel: {
            fontSize: '12px',
            color: '#9ca3af',
            fontWeight: '600',
            textTransform: 'uppercase',
            marginBottom: '4px'
        },
        modalInfoValue: {
            fontSize: '14px',
            color: '#fff',
            fontWeight: '500'
        },
        estampadoSection: {
            backgroundColor: 'rgba(168, 85, 247, 0.05)',
            border: '2px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
        },
        estampadoSectionTitle: {
            color: '#a855f7',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <Componente onToggle={handleNavbarToggle} />
                <div style={styles.main}>
                    <div style={styles.contentWrapper}>
                        <div style={styles.loadingContainer}>
                            <Clock size={48} style={{ marginRight: '12px' }} />
                            Cargando pedidos...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Componente onToggle={handleNavbarToggle} />
            <div style={styles.main}>
                <div style={styles.contentWrapper}>
                    <h1 style={styles.title}>
                        <Palette size={36} />
                        Gestión de Estampado
                    </h1>
                    <p style={styles.subtitle}>
                        Administra tus pedidos de estampado: acepta, procesa y completa trabajos artísticos
                    </p>

                    {pedidos.length === 0 ? (
                        <div style={styles.tableContainer}>
                            <div style={styles.emptyState}>
                                <Palette style={styles.emptyStateIcon} />
                                <h3>No hay pedidos de estampado</h3>
                                <p>No tienes pedidos de estampado por procesar en este momento.</p>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>ID</th>
                                        <th style={styles.th}>Cliente</th>
                                        <th style={styles.th}>Fecha</th>
                                        <th style={styles.th}>Estado</th>
                                        <th style={styles.th}>Prendas a Estampar</th>
                                        <th style={styles.th}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidos.map((pedido) => (
                                        <tr key={pedido.Pedido_ID}>
                                            <td style={styles.td}>#{pedido.Pedido_ID}</td>
                                            <td style={styles.td}>{pedido.usuario || "N/A"}</td>
                                            <td style={styles.td}>{formatearFecha(pedido.Pedido_fecha)}</td>
                                            <td style={styles.td}>
                                                <span style={{
                                                    ...styles.estadoBadge,
                                                    ...(pedido.Pedido_estado === "PENDIENTE" ? styles.estadoPendiente :
                                                        pedido.Pedido_estado === "EN_PROCESO" ? styles.estadoEnProceso :
                                                        styles.estadoCompletado)
                                                }}>
                                                    {pedido.Pedido_estado}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.estampadoCounter}>
                                                    <Palette size={16} />
                                                    {obtenerPrendasEstampadas(pedido.detalles).length} prendas
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <button
                                                        style={styles.btnVer}
                                                        onClick={() => abrirDetalles(pedido)}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#5855eb'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#6366f1'}
                                                    >
                                                        <Package size={14} />
                                                        Ver
                                                    </button>
                                                    
                                                    {pedido.Pedido_estado === "PENDIENTE" && (
                                                        <button
                                                            style={styles.btnAceptar}
                                                            onClick={() => realizarAccion(pedido.Pedido_ID, "aceptar-estampador")}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#9333ea'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#a855f7'}
                                                        >
                                                            <CheckCircle size={14} />
                                                            Aceptar
                                                        </button>
                                                    )}

                                                    {pedido.Pedido_estado === "EN_PROCESO" && (
                                                        <button
                                                            style={styles.btnTerminar}
                                                            onClick={() => realizarAccion(pedido.Pedido_ID, "terminar-estampador")}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
                                                        >
                                                            <StopCircle size={14} />
                                                            Terminar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Alertas */}
            {alert && (
                <div style={styles.alertContainer}>
                    <div style={styles.alert(alert.tipo)}>
                        <AlertCircle size={20} />
                        {alert.mensaje}
                    </div>
                </div>
            )}

            {/* Modal de detalles */}
            {selectedPedido && (
                <div style={styles.modal} onClick={cerrarDetalles}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                <Palette size={24} />
                                Detalles del Pedido #{selectedPedido.Pedido_ID}
                            </h3>
                            <button
                                style={styles.modalCloseBtn}
                                onClick={cerrarDetalles}
                            >
                                ×
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.modalInfo}>
                                <div style={styles.modalInfoItem}>
                                    <div style={styles.modalInfoLabel}>Cliente</div>
                                    <div style={styles.modalInfoValue}>{selectedPedido.usuario}</div>
                                </div>
                                <div style={styles.modalInfoItem}>
                                    <div style={styles.modalInfoLabel}>Fecha</div>
                                    <div style={styles.modalInfoValue}>{formatearFecha(selectedPedido.Pedido_fecha)}</div>
                                </div>
                                <div style={styles.modalInfoItem}>
                                    <div style={styles.modalInfoLabel}>Estado</div>
                                    <div style={styles.modalInfoValue}>
                                        <span style={{
                                            ...styles.estadoBadge,
                                            ...(selectedPedido.Pedido_estado === "PENDIENTE" ? styles.estadoPendiente :
                                                selectedPedido.Pedido_estado === "EN_PROCESO" ? styles.estadoEnProceso :
                                                styles.estadoCompletado)
                                        }}>
                                            {selectedPedido.Pedido_estado}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sección destacada para prendas a estampar */}
                            {obtenerPrendasEstampadas(selectedPedido.detalles).length > 0 && (
                                <div style={styles.estampadoSection}>
                                    <h4 style={styles.estampadoSectionTitle}>
                                        <Palette size={20} />
                                        Prendas para Estampado
                                    </h4>
                                    <div style={styles.tableContainer}>
                                        <table style={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th style={styles.th}>Prenda</th>
                                                    <th style={styles.th}>Marca</th>
                                                    <th style={styles.th}>Modelo</th>
                                                    <th style={styles.th}>Color</th>
                                                    <th style={styles.th}>Talle</th>
                                                    <th style={styles.th}>Cantidad</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {obtenerPrendasEstampadas(selectedPedido.detalles).map((detalle, index) => (
                                                    <tr key={index}>
                                                        <td style={styles.td}>{detalle.prenda_nombre}</td>
                                                        <td style={styles.td}>{detalle.prenda_marca}</td>
                                                        <td style={styles.td}>{detalle.prenda_modelo}</td>
                                                        <td style={styles.td}>{detalle.prenda_color}</td>
                                                        <td style={styles.td}>{detalle.talle}</td>
                                                        <td style={styles.td}>
                                                            <span style={{
                                                                fontWeight: "bold",
                                                                color: "#a855f7",
                                                                fontSize: "16px"
                                                            }}>
                                                                {detalle.cantidad}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <h4 style={{ color: '#fff', marginBottom: '16px' }}>Todos los Productos del Pedido:</h4>
                            <div style={styles.tableContainer}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Prenda</th>
                                            <th style={styles.th}>Marca</th>
                                            <th style={styles.th}>Modelo</th>
                                            <th style={styles.th}>Color</th>
                                            <th style={styles.th}>Talle</th>
                                            <th style={styles.th}>Tipo</th>
                                            <th style={styles.th}>Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPedido.detalles.map((detalle, index) => {
                                            const esEstampada = detalle.tipo === "ESTAMPADA";
                                            return (
                                                <tr key={index} style={esEstampada ? { backgroundColor: 'rgba(168, 85, 247, 0.1)' } : {}}>
                                                    <td style={styles.td}>{detalle.prenda_nombre}</td>
                                                    <td style={styles.td}>{detalle.prenda_marca}</td>
                                                    <td style={styles.td}>{detalle.prenda_modelo}</td>
                                                    <td style={styles.td}>{detalle.prenda_color}</td>
                                                    <td style={styles.td}>{detalle.talle}</td>
                                                    <td style={styles.td}>
                                                        <span style={{
                                                            padding: '2px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '11px',
                                                            fontWeight: '600',
                                                            backgroundColor: esEstampada ? 'rgba(168, 85, 247, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                                                            color: esEstampada ? '#a855f7' : '#6b7280',
                                                            border: `1px solid ${esEstampada ? 'rgba(168, 85, 247, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}>
                                                            {esEstampada && <Palette size={12} />}
                                                            {detalle.tipo}
                                                        </span>
                                                    </td>
                                                    <td style={styles.td}>{detalle.cantidad}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                @keyframes slideInFromRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                `}
            </style>
        </div>
    );
};

export default AprobacionPedidosEstampador;