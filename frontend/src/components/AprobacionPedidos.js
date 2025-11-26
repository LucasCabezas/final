import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Componente from './componente.jsx';
import fondoImg from "./assets/fondo.png";
import { XCircle, CheckCircle, Package, Trash2, X, AlertCircle } from 'lucide-react';

// 🔥 CORRECCIÓN: Definir la URL de la API aquí
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
        transition: 'all 0.2s',
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
        transition: 'all 0.2s',
    },
    btnEliminar: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#ef4444',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: '500',
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
    },
    // Nuevos estilos para el modal de confirmación
    confirmModalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
    },
    confirmModalContent: {
        backgroundColor: "rgba(30, 30, 30, 0.98)",
        borderRadius: "16px",
        padding: "32px",
        maxWidth: "450px",
        width: "90%",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
        border: "1px solid rgba(255, 215, 15, 0.3)",
        textAlign: "center"
    },
    confirmTitle: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#ef4444",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
    },
    confirmMessage: {
        fontSize: "16px",
        color: "#d1d5db",
        marginBottom: "24px"
    },
    confirmActions: {
        display: "flex",
        justifyContent: "space-between",
        gap: "16px"
    },
    btnConfirmYes: {
        flex: 1,
        padding: "10px 20px",
        backgroundColor: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s"
    },
    btnConfirmNo: {
        flex: 1,
        padding: "10px 20px",
        backgroundColor: "#4b5563",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s"
    },
    // 🔥 Estilos para el desglose de totales (copiado de RealizarPedido.js)
    resultadoContainer: {
        backgroundColor: "rgba(30, 30, 30, 0.8)",
        borderRadius: "12px",
        padding: "24px",
        marginTop: "20px",
        border: "1px solid rgba(255, 215, 15, 0.3)"
    },
    resultadoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "20px"
    },
    resultadoItem: {
        backgroundColor: "rgba(0,0,0,0.3)",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.05)",
        color: "#fff",
        textAlign: "center"
    },
    resultadoLabel: {
        fontSize: "12px",
        color: "#9ca3af",
        marginBottom: "4px"
    },
    resultadoValue: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#ffd70f"
    },
};

// Función de utilidad para formatear la fecha sin desfase de zona horaria (mantenida de RealizarPedido.js)
const formatDateForDisplay = (dateString) => {
    if (!dateString) return "-";
    
    // El backend envía 'YYYY-MM-DD'. Creamos la fecha para evitar conversiones implícitas de zona horaria.
    const parts = dateString.split('-');
    // Date constructor: new Date(year, monthIndex, day). MonthIndex es 0-base.
    const date = new Date(parts[0], parts[1] - 1, parts[2]); 
    
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options); 
}

// Función de utilidad para obtener el estilo del estado
const obtenerEstiloEstado = (estado) => {
    switch (estado) {
        case "PENDIENTE_DUENO":
            return { texto: "Pendiente Aprobación", estilo: { ...styles.estadoBadge, ...styles.estadoPendiente } };
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
            return { texto: "Completado", estilo: { ...styles.estadoBadge, ...styles.estadoCompletado } };
        case "CANCELADO":
            return { texto: "Cancelado", estilo: { ...styles.estadoBadge, ...styles.estadoCancelado } }; 
        default:
            return { texto: estado, estilo: { ...styles.estadoBadge, ...styles.estadoPendiente } };
    }
};

