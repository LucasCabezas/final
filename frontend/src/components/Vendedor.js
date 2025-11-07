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
      console.log(`📄 Vendedor - Intentando cargar pedidos para usuario ID: ${id}...`);
      
      // 🔥 USAR LA MISMA API QUE RealizarPedido.js (sin filtros en URL)
      const response = await fetch(API_PEDIDOS_URL);
      
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 🔥 NUEVO: Mostrar estadísticas de TODOS los pedidos del sistema
      const todosPedidos = data; // Sin filtro - todos los pedidos
      
      console.log(`👤 Vendedor - Total pedidos del sistema: ${data.length}`);
      console.log(`👤 Vendedor - Mostrando estadísticas de todos los pedidos`);
      
      setPedidos(todosPedidos);
      setTotalPedidos(todosPedidos.length);

      // 🔥 USAR LA MISMA FUNCIÓN DE ESTADO QUE RealizarPedido.js
      const obtenerEstadoPedido = (pedido) => {
        const estadoRaw = pedido.estado || pedido.Pedido_estado;
        if (typeof estadoRaw === 'string') {
          return estadoRaw.toUpperCase();
        }
        if (estadoRaw === true) {
          return 'COMPLETADO';
        } else if (estadoRaw === false) {
          return 'PENDIENTE_DUENO';
        }
        return 'PENDIENTE_DUENO';
      };

      // Calcular Pedidos Pendientes (Cualquier estado que no sea CANCELADO o COMPLETADO)
      const pendientes = todosPedidos.filter((item) => {
        const estado = obtenerEstadoPedido(item);
        return estado !== 'COMPLETADO' && estado !== 'CANCELADO';
      }).length;
      setPedidosPendientes(pendientes);

      // Calcular Pedidos Completados
      const completados = todosPedidos.filter((item) => {
        const estado = obtenerEstadoPedido(item);
        return estado === 'COMPLETADO';
      }).length;
      setPedidosCompletados(completados);

      console.log("✅ Vendedor - Pedidos cargados correctamente");
      console.log(`📊 Vendedor - Total: ${todosPedidos.length}, Pendientes: ${pendientes}, Completados: ${completados}`);
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
        </div>
      </main>
    </div>
  );
}

export default Vendedor;