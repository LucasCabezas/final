// src/components/Estampador.js

import React, { useState, useEffect } from "react";
import Componente from './componente.jsx';
import { useAuth } from '../context/AuthContext'; 
import fondoImg from "./assets/fondo.png";


const API_PEDIDOS_URL = "http://localhost:8000/api/pedidos/"; 

const getStatusColor = (estado) => {
    switch (estado) {
        case 'PENDIENTE_DUENO':
            return '#f39c12';
        case 'APROBADO_DUENO':
        case 'PENDIENTE_COSTURA':
            return '#3498db';
        case 'PENDIENTE_ESTAMPADO':
            return '#9b59b6'; // Púrpura, el color del Estampador
        case 'COMPLETADO':
            return '#2ecc71';
        case 'CANCELADO':
            return '#e74c3c';
        default:
            return '#95a5a6';
    }
};

function Estampador() {
  const { user, loading } = useAuth();
  
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendientesEstampado, setPendientesEstampado] = useState(0);
  const [completadosHoy, setCompletadosHoy] = useState(0); // Métrica relevante
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  const navbarWidth = isNavbarCollapsed ? 70 : 250;

  useEffect(() => {
    if (!user || loading) return;
    cargarPedidosEstampador();
  }, [user, loading]);

  const cargarPedidosEstampador = async () => {
    setIsLoading(true);
    try {
      console.log("🔄 Estampador - Intentando cargar pedidos...");
      
      const response = await fetch(API_PEDIDOS_URL); // Carga todos los pedidos
      
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Filtrar los pedidos que son relevantes para el Estampador
      const pedidosEstampador = data.filter(
        (item) => item.estado === 'PENDIENTE_ESTAMPADO' || item.estado === 'COMPLETADO'
      );

      setPedidos(pedidosEstampador);

      // Calcular Pedidos Pendientes de Estampado
      const pendientes = pedidosEstampador.filter(
          (item) => item.estado === 'PENDIENTE_ESTAMPADO'
      ).length;
      setPendientesEstampado(pendientes);

      // (Simulación) Calcular pedidos completados hoy
      const hoy = new Date().toISOString().slice(0, 10);
      const completados = pedidosEstampador.filter(
          (item) => item.estado === 'COMPLETADO' && item.fecha_finalizacion && item.fecha_finalizacion.startsWith(hoy)
      ).length;
      setCompletadosHoy(completados);

      console.log("✅ Estampador - Pedidos cargados correctamente");
    } catch (error) {
      console.error("❌ Estampador - Error cargando pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const styles = {
    // Estilos basados en Dueno.js y Vendedor.js
    container: { display: "flex", minHeight: "100vh", width: "100%" },
    main: {
      marginLeft: `${navbarWidth}px`, padding: "32px",
      backgroundImage: `url(${fondoImg})`, backgroundSize: "cover",
      backgroundPosition: "center", backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed", overflowY: "auto", flex: 1,
      transition: "margin-left 0.3s ease", width: `calc(100% - ${navbarWidth}px)`,
    },
    contentWrapper: { maxWidth: "1400px", margin: "0 auto" },
    header: { marginBottom: "32px" },
    title: { fontSize: "36px", fontWeight: "bold", color: "#ffffff" },
    subtitle: { color: "#d1d5db", fontSize: "15px", marginTop: "8px" },
    resumenGrid: {
      display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px", marginBottom: "40px",
    },
    resumenCard: {
      backgroundColor: "rgba(30, 30, 30, 0.9)", padding: "20px",
      borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", textAlign: 'center',
    },
    cardLabel: {
      color: "#9ca3af", fontSize: "14px",
      fontWeight: "600", marginBottom: "12px",
    },
    cardValue: {
      fontSize: "36px", fontWeight: "bold", color: "#ffffff",
    },
    // Estilos de tabla
    table: { width: '100%', borderCollapse: 'collapse', color: '#ffffff', textAlign: 'left', marginTop: '20px', },
    th: { padding: '12px 15px', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', fontSize: '14px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', },
    td: { padding: '12px 15px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '14px', },
    statusBadge: getStatusColor, // Usamos la función directamente
  };

  return (
    <div style={styles.container}>
      <Componente onToggle={setIsNavbarCollapsed} />

      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              ¡Bienvenido Estampador!{" "}
              {user ? (
                // Uso la validación de undefined para evitar el error
                `${user.Usuario_nombre || ''} ${user.Usuario_apellido || ''}`
              ) : (
                ""
              )}
            </h2>
             <p style={styles.subtitle}>
              Tu panel de trabajo: seguimiento de prendas y pedidos listos para estampado.
            </p>
          </div>

          {/* Resumen de Tareas Pendientes */}
          <section style={{ marginBottom: "40px" }}>
            <h3 style={{ ...styles.title, fontSize: "20px", marginBottom: "8px" }}>
                Resumen de Tareas
            </h3>
            <div style={styles.resumenGrid}>
              {/* Card 1: Pedidos Pendientes de Estampado */}
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Pedidos Pendientes de Estampado</h4>
                <p style={{...styles.cardValue, color: '#9b59b6'}}>{isLoading ? '...' : pendientesEstampado}</p>
                <p style={styles.subtitle}>Listos para iniciar producción.</p>
              </div>

              {/* Card 2: Pedidos Completados Hoy */}
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Pedidos Finalizados Hoy</h4>
                <p style={{...styles.cardValue, color: '#2ecc71'}}>{isLoading ? '...' : completadosHoy}</p>
                <p style={styles.subtitle}>Métrica de rendimiento.</p>
              </div>
            </div>
          </section>
          
          {/* Listado Detallado de Pedidos Pendientes */}
          <section>
            <h3 style={{ ...styles.title, fontSize: "24px", marginBottom: "20px" }}>
              Pedidos Asignados (Pendientes o en Progreso)
            </h3>
            <p style={styles.subtitle}>
                Utiliza la sección de "Aprobación de Pedidos" para marcar como completados.
            </p>
            <div style={styles.resumenCard}> 
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
                                <th style={styles.th}>Estado</th>
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
                                        <span style={getStatusColor(pedido.estado)}>
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
                        ¡Genial! No hay pedidos pendientes de estampado en este momento.
                    </p>
                )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Estampador;