import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import Componente from './componente.jsx';
import fondoImg from "./assets/fondo.png";
import { Package, Calendar, BarChart2 } from "lucide-react";

function Dueno({ usuarioId }) {
  const [usuario, setUsuario] = useState(null);
  
  // Estados de Insumos (sin cambios)
  const [insumos, setInsumos] = useState([]);
  const [totalValor, setTotalValor] = useState(0);
  const [bajoStock, setBajoStock] = useState(0);
  
  // Estados para Pedidos
  const [pedidos, setPedidos] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState(new Date().toISOString().split('T')[0]);
  const [datosGraficoPedidos, setDatosGraficoPedidos] = useState([]);
  
  // 🔥 NUEVO: Estado para el total de pedidos del día
  const [totalPedidosDelDia, setTotalPedidosDelDia] = useState(0);

  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  const COLORS_INSUMOS = ["#3498db", "#f39c12", "#e74c3c", "#2ecc71", "#9b59b6", "#1abc9c", "#e67e22", "#95a5a6"];
  const COLORS_PEDIDOS = {
    'PENDIENTE_COSTURERO': '#f39c12',
    'EN_PROCESO_COSTURERO': '#3498db',
    'PENDIENTE_ESTAMPADO': '#f1c40f',
    'EN_PROCESO_ESTAMPADO': '#9b59b6',
    'COMPLETADO': '#2ecc71',
    'CANCELADO': '#e74c3c',
    'PENDIENTE_DUENO': '#bdc3c7'
  };

  const navbarWidth = isNavbarCollapsed ? 70 : 250;

  useEffect(() => {
    if (usuarioId) {
       fetch(`http://localhost:8000/api/usuarios/${usuarioId}`)
        .then((res) => res.json())
        .then((data) => setUsuario(data))
        .catch((err) => console.error("❌ Error al cargar usuario:", err));
    }
    cargarInsumos();
    cargarPedidos();
  }, [usuarioId]);

  const cargarInsumos = async () => {
    // ... (Tu función cargarInsumos se mantiene 100% igual)
    try {
      const response = await fetch("http://localhost:8000/api/inventario/insumos/");
      if (!response.ok) return;
      const data = await response.json();
      setInsumos(data);
      const total = data.reduce((sum, item) => {
        const precio = item.Insumo_precio_unitario || 0;
        const cantidad = item.Insumo_cantidad || 0;
        const subtotal = precio * cantidad;
        return sum + subtotal;
      }, 0);
      setTotalValor(total);
      const bajos = data.filter((item) => item.Insumo_cantidad < item.Insumo_cantidad_minima).length;
      setBajoStock(bajos);
    } catch (error) {
      console.error("❌ Error cargando insumos:", error);
    }
  };
  
  const cargarPedidos = async () => {
    // ... (Tu función cargarPedidos se mantiene 100% igual)
    try {
        const response = await fetch("http://localhost:8000/api/pedidos/?usuario_tipo=dueno");
        if (!response.ok) return;
        const data = await response.json();
        setPedidos(data);
    } catch (error) {
        console.error("❌ Error cargando pedidos:", error);
    }
  };

  // 🔥 MODIFICADO: Este efecto ahora también calcula el TOTAL de pedidos del día
  useEffect(() => {
    if (pedidos.length === 0) return;

    // 1. Filtrar pedidos por la fecha seleccionada
    const pedidosFiltrados = filtroFecha
      ? pedidos.filter(p => p.Pedido_fecha && p.Pedido_fecha.startsWith(filtroFecha))
      : pedidos;

    // 🔥 NUEVO: Guardar el total de pedidos filtrados
    setTotalPedidosDelDia(pedidosFiltrados.length);

    // 2. Agrupar por estado
    const conteoPorEstado = pedidosFiltrados.reduce((acc, pedido) => {
        const estado = pedido.Pedido_estado_real || 'INDEFINIDO';
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
    }, {});

    // 3. Formatear para el gráfico de torta
    const datosFormateados = Object.keys(conteoPorEstado).map(estado => ({
      name: estado.replace(/_/g, ' '),
      value: conteoPorEstado[estado],
      fill: COLORS_PEDIDOS[estado] || '#808080'
    }));

    setDatosGraficoPedidos(datosFormateados);

  }, [pedidos, filtroFecha]);


  // Datos para el gráfico de Insumos (sin cambios)
  const datosGraficoInsumos = insumos.map((item) => ({
    name: item.Insumo_nombre,
    value: item.Insumo_cantidad,
  }));

  const styles = {
    // ... (Todos tus estilos se mantienen 100% igual)
    container: {
      display: "flex",
      minHeight: "100vh",
      width: "100%",
    },
    insumosContainer: {
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
      gridTemplateColumns: "1fr 1fr 2fr",
      gap: "20px",
      marginBottom: "40px",
    },
    resumenCard: {
      backgroundColor: "rgba(30, 30, 30, 0.9)",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
    },
    cardLabel: {
      color: "#9ca3af",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "12px",
    },
    cardValue: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#ffffff",
    },
    graficoContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "250px",
    },
    alertasSection: {
      backgroundColor: "rgba(30, 30, 30, 0.9)",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    alertasTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: "15px",
    },
    alertasList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    alertaItem: {
      padding: "10px",
      borderLeft: "4px solid #e74c3c",
      marginBottom: "10px",
      color: "#d1d5db",
    },
  };

  return (
    <div style={styles.container}>
      <Componente onToggle={setIsNavbarCollapsed} />

      <main style={styles.insumosContainer}>
        <div style={styles.contentWrapper}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              ¡Bienvenido!{" "}
              {usuario
                ? `${usuario.Usuario_nombre} ${usuario.Usuario_apellido}`
                : ""}
            </h2>
          </div>

          {/* Resumen General de Insumos (Tu sección original, sin cambios) */}
          <section style={{ marginBottom: "40px" }}>
            {/* ... (Todo tu JSX de Resumen de Insumos se mantiene 100% igual) ... */}
            <h3 style={{ ...styles.title, fontSize: "20px", marginBottom: "8px" }}>
              <Package size={20} style={{ marginRight: "8px", verticalAlign: "bottom" }} />
              Resumen General de Inventario de Insumos
            </h3>
            <div style={styles.resumenGrid}>
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Valor Total del Stock de Insumo</h4>
                <p style={styles.cardValue}>
                  ${totalValor.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Artículos en Bajo Stock</h4>
                <p style={styles.cardValue}>{bajoStock}</p>
              </div>
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Distribución de Cantidad por Insumo</h4>
                {datosGraficoInsumos.length > 0 ? (
                  <div style={styles.graficoContainer}>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={datosGraficoInsumos}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {datosGraficoInsumos.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS_INSUMOS[index % COLORS_INSUMOS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => `${value} unidades`}
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 30, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "8px",
                            color: "#ffffff",
                          }}
                        />
                        <Legend
                          wrapperStyle={{ color: "#ffffff", paddingTop: "20px" }}
                          formatter={(value) => (
                            <span style={{ fontSize: "12px" }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p style={{ color: "#9ca3af", textAlign: "center" }}>
                    {insumos.length === 0 ? "No hay insumos para mostrar" : "Cargando datos..."}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 🔥 NUEVO: Sección de Resumen de Pedidos */}
          <section style={{ marginBottom: "40px" }}>
            <h3 style={{ ...styles.title, fontSize: "20px", marginBottom: "8px" }}>
              <BarChart2 size={20} style={{ marginRight: "8px", verticalAlign: "bottom" }} />
              Resumen de Pedidos por Día
            </h3>
            <p style={styles.subtitle}>
              Estado de los pedidos generados en la fecha seleccionada.
            </p>

            {/* Usamos un layout de 1 columna, reutilizando el estilo de card */}
            <div style={styles.resumenCard}>
              <div style={{...styles.cardLabel, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} />
                <span>Filtrar por Fecha</span>
              </div>
              
              {/* El Filtro de Fecha */}
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  colorScheme: 'dark' // Asegura que el calendario se vea bien
                }}
              />
              
              {/* 🔥 NUEVO: Tarjeta de Total de Pedidos del Día */}
              <div style={{...styles.resumenCard, backgroundColor: 'rgba(0,0,0,0.3)', marginBottom: '20px', textAlign: 'center'}}>
                <h4 style={styles.cardLabel}>
                  TOTAL DE PEDIDOS ({new Date(filtroFecha + 'T00:00:00-03:00').toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric'})})
                </h4>
                <p style={styles.cardValue}>
                  {totalPedidosDelDia}
                </p>
              </div>

              
              {/* El Gráfico de Torta */}
              {datosGraficoPedidos.length > 0 ? (
                <div style={styles.graficoContainer}>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={datosGraficoPedidos}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {/* Usamos el 'fill' que definimos en los datos */}
                        {datosGraficoPedidos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${value} ${value === 1 ? 'pedido' : 'pedidos'}`}
                        contentStyle={{
                          backgroundColor: "rgba(30, 30, 30, 0.95)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ color: "#ffffff", paddingTop: "20px" }}
                        formatter={(value) => (
                          <span style={{ fontSize: "12px", color: '#d1d5db' }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p style={{ color: "#9ca3af", textAlign: "center", padding: "40px 0" }}>
                  {pedidos.length === 0 ? "Cargando pedidos..." : `No se encontraron pedidos para esta fecha.`}
                </p>
              )}
            </div>
          </section>

          {/* Alertas Recientes (Tu sección original, sin cambios) */}
          <section style={styles.alertasSection}>
            {/* ... (Todo tu JSX de Alertas Recientes se mantiene 100% igual) ... */}
            <h3 style={styles.alertasTitle}>Alertas Recientes</h3>
            <ul style={styles.alertasList}>
              {bajoStock > 0 ? (
                <li
                  style={{
                    ...styles.alertaItem,
                    borderLeftColor: "#e74c3c",
                  }}
                >
                  ⚠️ {bajoStock} artículos con bajo stock
                </li>
              ) : (
                <li
                  style={{
                    ...styles.alertaItem,
                    borderLeftColor: "#2ecc71",
                  }}
                >
                  ✅ Todos los insumos tienen stock adecuado
                </li>
              )}
              <li
                style={{
                  ...styles.alertaItem,
                  borderLeftColor: "#f39c12",
                }}
              >
                📦 Nuevo pedido recibido
              </li>
              <li
                style={{
                  ...styles.alertaItem,
                  borderLeftColor: "#3498db",
                }}
              >
                ℹ️ Sistema funcionando correctamente
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dueno;