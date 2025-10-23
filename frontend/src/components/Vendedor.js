import React, { useState, useEffect } from "react";
import Componente from './componente.jsx';
import { useAuth } from '../context/AuthContext'; // Asumo que usas este hook
import fondoImg from "./assets/fondo.png";

// =================================================================
// 🚨 CONFIGURACIÓN DE LA API (DEBES ADAPTAR ESTAS CONSTANTES)
// =================================================================
// URL para obtener pedidos, incluyendo el parámetro para filtrar por ID de Vendedor
// Ejemplo: http://localhost:8000/api/pedidos/?vendedor_id=5
const API_PEDIDOS_URL = "http://localhost:8000/api/pedidos/"; 

function Vendedor() {
  const { user, loading } = useAuth(); // Obtiene la info del usuario y su ID
  
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [pedidosPendientes, setPedidosPendientes] = useState(0);
  const [pedidosCompletados, setPedidosCompletados] = useState(0);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  const usuarioId = user ? user.id : null; // Asumo que el ID del usuario está en user.id
  const navbarWidth = isNavbarCollapsed ? 70 : 250;

  useEffect(() => {
    if (usuarioId) {
      cargarPedidosVendedor(usuarioId);
    } else if (!loading) {
      // Manejar el caso si el usuario no tiene ID o no está logueado
      console.warn("⚠️ Vendedor - No hay usuarioId, no se pueden cargar pedidos.");
      setIsLoading(false);
    }
  }, [usuarioId, loading]);

  const cargarPedidosVendedor = async (id) => {
    setIsLoading(true);
    try {
      console.log(`🔄 Vendedor - Intentando cargar pedidos para usuario ID: ${id}...`);
      
      // 🚨 IMPORTANTE: Asume que tu API permite filtrar por el ID del vendedor que creó el pedido
      const urlFiltrada = `${API_PEDIDOS_URL}?vendedor_id=${id}`; 
      
      const response = await fetch(urlFiltrada);
      
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setPedidos(data);
      setTotalPedidos(data.length);

      // Calcular Pedidos Pendientes (Cualquier estado que no sea CANCELADO o COMPLETADO)
      const pendientes = data.filter(
          (item) => item.estado !== 'COMPLETADO' && item.estado !== 'CANCELADO'
      ).length;
      setPedidosPendientes(pendientes);

      // Calcular Pedidos Completados
      const completados = data.filter(
          (item) => item.estado === 'COMPLETADO'
      ).length;
      setPedidosCompletados(completados);

      console.log("✅ Vendedor - Pedidos cargados correctamente");
    } catch (error) {
      console.error("❌ Vendedor - Error cargando pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función para obtener el color del estado (replicada de AprobacionPedidos.js)
  const getStatusColor = (estado) => {
      switch (estado) {
          case 'PENDIENTE_DUENO':
              return '#f39c12';
          case 'APROBADO_DUENO':
          case 'PENDIENTE_COSTURA':
              return '#3498db';
          case 'PENDIENTE_ESTAMPADO':
              return '#9b59b6';
          case 'COMPLETADO':
              return '#2ecc71';
          case 'CANCELADO':
              return '#e74c3c';
          default:
              return '#95a5a6';
      }
  };


  const styles = {
    // Estilos basados en Dueno.js
    container: {
      display: "flex",
      minHeight: "100vh",
      width: "100%",
    },
    main: {
      marginLeft: `${navbarWidth}px`,
      padding: "32px",
      backgroundImage: `url(${fondoImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      overflowY: "auto",
      flex: 1,
      transition: "margin-left 0.3s ease",
      width: `calc(100% - ${navbarWidth}px)`,
    },
    contentWrapper: {
      maxWidth: "1400px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "32px",
    },
    title: {
      fontSize: "36px",
      fontWeight: "bold",
      color: "#ffffff",
    },
    subtitle: {
      color: "#d1d5db",
      fontSize: "15px",
      marginTop: "8px",
    },
    resumenGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)", // 3 columnas para los 3 indicadores
      gap: "20px",
      marginBottom: "40px",
    },
    resumenCard: {
      backgroundColor: "rgba(30, 30, 30, 0.9)",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
      textAlign: 'center',
    },
    cardLabel: {
      color: "#9ca3af",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "12px",
    },
    cardValue: {
      fontSize: "36px",
      fontWeight: "bold",
      color: "#ffffff",
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        color: '#ffffff',
        textAlign: 'left',
        marginTop: '20px',
    },
    th: {
        padding: '12px 15px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        fontSize: '14px',
        fontWeight: '600',
        color: '#9ca3af',
        textTransform: 'uppercase',
    },
    td: {
        padding: '12px 15px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '14px',
    },
    statusBadge: (estado) => ({
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '12px',
        color: 'white',
        backgroundColor: getStatusColor(estado),
    }),
  };

  return (
    <div style={styles.container}>
      <Componente onToggle={setIsNavbarCollapsed} />

      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              ¡Bienvenido Vendedor!{" "}
              {user ? `${user.Usuario_nombre} ${user.Usuario_apellido}` : ""}
            </h2>
             <p style={styles.subtitle}>
              Resumen y seguimiento de los pedidos que has ingresado.
            </p>
          </div>

          {/* Resumen de Pedidos */}
          <section style={{ marginBottom: "40px" }}>
            <div style={styles.resumenGrid}>
              {/* Card 1: Total de Pedidos */}
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Pedidos Totales Realizados</h4>
                <p style={styles.cardValue}>{isLoading ? '...' : totalPedidos}</p>
              </div>

              {/* Card 2: Pedidos Pendientes */}
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Pedidos en Proceso (Pendientes)</h4>
                <p style={{...styles.cardValue, color: '#f39c12'}}>{isLoading ? '...' : pedidosPendientes}</p>
              </div>

              {/* Card 3: Pedidos Completados */}
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Pedidos Completados y Entregados</h4>
                <p style={{...styles.cardValue, color: '#2ecc71'}}>{isLoading ? '...' : pedidosCompletados}</p>
              </div>
            </div>
          </section>
          
          {/* Listado Detallado de Pedidos */}
          <section>
            <h3 style={{ ...styles.title, fontSize: "24px", marginBottom: "20px" }}>
              Estado Actual de tus Pedidos
            </h3>
            <div style={styles.resumenCard}> {/* Reutilizamos el estilo de card para el contenedor de la tabla */}
                {isLoading ? (
                    <p style={{ color: '#9ca3af', textAlign: 'center' }}>Cargando pedidos...</p>
                ) : pedidos.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Cliente</th>
                                <th style={styles.th}>Descripción</th>
                                <th style={styles.th}>Cantidad</th>
                                <th style={styles.th}>Estado Actual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td style={styles.td}>{pedido.id}</td>
                                    <td style={styles.td}>{pedido.Cliente_nombre || 'N/A'}</td>
                                    <td style={styles.td}>{pedido.Descripcion_pedido || 'Sin descripción'}</td>
                                    <td style={styles.td}>{pedido.Cantidad_prendas || 0}</td>
                                    <td style={styles.td}>
                                        <span style={styles.statusBadge(pedido.estado)}>
                                            {/* Manejo de error de 'undefined' como ya se discutió */}
                                            {pedido.estado 
                                                ? pedido.estado.replace('_', ' ') 
                                                : 'ESTADO DESCONOCIDO'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: '#9ca3af', textAlign: 'center' }}>
                        Aún no has ingresado ningún pedido. ¡Empieza en la sección "Realizar Pedido"!
                    </p>
                )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Vendedor;

        