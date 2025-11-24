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
        console.log(
          "Costurero: cargando pedidos con estado=PENDIENTE_COSTURERO…"
        );
        setIsLoading(true);

        const response = await fetch(
          "http://localhost:8000/api/pedidos/?estado=PENDIENTE_COSTURERO"
        );

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

        setPedidos(Array.isArray(data) ? data : []);

        // Pendientes actuales (ya vienen filtrados por estado)
        setPendientesCostura(Array.isArray(data) ? data.length : 0);

        // Completados hoy (tomados del listado general si lo quisieras
        // pero por ahora 0 porque este endpoint solo trae pendientes)
        const hoy = new Date().toISOString().slice(0, 10);
        const completados = (Array.isArray(data) ? data : []).filter(
          (p) =>
            p.Pedido_estado === "COMPLETADO" &&
            p.Pedido_fecha &&
            p.Pedido_fecha.startsWith(hoy)
        );
        setCompletadosHoy(completados.length);
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
      const refreshed = await fetch(
        "http://localhost:8000/api/pedidos/?estado=PENDIENTE_COSTURERO"
      );
      const data = await refreshed.json();
      setPedidos(Array.isArray(data) ? data : []);
      setPendientesCostura(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("❌ Error en actualización:", err);
    }
  };

  // ===========================================================
  // 🔹 ESTILOS
  // ===========================================================
  const styles = {
    container: { display: "flex", minHeight: "100vh", width: "100%" },
    insumosContainer: {
      marginLeft: `${navbarWidth}px`,
      padding: "32px",
      backgroundImage: `url(${fondoImg})`,
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
      flex: 1,
      transition: "margin-left 0.3s ease",
    },
    contentWrapper: { maxWidth: "1400px", margin: "0 auto" },
    header: { marginBottom: "32px" },
    title: { fontSize: "36px", fontWeight: "bold", color: "#fff" },
    subtitle: { color: "#d1d5db", marginTop: "8px" },
    resumenGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "32px",
    },
    resumenCard: {
      backgroundColor: "rgba(30,30,30,0.9)",
      padding: "20px",
      borderRadius: "8px",
    },
    alertasSection: {
      backgroundColor: "rgba(30,30,30,0.9)",
      padding: "20px",
      borderRadius: "8px",
      marginTop: "40px",
    },
    alertasTitle: {
      color: "#fff",
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "15px",
    },
    td: { padding: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" },
  };

  return (
    <div style={styles.container}>
      <Componente onToggle={setIsNavbarCollapsed} />

      <main style={styles.insumosContainer}>
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
          <section>
            <h3 style={{ ...styles.title, fontSize: "22px" }}>
              Resumen de Tareas
            </h3>

            <div style={styles.resumenGrid}>
              <div style={styles.resumenCard}>
                <h4 style={{ color: "#9ca3af" }}>Pedidos Pendientes</h4>
                <p style={{ color: "#9b59b6", fontSize: "30px" }}>
                  {isLoading ? "..." : pendientesCostura}
                </p>
              </div>

              <div style={styles.resumenCard}>
                <h4 style={{ color: "#9ca3af" }}>Pedidos Finalizados Hoy</h4>
                <p style={{ color: "#2ecc71", fontSize: "30px" }}>
                  {isLoading ? "..." : completadosHoy}
                </p>
              </div>
            </div>
          </section>

          {/* PEDIDOS ASIGNADOS */}
          <section style={styles.alertasSection}>
            <h3 style={styles.alertasTitle}>Pedidos Asignados (En Progreso)</h3>

            {isLoading ? (
              <p style={{ color: "#9ca3af", textAlign: "center" }}>
                Cargando pedidos...
              </p>
            ) : pedidos.length > 0 ? (
              <table
                style={{ width: "100%", color: "#fff", fontSize: "14px" }}
              >
                <thead>
                  <tr style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Cant.</th>
                    <th>Estado</th>
                    
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

                      <td
                        style={{
                          ...styles.td,
                          color: getStatusColor(pedido.Pedido_estado),
                        }}
                      >
                        {pedido.Pedido_estado.replace("_", " ")}
                      </td>

                      
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "#9ca3af" }}>
                No hay pedidos asignados actualmente.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Costurero;
