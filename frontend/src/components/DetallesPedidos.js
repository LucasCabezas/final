import React, { useState, useEffect } from "react";
import { Eye, Trash2, ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Componente from "./componente.jsx";
import fondoImg from "./assets/fondo.png";

const styles = {
  container: {
    padding: "32px",
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transition: "margin-left 0.3s ease",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "rgba(30,30,30,0.9)",
    borderRadius: "16px",
    padding: "24px",
    color: "#fff",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#ccc",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    fontSize: "14px",
    color: "#facc15",
  },
  td: {
    padding: "14px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "14px",
  },
  status: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "12px",
  },
  pendiente: { backgroundColor: "#facc15", color: "#000" },
  aceptado: { backgroundColor: "#10b981", color: "#fff" },
  rechazado: { backgroundColor: "#ef4444", color: "#fff" },
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
  },
  volverBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "8px",
    color: "#000",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default function DetallePedidos() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/pedidos/");
        const data = await res.json();
        setPedidos(data);
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const getStatusStyle = (estado) => {
    if (estado === "Pendiente") return styles.pendiente;
    if (estado === "Aceptado") return styles.aceptado;
    if (estado === "Rechazado") return styles.rechazado;
    return {};
  };

  return (
    <>
      <Componente onToggle={setIsNavbarCollapsed} />
      <div
        style={{
          ...styles.container,
          backgroundImage: `url(${fondoImg})`,
          marginLeft: isNavbarCollapsed ? "70px" : "250px",
        }}
      >
        <div style={styles.content}>
          <h1 style={styles.title}>Aprobación de pedidos</h1>
          <p style={styles.subtitle}>Lista de los últimos pedidos pendientes por aprobar</p>

          {loading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Loader2 className="animate-spin" size={32} />
              <p>Cargando pedidos...</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Pedido ID</th>
                  <th style={styles.th}>Cantidad</th>
                  <th style={styles.th}>Detalles</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.Pedido_ID}>
                    <td style={styles.td}>{p.Pedido_ID}</td>
                    <td style={styles.td}>
                      {p.detalles?.reduce((acc, d) => acc + d.cantidad, 0) || "-"}
                    </td>
                    <td style={styles.td}>
                      {p.detalles?.map((d) => (
                        <span key={d.id}>
                          {d.prenda_nombre} | {d.tipo} | {d.talle_nombre} <br />
                        </span>
                      )) || "Sin detalles"}
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.status, ...getStatusStyle(p.estado || "Pendiente") }}>
                        {p.estado || "Pendiente"}
                      </span>
                    </td>
                    <td style={styles.td}>{p.Pedido_fecha}</td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn} title="Ver detalle">
                        <Eye color="#facc15" />
                      </button>
                      <button style={styles.actionBtn} title="Aceptar">
                        <CheckCircle color="#22c55e" />
                      </button>
                      <button style={styles.actionBtn} title="Rechazar">
                        <XCircle color="#ef4444" />
                      </button>
                      <button style={styles.actionBtn} title="Eliminar">
                        <Trash2 color="#f87171" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button onClick={() => window.history.back()} style={styles.volverBtn}>
            <ArrowLeft size={18} /> Volver
          </button>
        </div>
      </div>
    </>
  );
}
