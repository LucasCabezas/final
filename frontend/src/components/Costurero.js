import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import Componente from './componente.jsx'; 
import fondoImg from "./assets/fondo.png";


function Costurero({ usuarioId }) { // Recibe el usuarioId, similar a Dueno.js
  const [usuario, setUsuario] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [totalValor, setTotalValor] = useState(0);
  const [bajoStock, setBajoStock] = useState(0);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  // Colores para el gráfico de distribución
  const COLORS = ["#3498db", "#f39c12", "#e74c3c", "#2ecc71", "#9b59b6", "#1abc9c", "#e67e22", "#95a5a6"];

  const navbarWidth = isNavbarCollapsed ? 70 : 250;

  useEffect(() => {
    console.log("🔍 Costurero - usuarioId recibido:", usuarioId);
    
    // Cargar información del usuario
    if (usuarioId) {
      fetch(`http://localhost:8000/api/usuarios/${usuarioId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("👤 Costurero - Usuario cargado:", data);
          setUsuario(data);
        })
        .catch((err) => console.error("❌ Costurero - Error al cargar usuario:", err));
    }

    // Cargar inventario de insumos
    cargarInsumos();
  }, [usuarioId]);

  const cargarInsumos = async () => {
    try {
      console.log("🔄 Costurero - Intentando cargar insumos...");
      const response = await fetch("http://localhost:8000/api/inventario/insumos/");
      
      if (!response.ok) {
        console.error("❌ Costurero - Error en la respuesta:", response.status, response.statusText);
        return;
      }
      
      const data = await response.json();
      
      

      // Calcular bajo stock (muy relevante para el Costurero)
      const bajos = data.filter((item) => item.Insumo_cantidad < item.Insumo_cantidad_minima).length;
      console.log("⚠️ Costurero - Insumos bajo stock:", bajos);
      setBajoStock(bajos);
      
      console.log("✅ Costurero - Insumos cargados correctamente");
    } catch (error) {
      console.error("❌ Costurero - Error cargando insumos:", error);
    }
  };

  // Preparar datos para el gráfico de distribución de insumos
  const datosGrafico = insumos.map((item) => ({
    name: item.Insumo_nombre,
    value: item.Insumo_cantidad,
  }));

  const styles = {
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
      {/* Componente es la barra de navegación que debe tener los enlaces: Insumos, Prendas, Perfil */}
      <Componente onToggle={setIsNavbarCollapsed} />

      <main style={styles.insumosContainer}>
        <div style={styles.contentWrapper}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              ¡Bienvenido Costurero!{" "}
              {usuario
                ? `${usuario.Usuario_nombre} ${usuario.Usuario_apellido}`
                : ""}
            </h2>
          </div>

          {/* Resumen General de Insumos */}
          <section style={{ marginBottom: "40px" }}>
            <h3 style={{ ...styles.title, fontSize: "20px", marginBottom: "8px" }}>
              Inventario de Insumos Clave
            </h3>
            <p style={styles.subtitle}>
              Visión general del stock y distribución de los insumos que utilizas.
            </p>

            <div style={styles.resumenGrid}>
              {/* Card 1: Valor Total - Menos relevante, pero puede indicar inversión */}
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Valor Total del Stock de Insumo</h4>
                <p style={styles.cardValue}>
                  ${totalValor.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Card 2: Artículos Bajo Stock - Muy relevante para el Costurero */}
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Artículos en Bajo Stock</h4>
                <p style={styles.cardValue}>{bajoStock}</p>
              </div>

              {/* Card 3: Gráfico de Distribución */}
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Distribución de Cantidad por Insumo</h4>
                {datosGrafico.length > 0 ? (
                  <div style={styles.graficoContainer}>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={datosGrafico}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {datosGrafico.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
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

          {/* Alertas Recientes */}
          <section style={styles.alertasSection}>
            <h3 style={styles.alertasTitle}>Alertas Recientes</h3>
            <ul style={styles.alertasList}>
              {bajoStock > 0 ? (
                <li
                  style={{
                    ...styles.alertaItem,
                    borderLeftColor: "#e74c3c",
                  }}
                >
                  ⚠️ ¡Atención! {bajoStock} artículos con bajo stock.
                </li>
              ) : (
                <li
                  style={{
                    ...styles.alertaItem,
                    borderLeftColor: "#2ecc71",
                  }}
                >
                  ✅ Stock adecuado: Todos los insumos clave están disponibles.
                </li>
              )}
              <li
                style={{
                  ...styles.alertaItem,
                  borderLeftColor: "#3498db",
                }}
              >
                ℹ️ Recuerda verificar el estado de las prendas en producción.
              </li>
              <li
                style={{
                  ...styles.alertaItem,
                  borderLeftColor: "#f39c12",
                }}
              >
                📝 Tienes 2 prendas pendientes de revisión.
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Costurero;