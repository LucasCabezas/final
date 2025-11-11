import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Componente from './componente.jsx';
import fondoImg from "./assets/fondo.png";
import { XCircle, CheckCircle, Package, Send, Play, Square, X, AlertCircle, Search } from 'lucide-react';

const API_PEDIDOS_URL = "http://localhost:8000/api/pedidos/";

const styles = {
    // ... (Todos tus estilos (container, main, modalOverlay, alert, etc.) se mantienen 100% igual)
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
    searchContainer: {
        backgroundColor: "rgba(30, 30, 30, 0.9)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "24px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        gap: "12px",
        flexWrap: "wrap"
    },
    searchInput: { 
        flex: "1 1 200px",
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #4b5563",
        backgroundColor: "rgba(0,0,0,0.3)",
        color: "#fff",
        fontSize: "14px"
    },
    select: { 
        flex: "1 1 150px",
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #4b5563",
        backgroundColor: "rgba(0,0,0,0.3)",
        color: "#fff",
        fontSize: "14px",
        cursor: "pointer"
    },
    btnLimpiar: { 
        padding: "10px 24px",
        backgroundColor: "#6b7280",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "8px"
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
    estadoPendienteEstampado: { 
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        color: '#a855f7',
        border: '1px solid rgba(168, 85, 247, 0.3)'
    },
    estadoEnProcesoEstampado: { 
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        color: '#8b5cf6',
        border: '1px solid rgba(139, 92, 246, 0.3)'
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
        backgroundColor: '#3b82f6', 
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
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000, 
        padding: "20px",
        overflowY: "auto"
    },
    modalContent: {
        backgroundColor: "rgba(20, 20, 20, 0.98)",
        borderRadius: "16px",
        padding: "32px",
        maxWidth: "1200px", 
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        border: "1px solid rgba(255, 255, 255, 0.1)", 
        position: "relative"
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        paddingBottom: "16px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
    },
    modalTitle: {
        fontSize: "28px", 
        fontWeight: "bold",
        color: "#fff" 
    },
    btnClose: {
        background: "none",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        padding: "4px"
    },
    infoBox: {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        borderRadius: "8px",
        padding: "12px 16px",
        marginBottom: "16px"
    },
    infoLabel: {
        fontSize: "12px",
        color: "#93c5fd",
        marginBottom: "4px"
    },
    infoValue: {
        fontSize: "16px",
        color: "#fff",
        fontWeight: "600"
    },
    alert: {
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "16px 24px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
        zIndex: 3000, 
        minWidth: "350px",
        maxWidth: "500px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        whiteSpace: "pre-line"
    },
    alertSuccess: { 
        backgroundColor: "#10b981", 
        color: "#fff" 
    },
    alertError: { 
        backgroundColor: "#ef4444", 
        color: "#fff" 
    }
};

const obtenerEstiloEstado = (estado) => {
    // ... (La función se mantiene 100% igual)
    switch (estado) {
        case "PENDIENTE_DUENO":
            return { texto: "Pendiente Aprobación", estilo: styles.estadoPendiente };
        case "PENDIENTE_COSTURERO":
            return { texto: "Pendiente Costurero", estilo: { ...styles.estadoBadge, ...styles.estadoPendiente } };
        case "EN_PROCESO_COSTURERO":
            return { texto: "En Proceso Costurero", estilo: { ...styles.estadoBadge, ...styles.estadoEnProceso } };
        case "PENDIENTE_ESTAMPADO":
        case "PENDIENTE_ESTAMPADOR": 
            return { texto: "Pendiente Estampador", estilo: { ...styles.estadoBadge, ...styles.estadoPendienteEstampado } };
        case "EN_PROCESO_ESTAMPADO":
        case "EN_PROCESO_ESTAMPADOR": 
            return { texto: "En Proceso Estampador", estilo: { ...styles.estadoBadge, ...styles.estadoEnProcesoEstampado } };
        case "COMPLETADO":
            return { texto: "Completado", estilo: styles.estadoCompletado };
        case "CANCELADO":
            return { texto: "Cancelado", estilo: styles.estadoCancelado }; 
        default:
            return { texto: estado, estilo: styles.estadoPendiente };
    }
};

const AprobacionPedidos = () => {
    // ... (Toda la lógica, states, effects y funciones se mantienen 100% igual)
    const { user } = useAuth();
    const [masterPedidos, setMasterPedidos] = useState([]);
    const [pedidosMostrados, setPedidosMostrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
    
    const [filtros, setFiltros] = useState({
        id: '',
        fecha: '', 
        estado: 'PENDIENTE_DUENO' 
    });

    const navbarWidth = isNavbarCollapsed ? 70 : 250;

    console.log('Usuario en AprobacionPedidos:', user);

    const mostrarAlert = (message, type = "success") => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    const cargarPedidos = async () => {
        if (!user || !user.rol || !user.id) {
            console.log('Usuario no disponible, esperando...');
            return;
        }

        try {
            setLoading(true);
            
            const urlConCacheBuster = `${API_PEDIDOS_URL}?t=${new Date().getTime()}`;
            const response = await axios.get(urlConCacheBuster);
            const data = response.data;
            
            let pedidosDeVendedores = data.filter(pedido => 
                pedido.Usuario !== user.id 
            );
            
            console.log('Pedidos cargados (master list vendedores):', pedidosDeVendedores);
            setMasterPedidos(pedidosDeVendedores);

        } catch (error) {
            console.error("Error al cargar pedidos:", error);
            mostrarAlert("Error al cargar los pedidos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.rol && user.id) {
            cargarPedidos();
            const interval = setInterval(cargarPedidos, 30000); 
            return () => clearInterval(interval);
        }
    }, [user?.rol, user?.id]);

    useEffect(() => {
        let pedidosFiltrados = [...masterPedidos];

        if (filtros.id) {
            pedidosFiltrados = pedidosFiltrados.filter(p => 
                String(p.Pedido_ID).includes(filtros.id)
            );
        }
        
        if (filtros.fecha) {
            pedidosFiltrados = pedidosFiltrados.filter(p => 
                p.Pedido_fecha && p.Pedido_fecha.startsWith(filtros.fecha)
            );
        }
        
        if (filtros.estado !== 'TODOS') {
            pedidosFiltrados = pedidosFiltrados.filter(p => p.Pedido_estado === filtros.estado);
        }
        
        setPedidosMostrados(pedidosFiltrados);
    }, [filtros, masterPedidos]);

    const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
        try {
            const response = await axios.patch(`${API_PEDIDOS_URL}${pedidoId}/`, { 
                Pedido_estado: nuevoEstado
            });
            mostrarAlert(`Pedido ${nuevoEstado.toLowerCase().replace('_', ' ')} exitosamente`);

            setMasterPedidos(prevMasterList => {
                if (nuevoEstado === 'CANCELADO') {
                    return prevMasterList.filter(p => p.Pedido_ID !== pedidoId);
                }
                return prevMasterList.map(pedido => {
                    if (pedido.Pedido_ID === pedidoId) {
                        return { ...pedido, Pedido_estado: nuevoEstado };
                    }
                    return pedido;
                });
            });
            
        } catch (error) {
            console.error("Error al actualizar pedido:", error);
            mostrarAlert("Error al actualizar el pedido", "error");
        }
    };

    const aceptarPedido = (pedidoId) => {
        actualizarEstadoPedido(pedidoId, 'PENDIENTE_COSTURERO');
    };

    const rechazarPedido = (pedidoId) => {
        if (!window.confirm("¿Estás seguro de rechazar este pedido? Esta acción lo marcará como CANCELADO.")) return;
        actualizarEstadoPedido(pedidoId, 'CANCELADO');
    };

    const renderAcciones = (pedido) => {
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    style={styles.btnAceptar}
                    onClick={() => aceptarPedido(pedido.Pedido_ID)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                    <CheckCircle size={14} />
                    Aceptar
                </button>
                <button
                    style={styles.btnRechazar}
                    onClick={() => rechazarPedido(pedido.Pedido_ID)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                >
                    <XCircle size={14} />
                    Rechazar
                </button>
            </div>
        );
    };
    
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const limpiarFiltros = () => {
        setFiltros({
            id: '',
            fecha: '', 
            estado: 'PENDIENTE_DUENO' 
        });
    };


    if (loading || !user) {
        // ... (Tu JSX de "Cargando..." se mantiene 100% igual)
        return (
            <>
                <div style={styles.container}>
                    <Componente 
                        onToggle={setIsNavbarCollapsed}
                    />
                    <div style={styles.main(navbarWidth)}>
                        <div style={styles.contentWrapper}>
                            { /* ... (loading spinner) ... */ }
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div style={styles.container}>
                <Componente 
                    onToggle={setIsNavbarCollapsed}
                />
                <div style={styles.main(navbarWidth)}>
                    <div style={styles.contentWrapper}>
                        <h1 style={styles.title}>
                            Gestión de Pedidos (Vendedores)
                        </h1>
                        <p style={styles.subtitle}>
                            Revisa y gestiona todos los pedidos generados por vendedores.
                        </p>

                        <div style={styles.searchContainer}>
                            <input
                                type="text"
                                name="id"
                                placeholder="Buscar por ID..."
                                value={filtros.id}
                                onChange={handleFiltroChange}
                                style={styles.searchInput}
                            />
                            <select
                                name="estado"
                                value={filtros.estado}
                                onChange={handleFiltroChange}
                                style={styles.select}
                            >
                                <option value="TODOS">Todos los Estados</option>
                                <option value="PENDIENTE_DUENO">Pendientes de Aprobación</option>
                                <option value="PENDIENTE_COSTURERO">Pendiente Costurero</option>
                                <option value="EN_PROCESO_COSTURERO">En Proceso Costurero</option>
                                <option value="PENDIENTE_ESTAMPADO">Pendiente Estampador</option>
                                <option value="EN_PROCESO_ESTAMPADO">En Proceso Estampador</option>
                                <option value="COMPLETADO">Completado</option>
                                <option value="CANCELADO">Cancelado</option>
                            </select>
                            <input
                                type="date"
                                name="fecha"
                                value={filtros.fecha}
                                onChange={handleFiltroChange}
                                style={{...styles.searchInput, colorScheme: 'dark'}} 
                            />
                            <button style={styles.btnLimpiar} onClick={limpiarFiltros}>
                                <X size={18} /> Limpiar
                            </button>
                        </div>

                        {pedidosMostrados.length === 0 ? (
                            <div style={{
                                ...styles.tableContainer,
                                padding: '60px 20px',
                                textAlign: 'center'
                            }}>
                                <div style={{ color: '#9ca3af', fontSize: '18px', marginBottom: '12px' }}>
                                    {masterPedidos.length > 0 ? 
                                        'No se encontraron pedidos con esos filtros' : 
                                        'No hay pedidos de vendedores'
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
                                        {pedidosMostrados.map((pedido) => {
                                            const { texto, estilo } = obtenerEstiloEstado(pedido.Pedido_estado);
                                            
                                            return (
                                                <tr key={pedido.Pedido_ID}>
                                                    <td style={styles.td}>#{pedido.Pedido_ID}</td>
                                                    
                                                    <td style={styles.td}>
                                                        <span style={{...styles.estadoBadge, ...estilo}}>
                                                            {texto}
                                                        </span>
                                                    </td>
                                                    <td style={styles.td}>
                                                        {new Date(pedido.Pedido_fecha).toLocaleDateString()}
                                                    </td>
                                                    <td style={styles.td}>
                                                        <button
                                                            style={styles.btnVer}
                                                            onClick={() => setPedidoSeleccionado(pedido)}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                                        >
                                                            <Package size={14} />
                                                            VER DETALLES
                                                        </button>
                                                    </td>
                                                    <td style={styles.td}>
                                                        {pedido.Pedido_estado === 'PENDIENTE_DUENO' ? 
                                                            renderAcciones(pedido) : 
                                                            (
                                                                <span style={{color: '#9ca3af', fontSize: '12px'}}>
                                                                    (Gestionado)
                                                                </span>
                                                            )
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal de detalles */}
                {pedidoSeleccionado && (
                    <div style={styles.modalOverlay} onClick={() => setPedidoSeleccionado(null)}>
                        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            
                            {/* Header del Modal */}
                            <div style={styles.modalHeader}>
                                <h2 style={styles.modalTitle}>
                                    Detalles del Pedido #{pedidoSeleccionado.Pedido_ID}
                                </h2>
                                <button
                                    style={styles.btnClose}
                                    onClick={() => setPedidoSeleccionado(null)}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* InfoBox para el Usuario */}
                            <div style={styles.infoBox}>
                            <div style={styles.infoLabel}>Pedido realizado por (Vendedor)</div>
                            <div style={styles.infoValue}>{pedidoSeleccionado.usuario_nombre || pedidoSeleccionado.usuario || "N/A"}</div>
                            </div>

                            {/* Grilla de Estado/Fecha/Items */}
                            <div style={{ 
                                backgroundColor: "rgba(30, 30, 30, 0.6)", 
                                borderRadius: "12px", 
                                padding: "20px", 
                                marginBottom: "20px", 
                                border: "1px solid rgba(255,255,255,0.1)" 
                            }}>
                                <div style={{ 
                                    display: "grid", 
                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                                    gap: "16px" 
                                }}>
                                    <div>
                                        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Estado</div>
                                        {(() => {
                                            const { texto, estilo } = obtenerEstiloEstado(pedidoSeleccionado.Pedido_estado);
                                            return <span style={{...styles.estadoBadge, ...estilo}}>{texto}</span>;
                                        })()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Fecha</div>
                                        <div style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>
                                            {new Date(pedidoSeleccionado.Pedido_fecha).toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Total de Items</div>
                                        <div style={{ color: "#ffd70f", fontSize: "20px", fontWeight: "bold" }}>
                                            {pedidoSeleccionado.detalles?.reduce((acc, d) => acc + (d.cantidad || 0), 0) || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de Prendas */}
                            <div>
                                <h3 style={{ 
                                    color: '#fff', 
                                    fontSize: '18px', 
                                    marginBottom: '16px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <Package size={20} /> Prendas del Pedido
                                </h3>
                                <div style={{ 
                                    maxHeight: "400px", 
                                    overflowY: "auto",
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
                                                    backgroundColor: "rgba(0,0,0,0.4)", 
                                                    borderRadius: "12px",
                                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                                }}
                                            >
                                                <img
                                                    src={detalle.prenda_imagen || "https://via.placeholder.com/100x100?text=Sin+Imagen"}
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
                                                        <div>Tipo: {detalle.tipo || "LISA"}</div>
                                                        <div>Cantidad: {detalle.cantidad || 0}</div>
                                                    </div>
                                                </div>
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
                                                                const ganancia = subtotal * (pedidoSeleccionado.porcentaje_ganancia || 25) / 100;
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
                                                                const ganancia = subtotal * (pedidoSeleccionado.porcentaje_ganancia || 25) / 100;
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
                                            <span>Ganancia Total ({pedidoSeleccionado.porcentaje_ganancia || 25}%)</span>
                                            <span>
                                                ${(() => {
                                                    const subtotal = pedidoSeleccionado.detalles.reduce((acc, d) => acc + parseFloat(d.precio_total || 0), 0);
                                                    return (subtotal * (pedidoSeleccionado.porcentaje_ganancia || 25) / 100).toFixed(2);
                                                })()}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "12px" }}>
                                            <div style={{ color: "#d1d5db", fontSize: "18px", fontWeight: "600" }}>TOTAL FINAL DEL PEDIDO</div>
                                            <div style={{ color: "#ffd70f", fontSize: "28px", fontWeight: "bold" }}>
                                                ${(() => {
                                                    const subtotal = pedidoSeleccionado.detalles.reduce((acc, d) => acc + parseFloat(d.precio_total || 0), 0);
                                                    const ganancia = subtotal * (pedidoSeleccionado.porcentaje_ganancia || 25) / 100;
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
        </>
    );
}

export default AprobacionPedidos;