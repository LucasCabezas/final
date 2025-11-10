import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Componente from './componente.jsx';
import fondoImg from "./assets/fondo.png";
import { XCircle, CheckCircle, Package, Send, Play, Square, X, AlertCircle } from 'lucide-react';

const API_PEDIDOS_URL = "http://localhost:8000/api/pedidos/";

const styles = {
    container: {
        display: "flex", 
        minHeight: "100vh", 
        width: "100%",
    },
    main: (navbarWidth) => ({
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
    }),
    contentWrapper: {
        maxWidth: "1400px", 
        margin: "0 auto" 
    },
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '8px'
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
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        color: '#fbbf24',
        border: '1px solid rgba(251, 191, 36, 0.3)'
    },
    estadoEnProceso: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        color: '#3b82f6',
        border: '1px solid rgba(59, 130, 246, 0.3)'
    },
    estadoCompletado: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        color: '#22c55e',
        border: '1px solid rgba(34, 197, 94, 0.3)'
    },
    estadoCancelado: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    btnAceptar: {
        backgroundColor: '#10b981',
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
        marginRight: '8px'
    },
    btnTerminar: {
        backgroundColor: '#22c55e',
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
        marginRight: '8px'
    },
    btnEnviarEstampado: {
        backgroundColor: '#f59e0b',
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
        marginRight: '8px'
    },
    btnRechazar: {
        backgroundColor: '#ef4444',
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
        marginRight: '8px'
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
        gap: '4px'
    },
    modal: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(8px)'
    },
    modalContent: {
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '90%',
        maxHeight: '90%',
        width: '1000px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        overflowY: 'auto'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    modalTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#fff'
    },
    closeBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#9ca3af',
        cursor: 'pointer',
        fontSize: '24px',
        padding: '4px'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    infoItem: {
        color: '#d1d5db'
    },
    infoLabel: {
        fontSize: '12px',
        color: '#9ca3af',
        marginBottom: '4px',
        textTransform: 'uppercase',
        fontWeight: '600'
    },
    infoValue: {
        fontSize: '14px',
        fontWeight: '500'
    },
    alert: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 20px',
        borderRadius: '12px',
        color: '#fff',
        fontWeight: '500',
        zIndex: 1001,
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    alertSuccess: {
        backgroundColor: 'rgba(34, 197, 94, 0.9)',
        borderColor: 'rgba(34, 197, 94, 0.3)'
    },
    alertError: {
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        borderColor: 'rgba(239, 68, 68, 0.3)'
    }
};

