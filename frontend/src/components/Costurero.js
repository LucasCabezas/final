import React, { useState, useEffect } from "react";
import Componente from "./componente.jsx";
import fondoImg from "./assets/fondo.png";

function Costurero({ usuarioId }) {
  const [usuario, setUsuario] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [totalValor, setTotalValor] = useState(0);
  const [bajoStock, setBajoStock] = useState(0);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [pendientesCostura, setPendientesCostura] = useState(0);
  const [completadosHoy, setCompletadosHoy] = useState(0);
  const [pedidos, setPedidos] = useState([]);

  // Colores para estados
  const getStatusColor = (estado) => {
    switch (estado) {
      case "PENDIENTE_COSTURERO":
        return "#f39c12";
      case "EN_PROCESO_COSTURERO":
        return "#3498db";
      case "PENDIENTE_ESTAMPADO":
        return "#9b59b6";
      case "COMPLETADO":
        return "#2ecc71";
      default:
        return "#95a5a6";
    }
  };

  const navbarWidth = isNavbarCollapsed ? 70 : 250;

  // ===========================================================
  // 🔹 CARGA USUARIO (SI HAY usuarioId)
  // ===========================================================
  useEffect(() => {
    if (!usuarioId) {
      console.log("Costurero: sin usuarioId, solo panel visual.");
      return;
    }

    const fetchUsuario = async () => {
      try {
        console.log("Costurero: cargando usuario", usuarioId);
        const response = await fetch(
          `http://localhost:8000/api/usuarios/${usuarioId}/`
        );
        const data = await response.json();
        console.log("Costurero: usuario recibido", data);
        setUsuario(data);
      } catch (error) {
        console.error("❌ Error cargando usuario:", error);
      }
    };

    fetchUsuario();
  }, [usuarioId]);

  // ===========================================================
  // 🔹 CARGA INSUMOS (SOLO COSTURA)
  // ===========================================================
  useEffect(() => {
    const cargarInsumos = async () => {
      try {
        console.log("Costurero: cargando insumos…");
        const response = await fetch(
          "http://localhost:8000/api/inventario/insumos/"
        );
        const data = await response.json();

        const insumosCostura = data.filter(
          (i) => i.tipo_insumo?.nombre === "Costura"
        );
        setInsumos(insumosCostura);

        const total = insumosCostura.reduce(
          (acc, item) =>
            acc + item.Insumo_cantidad * item.Insumo_precio_unitario,
          0
        );
        setTotalValor(total);

        const bajos = insumosCostura.filter(
          (i) => i.Insumo_cantidad < i.Insumo_cantidad_minima
        ).length;
        setBajoStock(bajos);

        console.log(
          `Costurero: insumos costura = ${insumosCostura.length}, bajo stock = ${bajos}`
        );
      } catch (error) {
        console.error("❌ Error cargando insumos:", error);
      }
    };

    cargarInsumos();
  }, []);

  // ===========================================================
  // 🔹 CARGA PEDIDOS DE COSTURA
  // ===========================================================
  useEffect(() => {
    const cargarPedidosCostura = async () => {
      try {
        console.log("Costurero: cargando todos los pedidos…");
        setIsLoading(true);

        const response = await fetch("http://localhost:8000/api/pedidos/");

        console.log("Costurero: response status", response.status);

        if (!response.ok) {
          console.error("❌ Error HTTP al cargar pedidos");
          setPedidos([]);
          setPendientesCostura(0);
          setCompletadosHoy(0);
          return;
        }

        const data = await response.json();
        console.log("Costurero: pedidos recibidos", data);

        // Filtrar pedidos pendientes de costura
        const pendientes = data.filter(
          (p) => p.Pedido_estado === "PENDIENTE_COSTURERO" || 
                 p.Pedido_estado === "EN_PROCESO_COSTURERO"
        );
        setPedidos(pendientes);
        setPendientesCostura(pendientes.length);

        // Contar TODOS los pedidos finalizados (COMPLETADO o enviados a ESTAMPADO)
        const finalizados = data.filter(
          (p) => p.Pedido_estado === "COMPLETADO" || 
                 p.Pedido_estado === "PENDIENTE_ESTAMPADO"
        );
        setCompletadosHoy(finalizados.length);

      } catch (err) {
        console.error("❌ Error cargando pedidos costura:", err);
        setPedidos([]);
        setPendientesCostura(0);
        setCompletadosHoy(0);
      } finally {
        setIsLoading(false);
      }
    };

    cargarPedidosCostura();
  }, []);

  // ===========================================================
  // 🔹 Enviar pedido a ESTAMPADO
  // ===========================================================
  const actualizarEstadoPedido = async (id) => {
    try {
      console.log("Costurero: enviando pedido a estampado", id);
      const res = await fetch(`http://localhost:8000/api/pedidos/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "PENDIENTE_ESTAMPADO" }),
      });

      if (!res.ok) {
        console.error("❌ Error al actualizar pedido:", res.status);
        return;
      }

      // recargar lista
      const refreshed = await fetch("http://localhost:8000/api/pedidos/");
      const data = await refreshed.json();
      
      const pendientes = data.filter(
        (p) => p.Pedido_estado === "PENDIENTE_COSTURERO" || 
               p.Pedido_estado === "EN_PROCESO_COSTURERO"
      );
      setPedidos(pendientes);
      setPendientesCostura(pendientes.length);
    } catch (err) {
      console.error("❌ Error en actualización:", err);
    }
  };

  // ===========================================================
  // 🔹 ESTILOS
  // ===========================================================
  const styles = {
    container: { display: "flex", minHeight: "100vh", width: "100%" },
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
    contentWrapper: { maxWidth: "1400px", margin: "0 auto" },
    header: { marginBottom: "32px" },
    title: { fontSize: "36px", fontWeight: "bold", color: "#ffffff" },
    subtitle: { color: "#d1d5db", fontSize: "15px", marginTop: "8px" },
    resumenGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px",
      marginBottom: "40px",
    },
    resumenCard: {
      backgroundColor: "rgba(30, 30, 30, 0.9)",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
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
      width: "100%",
      borderCollapse: "collapse",
      color: "#ffffff",
      textAlign: "left",
      marginTop: "20px",
    },
    th: {
      padding: "12px 15px",
      borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
      fontSize: "14px",
      fontWeight: "600",
      color: "#9ca3af",
      textTransform: "uppercase",
    },
    td: {
      padding: "12px 15px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.container}>
      <Componente onToggle={setIsNavbarCollapsed} />

      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          {/* HEADER */}
          <div style={styles.header}>
            <h2 style={styles.title}>
              ¡Bienvenido Costurero!{" "}
              {usuario ? `${usuario.nombre} ${usuario.apellido}` : ""}
            </h2>
            <p style={styles.subtitle}>
              Tu panel de trabajo: producción y seguimiento de prendas.
            </p>
          </div>

          {/* RESUMEN DE TAREAS */}
          <section style={{ marginBottom: "40px" }}>
            <h3 style={{ ...styles.title, fontSize: "20px", marginBottom: "8px" }}>
              Resumen de Tareas
            </h3>
            <div style={styles.resumenGrid}>
              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Pedidos Pendientes</h4>
                <p style={{ ...styles.cardValue, color: "#9b59b6" }}>
                  {isLoading ? "..." : pendientesCostura}
                </p>
                <p style={styles.subtitle}>Listos para iniciar producción.</p>
              </div>

              <div style={styles.resumenCard}>
                <h4 style={styles.cardLabel}>Pedidos Finalizados</h4>
                <p style={{ ...styles.cardValue, color: "#2ecc71" }}>
                  {isLoading ? "..." : completadosHoy}
                </p>
              </div>
            </div>
          </section>

          {/* PEDIDOS ASIGNADOS */}
          <section>
            <h3 style={{ ...styles.title, fontSize: "24px", marginBottom: "20px" }}>
              Pedidos Asignados (Pendientes o en Proceso)
            </h3>
            <p style={styles.subtitle}>
              Utiliza la sección de "Aprobación de Pedidos" para marcar como completados.
            </p>
            <div style={styles.resumenCard}>
              {isLoading ? (
                <p style={{ color: "#9ca3af", textAlign: "center" }}>
                  Cargando pedidos...
                </p>
              ) : pedidos.length > 0 ? (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Descripción</th>
                      <th style={styles.th}>Cantidad</th>
                      <th style={styles.th}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido) => (
                      <tr key={pedido.Pedido_ID}>
                        <td style={styles.td}>{pedido.Pedido_ID}</td>
                        <td style={styles.td}>
                          {pedido.detalles
                            ?.map((d) => d.prenda_nombre)
                            .join(", ") || "Sin descripción"}
                        </td>
                        <td style={styles.td}>
                          {pedido.detalles?.reduce(
                            (acc, d) => acc + d.cantidad,
                            0
                          ) || 0}
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              color: getStatusColor(pedido.Pedido_estado),
                            }}
                          >
                            {pedido.Pedido_estado
                              ? pedido.Pedido_estado.replace("_", " ")
                              : "ESTADO DESCONOCIDO"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: "#9ca3af", textAlign: "center" }}>
                  ¡Genial! No hay pedidos pendientes de costura en este momento.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Costurero;