const AprobacionPedidos = () => {
    const { user } = useAuth();
    const [masterPedidos, setMasterPedidos] = useState([]);
    const [pedidosMostrados, setPedidosMostrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
    // Nuevo estado para el modal de confirmación
    const [confirmAction, setConfirmAction] = useState(null); // { id: number, type: 'cancel' | 'delete', message: string, title: string }
    
    const [filtros, setFiltros] = useState({
        id: '',
        fecha: '', 
        estado: 'PENDIENTE_DUENO' 
    });
    
    // 🔥 ESTADO PARA ALMACENAR EL DESGLOSE DE TOTALES EN DETALLES
    const [resultadoDetalles, setResultadoDetalles] = useState(null);


    const navbarWidth = isNavbarCollapsed ? 70 : 250;

    const mostrarAlert = (message, type = "success") => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };
    
    // 🔥 FUNCIÓN PARA CALCULAR TOTALES DETALLES (COPIADA DE RealizarPedido.js)
    const calcularTotalesDetalles = (detalles) => {
        if (!detalles || detalles.length === 0) {
            return { total_mo: 0, total_insumos: 0, subtotal: 0, total: 0 };
        }
        
        let totalCostoMO = 0; 
        let totalCostoInsumos = 0; 

        detalles.forEach(d => {
            const cantidad = parseInt(d.cantidad || 0);
            
            // Usamos los nuevos campos que el backend ahora envía:
            const costoMOUnitario = parseFloat(d.costo_mo_unitario || 0);
            const costoInsumoUnitario = parseFloat(d.costo_insumos_unitario || 0);
            
            totalCostoMO += costoMOUnitario * cantidad;
            totalCostoInsumos += costoInsumoUnitario * cantidad;
        });

        const subtotal = totalCostoMO + totalCostoInsumos; // Costo Total de Producción
        
        // 🔥 Ganancia y Total Final: Se asume que en el modal de detalles NO queremos ver la ganancia aplicada
        const total = subtotal; 
        
        return {
            // Costo Total de Producción (Subtotal)
            total_mo: totalCostoMO, 
            total_insumos: totalCostoInsumos,
            subtotal: subtotal,
            // Total Final (Costo Real)
            total: total
        };
    };

    const cargarPedidos = async () => {
        if (!user || !user.rol || !user.id) {
            console.log('Usuario no disponible, esperando...');
            return;
        }

        try {
            setLoading(true);
            
            // Usamos el filtro de Django para obtener solo los pedidos que no son del usuario actual
            const urlConCacheBuster = `${API_PEDIDOS_URL}?t=${new Date().getTime()}`;
            const response = await axios.get(urlConCacheBuster);
            const data = response.data;
            
            // Filtramos en el frontend si el backend no lo hace (asumimos el rol Dueño ve todo excepto sus propios pedidos)
            let pedidosDeVendedores = data.filter(pedido => 
                pedido.Usuario !== user.id 
            );
            
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
        
        // CORRECCIÓN DE FILTRO DE FECHA
        if (filtros.fecha) {
            pedidosFiltrados = pedidosFiltrados.filter(p => 
                p.Pedido_fecha && p.Pedido_fecha === filtros.fecha
            );
        }
        
        if (filtros.estado !== 'TODOS') {
            pedidosFiltrados = pedidosFiltrados.filter(p => p.Pedido_estado === filtros.estado);
        }
        
        setPedidosMostrados(pedidosFiltrados);
    }, [filtros, masterPedidos]);

    const actualizarEstadoPedido = async (pedidoId, nuevoEstado, mensajeExito) => {
        try {
            await axios.patch(`${API_PEDIDOS_URL}${pedidoId}/`, { 
                Pedido_estado: nuevoEstado
            });
            mostrarAlert(mensajeExito);

            // Actualizar la lista maestra
            setMasterPedidos(prevMasterList => {
                if (nuevoEstado === 'CANCELADO') {
                    // Solo si es rechazado/cancelado, lo marcamos como tal, no lo eliminamos del master list
                    return prevMasterList.map(pedido => {
                        if (pedido.Pedido_ID === pedidoId) {
                            return { ...pedido, Pedido_estado: nuevoEstado };
                        }
                        return pedido;
                    });
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
        } finally {
            setConfirmAction(null); // Cerrar el modal de confirmación
        }
    };

    const aceptarPedido = (pedidoId) => {
        actualizarEstadoPedido(pedidoId, 'PENDIENTE_COSTURERO', 'Pedido ACEPTADO y enviado a Costurero exitosamente');
    };

    const performRechazarPedido = (pedidoId) => {
        actualizarEstadoPedido(pedidoId, 'CANCELADO', 'Pedido RECHAZADO y CANCELADO exitosamente');
    };
    
    const performEliminarPedido = async (id) => {
        try {
            await axios.delete(`${API_PEDIDOS_URL}${id}/`);
            mostrarAlert("✅ Pedido ELIMINADO permanentemente", "success");
            
            // Eliminar de la lista maestra
            setMasterPedidos(prev => prev.filter(p => p.Pedido_ID !== id)); 
        } catch {
            mostrarAlert("❌ Error al eliminar el pedido", "error");
        } finally {
            setConfirmAction(null);
        }
    };


    // Funciones para manejar el modal de confirmación
    const confirmarRechazo = (id) => {
        setConfirmAction({
            id,
            type: 'cancel',
            title: 'Rechazar Pedido',
            message: '¿Estás seguro de RECHAZAR este pedido? Se marcará como CANCELADO.',
            confirmText: 'Sí, Rechazar',
            confirmColor: styles.btnRechazar.backgroundColor
        });
    };
    
    const confirmarEliminacion = (id) => {
        setConfirmAction({
            id,
            type: 'delete',
            title: 'Eliminar Pedido',
            message: '¿Estás seguro de ELIMINAR este pedido permanentemente? Esta acción no se puede deshacer.',
            confirmText: 'Sí, Eliminar',
            confirmColor: styles.btnEliminar.color
        });
    };

    const handleConfirmAction = () => {
        if (!confirmAction) return;

        if (confirmAction.type === 'cancel') {
            performRechazarPedido(confirmAction.id);
        } else if (confirmAction.type === 'delete') {
            performEliminarPedido(confirmAction.id);
        }
    };


    const renderAcciones = (pedido) => {
        if (pedido.Pedido_estado === 'PENDIENTE_DUENO') {
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
                        onClick={() => confirmarRechazo(pedido.Pedido_ID)}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                    >
                        <XCircle size={14} />
                        Rechazar
                    </button>
                </div>
            );
        } else if (pedido.Pedido_estado === 'COMPLETADO' || pedido.Pedido_estado === 'CANCELADO') {
            return (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                        style={styles.btnEliminar} 
                        onClick={() => confirmarEliminacion(pedido.Pedido_ID)} 
                        title="Eliminar pedido permanentemente"
                    >
                        <Trash2 size={16} /> Eliminar
                    </button>
                </div>
            );
        }
        
        return (
            <span style={{color: '#9ca3af', fontSize: '12px'}}>
                (En flujo de producción)
            </span>
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
    
    // Función para cargar los detalles y establecer el estado de los totales
    const handleVerDetalles = async (pedido) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_PEDIDOS_URL}${pedido.Pedido_ID}/`);
            const data = response.data;
            
            // Re-calculamos el desglose de totales aquí (usando la data del API)
            // Esto usa los campos costo_mo_unitario y costo_insumos_unitario que el backend ahora envía
            const totalesCalculados = calcularTotalesDetalles(data.detalles);
            setResultadoDetalles(totalesCalculados);

            setPedidoSeleccionado(data);
            
        } catch (error) {
            console.error("Error al cargar detalles:", error);
            mostrarAlert("Error al cargar los detalles del pedido", "error");
        } finally {
            setLoading(false);
        }
    };


    if (loading || !user) {
        return (
            <>
                <div style={styles.container}>
                    <Componente 
                        onToggle={setIsNavbarCollapsed}
                    />
                    <div style={styles.main(navbarWidth)}>
                        <div style={styles.contentWrapper}>
                            {/* Opcional: Agregar un spinner o mensaje de carga */}
                            <h1 style={{color: 'white'}}>Cargando pedidos...</h1>
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
                                            <th style={styles.th}>Pedido</th>
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
                                                    {/* ID PEDIDO CORREGIDO */}
                                                    <td style={styles.td}>PED{String(pedido.Pedido_ID || "").padStart(3, "0")}</td>
                                                    
                                                    <td style={styles.td}>
                                                        <span style={{...styles.estadoBadge, ...estilo}}>
                                                            {texto}
                                                        </span>
                                                    </td>
                                                    {/* FECHA CORREGIDA */}
                                                    <td style={styles.td}>
                                                        {formatDateForDisplay(pedido.Pedido_fecha)}
                                                    </td>
                                                    <td style={styles.td}>
                                                        <button
                                                            style={styles.btnVer}
                                                            onClick={() => handleVerDetalles(pedido)}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                                        >
                                                            <Package size={14} />
                                                            VER DETALLES
                                                        </button>
                                                    </td>
                                                    <td style={styles.td}>
                                                        {renderAcciones(pedido)}
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

                {/* Modal de confirmación personalizado */}
                {confirmAction && (
                    <div style={styles.confirmModalOverlay} onClick={() => setConfirmAction(null)}>
                        <div style={styles.confirmModalContent} onClick={(e) => e.stopPropagation()}>
                            <div style={styles.confirmTitle}>
                                {confirmAction.type === 'delete' ? <Trash2 size={24} color="#ef4444" /> : <XCircle size={24} color="#ef4444" />}
                                {confirmAction.title}
                            </div>
                            <div style={styles.confirmMessage}>
                                {confirmAction.message}
                            </div>
                            <div style={styles.confirmActions}>
                                <button 
                                    style={styles.btnConfirmNo} 
                                    onClick={() => setConfirmAction(null)}
                                >
                                    No, Mantener
                                </button>
                                <button 
                                    style={{ ...styles.btnConfirmYes, backgroundColor: confirmAction.confirmColor }} 
                                    onClick={handleConfirmAction}
                                >
                                    {confirmAction.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Modal de detalles */}
                {pedidoSeleccionado && (
                    <div style={styles.modalOverlay} onClick={() => setPedidoSeleccionado(null)}>
                        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            
                            {/* Header del Modal */}
                            <div style={styles.modalHeader}>
                                <h2 style={styles.modalTitle}>
                                    Detalles del Pedido PED{String(pedidoSeleccionado.Pedido_ID || "").padStart(3, "0")}
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
                                            {/* FECHA CORREGIDA */}
                                            {pedidoSeleccionado.Pedido_fecha ? formatDateForDisplay(pedidoSeleccionado.Pedido_fecha) : "-"}
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

                            {/* Lista de Prendas (código de detalles se mantiene igual) */}
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
                                                    // 🔥 CORRECCIÓN 1: Lógica de la URL de la imagen
                                                    src={detalle.prenda_imagen?.startsWith('http') ? detalle.prenda_imagen : `http://localhost:8000${detalle.prenda_imagen}` || "https://via.placeholder.com/100x100?text=Sin+Imagen"}
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
                                                {/* Mostrar el desglose si es Dueño */}
                                                {user && user.rol === 'Dueño' && detalle.precio_total !== undefined && (
                                                    <div style={{ textAlign: "right", minWidth: "140px" }}>
                                                        
                                                        {/* Costo Unitario Base (Costo de Producción + Recargo XL) */}
                                                        <div style={{ fontSize: "12px", color: "#9ca3af" }}>Costo Unitario (Base + Recargo)</div>
                                                        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#ffd70f", marginBottom: "4px" }}>
                                                            ${parseFloat(detalle.precio_unitario || 0).toFixed(2)}
                                                        </div>
                                                        
                                                        {/* Precio Total de Línea (Costo + Ganancia) */}
                                                        <div style={{ fontSize: "12px", color: "#9ca3af" }}>Precio Total de Línea (Final)</div>
                                                        <div
                                                            style={{
                                                                fontSize: "16px",
                                                                fontWeight: "bold",
                                                                color: "#f59e0b",
                                                                marginTop: "4px",
                                                            }}
                                                        >
                                                            {/* 🔥 CORRECCIÓN 2: Mostrar el Precio Total de Línea con Ganancia (precio_total) */}
                                                            ${parseFloat(detalle.precio_total || 0).toFixed(2)}
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
                                
                                {/* 🔥 BLOQUE DE DESGLOSE DE TOTALES (Resultado Completo) 🔥 */}
                                {resultadoDetalles && (
                                    <div style={styles.resultadoContainer}>
                                        <div style={styles.resultadoGrid}>
                                            <div style={styles.resultadoItem}>
                                                <div style={styles.resultadoLabel}>Costo Mano de Obra Total</div>
                                                <div style={styles.resultadoValue}>
                                                    ${resultadoDetalles.total_mo.toFixed(2)}
                                                </div>
                                            </div>
                                            <div style={styles.resultadoItem}>
                                                <div style={styles.resultadoLabel}>Costo Total de Insumos</div>
                                                <div style={styles.resultadoValue}>
                                                    ${resultadoDetalles.total_insumos.toFixed(2)}
                                                </div>
                                            </div>
                                            <div style={styles.resultadoItem}>
                                                <div style={styles.resultadoLabel}>Costo Total de Producción (Subtotal)</div>
                                                <div style={styles.resultadoValue}>
                                                    ${resultadoDetalles.subtotal.toFixed(2)}
                                                </div>
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