const AprobacionPedidos = () => {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

    const navbarWidth = isNavbarCollapsed ? 70 : 250;

    // Debug para verificar que el usuario esté cargado
    console.log('Usuario en AprobacionPedidos:', user);

    const mostrarAlert = (message, type = "success") => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };
    const cargarPedidos = async () => {
        if (!user || !user.rol) {
            console.log('Usuario no disponible, esperando...');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(API_PEDIDOS_URL); // ✅ (Usando axios)
            
            const data = response.data;
            
            // El Dueño en esta vista SÓLO ve los pedidos pendientes de su aprobación
            let pedidosFiltrados = data.filter(pedido => 
                pedido.Pedido_estado === 'PENDIENTE_DUENO'
            );
            
            console.log('Pedidos filtrados:', pedidosFiltrados);
            setPedidos(pedidosFiltrados);
            // Ya no se llama a limpiarSubEstados()
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
            mostrarAlert("Error al cargar los pedidos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.rol) {
            cargarPedidos();
            const interval = setInterval(cargarPedidos, 30000);
            return () => clearInterval(interval);
        }
    }, [user?.rol]);

    const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
        try {
            // ✅ Usa PATCH (mejor para actualizar un solo campo) y la clave correcta
            const response = await axios.patch(`${API_PEDIDOS_URL}${pedidoId}/`, { 
                Pedido_estado: nuevoEstado // ✅ Clave correcta
            });
            mostrarAlert(`Pedido ${nuevoEstado.toLowerCase().replace('_', ' ')} exitosamente`);
            // ...
            cargarPedidos();
        } catch (error) {
            console.error("Error al actualizar pedido:", error);
            mostrarAlert("Error al actualizar el pedido", "error");
        }
    };

    const aceptarPedido = (pedidoId) => {
        // Al aceptar, lo aprueba y pasa a 'PENDIENTE_COSTURERO'
        // (Este estado lo recogerá el Costurero)
        actualizarEstadoPedido(pedidoId, 'PENDIENTE_COSTURERO');
    };

    const rechazarPedido = (pedidoId) => {
        actualizarEstadoPedido(pedidoId, 'CANCELADO'); //
    };

    const renderAcciones = (pedido) => {
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    style={styles.btnAceptar}
                    onClick={() => aceptarPedido(pedido.Pedido_ID)}
                >
                    <CheckCircle size={14} />
                    Aceptar
                </button>
                <button
                    style={styles.btnRechazar}
                    onClick={() => rechazarPedido(pedido.Pedido_ID)}
                >
                    <XCircle size={14} />
                    Rechazar
                </button>
                {/* ✅ Botón Ver eliminado de aquí */}
            </div>
        );
    };
    if (loading || !user) {
        return (
            <div style={styles.container}>
                <Componente 
                    onToggle={setIsNavbarCollapsed}
                />
                <div style={styles.main(navbarWidth)}>
                    <div style={styles.contentWrapper}>
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '60px 20px', 
                            color: '#9ca3af' 
                        }}>
                            <div style={{ 
                                fontSize: '18px', 
                                marginBottom: '12px' 
                            }}>
                                {!user ? 'Cargando usuario...' : 'Cargando pedidos...'}
                            </div>
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                border: '3px solid rgba(255,255,255,0.3)', 
                                borderTop: '3px solid #3b82f6', 
                                borderRadius: '50%', 
                                margin: '0 auto', 
                                animation: 'spin 1s linear infinite' 
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Componente 
                onToggle={setIsNavbarCollapsed}
            />
            <div style={styles.main(navbarWidth)}>
                <div style={styles.contentWrapper}>
                    <h1 style={styles.title}>
                        {user.rol === 'Estampador' ? 'Panel de Estampado' : 'Aprobación de Pedidos'}
                    </h1>
                    <p style={styles.subtitle}>
                        {user.rol === 'Estampador' 
                            ? 'Gestiona los pedidos enviados para estampado'
                            : 'Revisa y gestiona los pedidos pendientes de aprobación'
                        }
                    </p>

                    {pedidos.length === 0 ? (
                        <div style={{
                            ...styles.tableContainer,
                            padding: '60px 20px',
                            textAlign: 'center'
                        }}>
                            <div style={{ color: '#9ca3af', fontSize: '18px', marginBottom: '12px' }}>
                                {user.rol === 'Estampador' 
                                    ? 'No hay pedidos para estampar en este momento'
                                    : 'No hay pedidos pendientes de aprobación'
                                }
                            </div>
                            <Package size={48} style={{ color: '#6b7280', margin: '0 auto' }} />
                        </div>
                    ) : (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>ID Pedido</th>
                                        <th style={styles.th}>Estado</th>
                                        <th style={styles.th}>Fecha</th>
                                        <th style={styles.th}>Detalle</th> 
                                        <th style={styles.th}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidos.map((pedido) => (
                                        <tr key={pedido.Pedido_ID}>
                                            {/* 1. ID */}
                                            <td style={styles.td}>#{pedido.Pedido_ID}</td>

                                            {/* 2. Estado (Movido) */}
                                            <td style={styles.td}>
                                                <span style={{...styles.estadoBadge, ...styles.estadoPendiente}}>
                                                    PENDIENTE DUEÑO
                                                </span>
                                            </td>
                                            
                                            {/* 3. Fecha (Movido) */}
                                            <td style={styles.td}>
                                                {new Date(pedido.Pedido_fecha).toLocaleDateString()}
                                            </td>

                                            {/* 4. Detalle (Nuevo) */}
                                            <td style={styles.td}>
                                                <button
                                                    style={styles.btnVer} // Reutiliza el estilo del botón
                                                    onClick={() => setPedidoSeleccionado(pedido)}
                                                >
                                                    <Package size={14} />
                                                    VER DETALLES {/* ✅ Texto cambiado */}
                                                </button>
                                            </td>

                                            {/* 5. Acciones (Llama a la función ya modificada) */}
                                            <td style={styles.td}>
                                                {renderAcciones(pedido)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de detalles */}
            {pedidoSeleccionado && (
                <div style={styles.modal} onClick={() => setPedidoSeleccionado(null)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>
                                Detalles del Pedido #{pedidoSeleccionado.Pedido_ID}
                            </h2>
                            <button
                                style={styles.closeBtn}
                                onClick={() => setPedidoSeleccionado(null)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Cliente</div>
                                {/* ✅ CORREGIDO */}
                                <div style={styles.infoValue}>{pedidoSeleccionado.Usuario_nombre || "N/A"}</div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Fecha del Pedido</div>
                                <div style={styles.infoValue}>
                                    {/* ✅ CORREGIDO */}
                                    {new Date(pedidoSeleccionado.Pedido_fecha).toLocaleString()}
                                </div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Estado</div>
                                <div style={styles.infoValue}>
                                    <span style={{...styles.estadoBadge, ...styles.estadoPendiente}}>
                                        PENDIENTE DUEÑO
                                    </span>
                                </div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Total de Items</div>
                                <div style={styles.infoValue}>
                                    {pedidoSeleccionado.detalles ? pedidoSeleccionado.detalles.length : 0}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ 
                                color: '#fff', 
                                fontSize: '18px', 
                                marginBottom: '16px',
                                fontWeight: '600' 
                            }}>
                                Items del Pedido
                            </h3>
                            
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '12px' 
                            }}>
                                {pedidoSeleccionado.detalles && pedidoSeleccionado.detalles.length > 0 ? (
                                    pedidoSeleccionado.detalles.map((detalle, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "16px",
                                                padding: "16px",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                borderRadius: "12px",
                                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                            }}
                                        >
                                            <img
                                                src={detalle.prenda_imagen_url || "https://via.placeholder.com/100x100?text=Sin+Imagen"}
                                                alt={detalle.prenda_nombre || 'Prenda'}
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/100x100?text=Sin+Imagen";
                                                }}
                                            />

                                            <div style={{ flex: 1 }}>
                                                <div
                                                    style={{
                                                        color: "#fff",
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    {detalle.prenda_nombre || 'N/A'}
                                                </div>
                                                <div
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                                                        gap: "8px",
                                                        fontSize: "13px",
                                                        color: "#9ca3af",
                                                    }}
                                                >
                                                    <div>Marca: {detalle.prenda_marca || "-"}</div>
                                                    <div>Modelo: {detalle.prenda_modelo || "-"}</div>
                                                    <div>Color: {detalle.prenda_color || "-"}</div>
                                                    <div>Talle: {typeof detalle.talle === "number" ? "-" : detalle.talle?.toUpperCase() || "-"}</div>
                                                    <div>Cantidad: {detalle.cantidad || 0}</div>
                                                </div>
                                            </div>

                                            {/* Precios solo para el dueño */}
                                            {user && user.rol === 'Dueño' && detalle.precio_total !== undefined && (
                                                <div style={{ textAlign: "right", minWidth: "140px" }}>
                                                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>Subtotal</div>
                                                    <div style={{ fontSize: "14px", color: "#f59e0b", marginBottom: "4px" }}>
                                                        ${parseFloat(detalle.precio_total || 0).toFixed(2)}
                                                    </div>
                                                    
                                                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>Ganancia (25%)</div>
                                                    <div style={{ fontSize: "14px", color: "#10b981", marginBottom: "8px" }}>
                                                        ${(() => {
                                                            const subtotal = parseFloat(detalle.precio_total || 0);
                                                            const ganancia = subtotal * 0.25;
                                                            return ganancia.toFixed(2);
                                                        })()}
                                                    </div>
                                                    
                                                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>TOTAL REAL</div>
                                                    <div
                                                        style={{
                                                            fontSize: "18px",
                                                            fontWeight: "bold",
                                                            color: "#ffd70f",
                                                            marginTop: "4px",
                                                            borderTop: "1px solid rgba(255,255,255,0.2)",
                                                            paddingTop: "4px",
                                                        }}
                                                    >
                                                        ${(() => {
                                                            const subtotal = parseFloat(detalle.precio_total || 0);
                                                            const ganancia = subtotal * 0.25;
                                                            return (subtotal + ganancia).toFixed(2);
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "40px 20px",
                                            color: "#9ca3af",
                                            backgroundColor: "rgba(30,30,30,0.6)",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        <AlertCircle size={48} style={{ margin: "0 auto 12px" }} />
                                        <p>No hay detalles disponibles para este pedido</p>
                                    </div>
                                )}
                            </div>

                            {/* Total final - solo para el dueño */}
                            {user && user.rol === 'Dueño' && pedidoSeleccionado.detalles &&
                                pedidoSeleccionado.detalles.some((d) => d.precio_total) && (
                                <div
                                    style={{
                                        backgroundColor: "rgba(255, 215, 15, 0.1)",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        marginTop: "20px",
                                        border: "1px solid rgba(255, 215, 15, 0.3)",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", color: "#d1d5db", fontSize: "14px", marginBottom: "8px" }}>
                                        <span>Subtotal del Pedido:</span>
                                        <span>
                                            ${pedidoSeleccionado.detalles.reduce((acc, d) => acc + parseFloat(d.precio_total || 0), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", color: "#10b981", fontSize: "14px", marginBottom: "12px" }}>
                                        <span>Ganancia Total (25%):</span>
                                        <span>
                                            ${(() => {
                                                const subtotal = pedidoSeleccionado.detalles.reduce((acc, d) => acc + parseFloat(d.precio_total || 0), 0);
                                                return (subtotal * 0.25).toFixed(2);
                                            })()}
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "12px" }}>
                                        <div style={{ color: "#d1d5db", fontSize: "18px", fontWeight: "600" }}>TOTAL FINAL DEL PEDIDO</div>
                                        <div style={{ color: "#ffd70f", fontSize: "28px", fontWeight: "bold" }}>
                                            ${(() => {
                                                const subtotal = pedidoSeleccionado.detalles.reduce((acc, d) => acc + parseFloat(d.precio_total || 0), 0);
                                                const ganancia = subtotal * 0.25;
                                                return (subtotal + ganancia).toFixed(2);
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Alerta */}
            {alert && (
                <div style={{
                    ...styles.alert,
                    ...(alert.type === "success" ? styles.alertSuccess : styles.alertError)
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                        {alert.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <div style={{ flex: 1, fontSize: '14px', lineHeight: '1.5' }}>
                            {alert.message}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AprobacionPedidos;