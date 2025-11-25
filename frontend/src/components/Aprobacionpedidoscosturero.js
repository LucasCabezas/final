import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Componente from './componente.jsx';
import fondoImg from "./assets/fondo.png";
import { CheckCircle, Package, PlayCircle, StopCircle, Send, AlertCircle, Clock, Scissors, Search, X } from 'lucide-react';

const API_PEDIDOS_URL = "http://localhost:8000/api/pedidos/";

// 🔥 FUNCIÓN DE UTILIDAD SEGURA PARA FECHAS
const formatDateSafe = (dateString) => {
    if (!dateString) return "-";
    // Si la cadena es 'YYYY-MM-DD', la separamos para forzar la fecha correcta sin desfase de zona horaria.
    const parts = dateString.substring(0, 10).split('-'); 
    // Date constructor: new Date(year, monthIndex, day). MonthIndex es 0-base (0=Enero).
    const date = new Date(parts[0], parts[1] - 1, parts[2]); 
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

const AprobacionPedidosCosturero = () => {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ Declaración correcta
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [alert, setAlert] = useState(null);
    const [navbarWidth, setNavbarWidth] = useState(250);

    const [filtroId, setFiltroId] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('PENDIENTE_COSTURERO');
    const [filtroFecha, setFiltroFecha] = useState('');

    const handleNavbarToggle = (collapsed) => {
        setNavbarWidth(collapsed ? 70 : 250);
    };

    const cargarPedidos = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_PEDIDOS_URL); 
            const data = response.data;
            const pedidosParaCostura = data.filter(
                p => p.Pedido_estado === 'PENDIENTE_COSTURERO' || p.Pedido_estado === 'EN_PROCESO_COSTURERO'
            );
            setPedidos(pedidosParaCostura);
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
            const response = await axios.post(endpoint); 
            const data = response.data;
            mostrarAlerta(data.mensaje, "success");
            cargarPedidos(); // Recargar pedidos
            
        } catch (error) {
            console.error(`Error en acción ${accion}:`, error);
            const errorMsg = error.response?.data?.error || error.message;
            mostrarAlerta(`Error: ${errorMsg}`, "error");
        }
    };
    
    // Función eliminada, se usa formatDateSafe ahora
    /*
    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };
    */

    const abrirDetalles = (pedido) => {
        setSelectedPedido(pedido);
    };

    const cerrarDetalles = () => {
        setSelectedPedido(null);
    };

    const limpiarFiltros = () => {
        setFiltroId('');
        setFiltroEstado('TODOS');
        setFiltroFecha('');
    };

    const styles = {
        // ... (Todos tus estilos desde la línea 81 a la 330 se mantienen 100% igual)
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
            fontSize: "14px",
            colorScheme: 'dark' // Ajustado para input type=date
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
        estadoCompletado: {
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            color: '#22c55e',
            border: '1px solid rgba(34, 197, 94, 0.3)'
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
            marginRight: '8px',
            transition: 'all 0.3s ease'
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
            marginRight: '8px',
            transition: 'all 0.3s ease'
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
            marginRight: '8px',
            transition: 'all 0.3s ease'
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

    const pedidosFiltrados = pedidos.filter(pedido => {
        if (filtroId && !String(pedido.Pedido_ID).includes(filtroId)) {
            return false;
        }
        if (filtroEstado !== 'TODOS' && pedido.Pedido_estado !== filtroEstado) {
            return false;
        }
        
        // 🔥 CORRECCIÓN DEL FILTRO DE FECHA: Compara la cadena YYYY-MM-DD
        if (filtroFecha && pedido.Pedido_fecha) {
            const fechaPedidoStr = pedido.Pedido_fecha.substring(0, 10);
            if (fechaPedidoStr !== filtroFecha) {
                return false;
            }
        }
        
        return true;
    });

    return (
        <div style={styles.container}>
            <Componente onToggle={handleNavbarToggle} />
            <div style={styles.main}>
                <div style={styles.contentWrapper}>
                    <h1 style={styles.title}>
                        <Scissors size={36} />
                        Gestión de pedidos del taller de Costura
                    </h1>
                    <p style={styles.subtitle}>
                        Administra tus pedidos de costura: acepta, procesa y completa trabajos
                    </p>

                    <div style={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Buscar por ID..."
                            value={filtroId}
                            onChange={(e) => setFiltroId(e.target.value)}
                            style={styles.searchInput}
                        />
                        <select 
                            value={filtroEstado} 
                            onChange={(e) => setFiltroEstado(e.target.value)} 
                            style={styles.select}
                        >
                            <option value="TODOS">Todos los Estados</option>
                            <option value="PENDIENTE_COSTURERO">Pendientes</option>
                            <option value="EN_PROCESO_COSTURERO">En Proceso</option>
                        </select>
                        <input
                            type="date"
                            value={filtroFecha}
                            onChange={(e) => setFiltroFecha(e.target.value)}
                            style={{...styles.searchInput}}
                        />
                        <button style={styles.btnLimpiar} onClick={limpiarFiltros}>
                            <X size={18} /> Limpiar
                        </button>
                    </div>

                    {pedidosFiltrados.length === 0 ? (
                        <div style={styles.tableContainer}>
                            <div style={styles.emptyState}>
                                <Package style={styles.emptyStateIcon} />
                                <h3>
                                    {pedidos.length > 0 ? "No se encontraron pedidos con esos filtros" : "No hay pedidos disponibles"}
                                </h3>
                                <p>
                                    {pedidos.length > 0 ? "Intenta ajustar o limpiar los filtros." : "No tienes pedidos de costura por procesar en este momento."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Pedido ID</th>
                                        <th style={styles.th}>Estado</th>
                                        <th style={styles.th}>Fecha</th>
                                        <th style={styles.th}>Detalle</th>
                                        <th style={styles.th}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosFiltrados.map((pedido) => {
                                        const tieneEstampadas = pedido.detalles?.some(d => d.tipo === 'ESTAMPADA') || false;
                                        
                                        return (
                                            <tr key={pedido.Pedido_ID}>
                                                <td style={styles.td}>PED{String(pedido.Pedido_ID).padStart(3, "0")}</td>
                                                <td style={styles.td}>
                                                    {pedido.Pedido_estado === "PENDIENTE_COSTURERO" ? (
                                                        <span style={{ ...styles.estadoBadge, ...styles.estadoPendiente }}>
                                                            PENDIENTE
                                                        </span>
                                                    ) : (
                                                        <span style={{ ...styles.estadoBadge, ...styles.estadoEnProceso }}>
                                                            EN PROCESO
                                                        </span>
                                                    )}
                                                </td>
                                                {/* 🔥 USO DE FUNCIÓN SEGURA */}
                                                <td style={styles.td}>{formatDateSafe(pedido.Pedido_fecha)}</td>
                                                <td style={styles.td}>
                                                    <button
                                                        style={styles.btnVer}
                                                        onClick={() => abrirDetalles(pedido)}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                                    >
                                                        <Package size={14} />
                                                        VER DETALLES
                                                    </button>
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {pedido.Pedido_estado === "PENDIENTE_COSTURERO" && (
                                                            <button
                                                                style={styles.btnAceptar}
                                                                onClick={() => realizarAccion(pedido.Pedido_ID, "aceptar-costurero")}
                                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                                                            >
                                                                <CheckCircle size={14} />
                                                                Aceptar
                                                            </button>
                                                        )}
                                                        
                                                        {pedido.Pedido_estado === "EN_PROCESO_COSTURERO" && (
                                                            <>
                                                                {/* Si tiene estampadas, SÓLO mostrar "Enviar a Estampado" */}
                                                                {tieneEstampadas && (
                                                                    <button
                                                                        style={styles.btnEnviarEstampado}
                                                                        onClick={() => realizarAccion(pedido.Pedido_ID, "trasladar-estampado")}
                                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
                                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
                                                                    >
                                                                        <Send size={14} />
                                                                        Enviar a Estampado
                                                                    </button>
                                                                )}
                                                                
                                                                {/* Si NO tiene estampadas, SÓLO mostrar "Terminar" */}
                                                                {!tieneEstampadas && (
                                                                    <button
                                                                        style={styles.btnTerminar}
                                                                        onClick={() => realizarAccion(pedido.Pedido_ID, "terminar-costurero")}
                                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
                                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#22c55e'}
                                                                    >
                                                                        <StopCircle size={14} />
                                                                        Terminar
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
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
            {selectedPedido && (
                <div style={styles.modal} onClick={cerrarDetalles}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                <Scissors size={24} />
                                Detalles del Pedido PED{String(selectedPedido.Pedido_ID).padStart(3, "0")}
                            </h3>
                            <button
                                style={styles.modalCloseBtn}
                                onClick={cerrarDetalles}
                            >
                                ×
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={styles.infoBox}>
                              <div style={styles.infoLabel}>Usuario que realizó el pedido</div>
                              <div style={styles.infoValue}>{selectedPedido.usuario || "N/A"}</div>
                            </div>
                            <div style={{ backgroundColor: "rgba(30, 30, 30, 0.6)", borderRadius: "12px", padding: "20px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                                    <div>
                                        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Estado</div>
                                        <span style={{
                                            ...styles.estadoBadge,
                                            ...(selectedPedido.Pedido_estado === "PENDIENTE_COSTURERO" ? styles.estadoPendiente :
                                                selectedPedido.Pedido_estado === "EN_PROCESO_COSTURERO" ? styles.estadoEnProceso :
                                                styles.estadoCompletado)
                                        }}>
                                            {selectedPedido.Pedido_estado.replace('PENDIENTE_COSTURERO', 'PENDIENTE COSTURA').replace('_COSTURERO', '')}
                                        </span>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Fecha</div>
                                        <div style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>
                                            {formatDateSafe(selectedPedido.Pedido_fecha)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Total de Items</div>
                                        <div style={{ color: "#ffd70f", fontSize: "20px", fontWeight: "bold" }}>
                                            {selectedPedido.detalles?.reduce((acc, d) => acc + (d.cantidad || 0), 0) || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 style={{ color: "#fff", marginBottom: "16px", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}><Package size={20} /> Prendas del Pedido</h3>
                            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                {selectedPedido.detalles && selectedPedido.detalles.length > 0 ? (
                                    selectedPedido.detalles.map((detalle, index) => (
                                        <div key={index} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "16px", borderRadius: "12px", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "16px" }}>
                                            <img 
                                                src={detalle.prenda_imagen ? (detalle.prenda_imagen.startsWith("http") ? detalle.prenda_imagen : `http://localhost:8000${detalle.prenda_imagen}`) : "https://via.placeholder.com/100x100?text=Sin+Imagen"} 
                                                alt={detalle.prenda_nombre} 
                                                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }} 
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/100x100?text=Sin+Imagen"; }} 
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: "#fff", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>{detalle.prenda_nombre}</div>
                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px", fontSize: "13px", color: "#9ca3af" }}>
                                                    <div>Marca: {detalle.prenda_marca || "-"}</div>
                                                    <div>Modelo: {detalle.prenda_modelo || "-"}</div>
                                                    <div>Color: {detalle.prenda_color || "-"}</div>
                                                    <div>Talle: {detalle.talle || "-"}</div>
                                                    <div>Tipo: {detalle.tipo || "LISA"}</div>
                                                    <div>Cantidad: {detalle.cantidad}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", backgroundColor: "rgba(30,30,30,0.6)", borderRadius: "12px" }}>
                                        <AlertCircle size={48} style={{ margin: "0 auto 12px" }} />
                                        <p>No hay detalles disponibles para este pedido</p>
                                    </div>
                                )}
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

export default AprobacionPedidosCosturero;