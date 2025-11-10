import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  AlertCircle,
  Package,
  Plus,
  Trash2,
  X,
  Search,
  XCircle
} from "lucide-react";
import Componente from "./componente.jsx";
import fondoImg from "./assets/fondo.png";
import { useAuth } from "../context/AuthContext";

// (Todos los estilos de RealizarPedido.js están copiados aquí)
const styles = {
  container: {
    padding: "32px",
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transition: "margin-left 0.3s ease"
  },
  contentWrapper: {
    maxWidth: "1400px",
    margin: "0 auto"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px"
  },
  headerLeft: {
    flex: 1
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "8px"
  },
  subtitle: {
    fontSize: "16px",
    color: "#d1d5db"
  },
  btnRealizarPedido: {
    backgroundColor: "#ffd70f",
    color: "#000",
    padding: "12px 30px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    transition: "all 0.2s"
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
  btnBuscar: {
    padding: "10px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px"
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
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  th: {
    padding: "16px",
    textAlign: "left",
    color: "#9ca3af",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
  },
  td: {
    padding: "16px",
    color: "#fff",
    fontSize: "14px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
  },
  btnVerDetalles: {
    padding: "6px 16px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500"
  },
  btnCancelar: {
    padding: "6px 16px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  btnEliminar: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#ef4444",
    padding: "4px"
  },
  estadoBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block"
  },
  estadoPendiente: {
    backgroundColor: "#fbbf24",
    color: "#000"
  },
  estadoEnProceso: {
    backgroundColor: "#3b82f6",
    color: "#fff"
  },
  estadoCompletado: {
    backgroundColor: "#10b981",
    color: "#fff"
  },
  estadoCancelado: {
    backgroundColor: "#ef4444",
    color: "#fff"
  },
  actionsContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center"
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
    border: "1px solid rgba(255, 215, 15, 0.3)",
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
    color: "#ffd70f"
  },
  btnClose: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    padding: "4px"
  },
  searchPrendaContainer: {
    position: "relative",
    marginBottom: "24px"
  },
  searchPrendaInput: {
    width: "100%",
    padding: "14px 45px 14px 14px",
    borderRadius: "10px",
    border: "1px solid #4b5563",
    backgroundColor: "rgba(0,0,0,0.4)",
    color: "#fff",
    fontSize: "15px",
    boxSizing: "border-box"
  },
  searchIcon: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af"
  },
  prendasGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
    maxHeight: "500px",
    overflowY: "auto",
    padding: "8px",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "12px"
  },
  prendaCard: {
    backgroundColor: "rgba(30,30,30,0.8)",
    border: "2px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  prendaCardSelected: {
    backgroundColor: "rgba(255,215,15,0.15)",
    border: "2px solid #ffd70f",
    transform: "scale(1.03)",
    boxShadow: "0 4px 12px rgba(255,215,15,0.3)"
  },
  prendaImage: {
    width: "100%",
    height: "140px",
    objectFit: "cover"
  },
  prendaInfo: {
    padding: "12px",
    textAlign: "center"
  },
  prendaNombre: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "4px"
  },
  prendaDetalle: {
    color: "#9ca3af",
    fontSize: "11px",
    marginBottom: "2px"
  },
  prendaPrecio: { // Vendedor no ve precio
    display: "none" 
  },
  formContainer: {
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    alignItems: "end"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  label: {
    color: "#d1d5db",
    fontSize: "13px",
    fontWeight: "500"
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #4b5563",
    backgroundColor: "rgba(0,0,0,0.4)",
    color: "#fff",
    fontSize: "14px",
    boxSizing: "border-box"
  },
  selectTalle: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #4b5563",
    backgroundColor: "rgba(0,0,0,0.4)",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    boxSizing: "border-box",
    width: "100%"
  },
  addBtn: {
    backgroundColor: "#ffd70f",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    color: "#000"
  },
  pedidosList: {
    marginTop: "20px"
  },
  pedidoCard: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "14px 20px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "white"
  },
  pedidoInfo: {
    flex: 1
  },
  pedidoNombre: {
    fontWeight: "600",
    fontSize: "14px"
  },
  pedidoDetalles: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "4px"
  },
  pedidoPrecio: { // Vendedor no ve precio
    display: "none"
  },
  resultadoContainer: {
    backgroundColor: "rgba(30, 30, 30, 0.8)",
    borderRadius: "12px",
    padding: "24px",
    marginTop: "20px",
    border: "1px solid rgba(255, 215, 15, 0.3)"
  },
  btnConfirmar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "14px 40px",
    backgroundColor: "#10b981",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px"
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
  alertSuccess: { backgroundColor: "#10b981", color: "#fff" },
  alertError: { backgroundColor: "#ef4444", color: "#fff" },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#9ca3af"
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
  }
};

export default function VendedorPedidos() { // ✅ Nombre cambiado
  const { user, loading } = useAuth();

  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [prendas, setPrendas] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [selectedPrenda, setSelectedPrenda] = useState(null);
  const [searchPrenda, setSearchPrenda] = useState("");
  const [formData, setFormData] = useState({
    cantidad: 1,
    talle: "",
    tipo: "LISA"
    // ✅ Eliminados recargoTalle y porcentajeGanancia
  });
  const [filtros, setFiltros] = useState({
    id: "",
    estado: "PENDIENTE_DUENO", // ✅ Estado por defecto para Vendedor
    fecha: ""
  });
  const [alert, setAlert] = useState(null);
  // ✅ Eliminado 'resultado'
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);

  // ✅ Eliminado 'isVendedor', este componente es SÓLO para Vendedor
  const navbarWidth = isNavbarCollapsed ? 70 : 250;

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const obtenerEstadoPedido = (p) => {
    const estadoRaw = p.estado || p.Pedido_estado;
    if (typeof estadoRaw === "string") return estadoRaw.toUpperCase();
    if (estadoRaw === true) return "COMPLETADO";
    if (estadoRaw === false) return "PENDIENTE_DUENO";
    return "PENDIENTE_DUENO";
  };

  // Función de traducción de estados (sin cambios)
  const obtenerEstiloEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE_DUENO":
        return { texto: "Pendiente Aprobación", estilo: styles.estadoPendiente };
      case "APROBADO_DUENO": 
      case "PENDIENTE_COSTURERO": 
        return { texto: "Pendiente Costurero", estilo: styles.estadoPendiente };
      case "EN_PROCESO_COSTURERO": 
        return { texto: "En Proceso Costurero", estilo: styles.estadoEnProceso };
      case "PENDIENTE_ESTAMPADO":
      case "PENDIENTE_ESTAMPADOR":
        return { texto: "Pendiente Estampador", estilo: styles.estadoPendiente };
      case "EN_PROCESO_ESTAMPADO":
      case "EN_PROCESO_ESTAMPADOR":
        return { texto: "En Proceso Estampador", estilo: styles.estadoEnProceso };
      case "COMPLETADO":
        return { texto: "Completado", estilo: styles.estadoCompletado };
      case "CANCELADO":
        return { texto: "Cancelado", estilo: styles.estadoCancelado };
      default:
        return { texto: estado, estilo: styles.estadoPendiente };
    }
  };

  // Cargar prendas (sin cambios)
  useEffect(() => {
    const fetchPrendas = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/inventario/prendas/");
        setPrendas(res.data || []);
      } catch (err) {
        showAlert("Error al cargar prendas", "error");
      }
    };
    fetchPrendas();
  }, []);

  // Cargar pedidos (simplificado para Vendedor)
  useEffect(() => {
    if (loading || !user) return;

    const fetchPedidos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/pedidos/");
        const data = res.data || [];
        const pedidosNormalizados = data.map((pd) => ({
          ...pd,
          detalles: (pd.detalles || []).map((d) => ({
            ...d,
            talle: typeof d.talle === "number" ? "-" : (d.talle || "-"),
            tipo: d.tipo || "LISA"
          }))
        }));

        // ✅ Vendedor SÓLO ve sus pedidos
        let misPedidos = pedidosNormalizados.filter(p => p.Usuario === user.id);
        let filtrados = misPedidos.filter(p => 
            obtenerEstadoPedido(p) === "PENDIENTE_DUENO"
        );
        setPedidosFiltrados(filtrados);
      } catch (err) {
        showAlert("Error al cargar pedidos", "error");
      }
    };

    fetchPedidos();
  }, [user, loading]);

  const prendasFiltradas = prendas.filter((p) =>
    (p.Prenda_nombre || "").toLowerCase().includes(searchPrenda.toLowerCase()) ||
    (p.Prenda_marca_nombre || "").toLowerCase().includes(searchPrenda.toLowerCase()) ||
    (p.Prenda_modelo_nombre || "").toLowerCase().includes(searchPrenda.toLowerCase())
  );

  // Agregar prenda (simplificado sin precio)
  const agregarPrenda = () => {
    if (!selectedPrenda) {
      showAlert("Seleccioná una prenda", "error");
      return;
    }
    if (!formData.talle) {
      showAlert("Seleccioná un talle", "error");
      return;
    }

    const prendaBase = prendas.find((p) => p.Prenda_ID === selectedPrenda.Prenda_ID);
    if (!prendaBase) return;

    // ✅ Vendedor no maneja precios
    const nueva = {
      ...prendaBase,
      cantidad: Number(formData.cantidad) || 1,
      talle: formData.talle,
      tipo: formData.tipo,
      // (precioUnitario eliminado)
    };

    setPedido((prev) => [...prev, nueva]);
    setSelectedPrenda(null);
    setFormData((prev) => ({ ...prev, cantidad: 1, talle: "" }));
  };

  const eliminarPrendaPedido = (index) => {
    setPedido((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Eliminada función 'calcularTotales'

  // Verificar stock (sin cambios)
  // En VendedorPedidos.js

const verificarStockAntesDeConfirmar = async () => {
    try {
      const prendasConCantidades = pedido.map((p) => ({
        id_prenda: p.Prenda_ID,
        cantidad: p.cantidad
      }));

      // Esta llamada espera un 200 OK (stock suficiente)
      await axios.post("http://localhost:8000/api/inventario/verificar-stock/", {
        prendas: prendasConCantidades
      });

      // Si todo está OK, la respuesta es 200 y devolvemos true
      return true;

    } catch (error) {
      // Si el servidor responde 400 (Bad Request), entra aquí
      if (error.response && error.response.data) {
        const data = error.response.data;

        // ======================================================
        // AQUÍ ESTÁ EL CAMBIO QUE PEDISTE
        // ======================================================
        // Caso 1: Error de "insumos_insuficientes"
        if (data.insumos_insuficientes && data.insumos_insuficientes.length > 0) {
          // Mostramos la ALERTA GENERAL en lugar de los detalles
          showAlert(`❌ No hay stock suficiente para procesar este pedido.`, "error");
          return false; // No se puede continuar
        }
        // ======================================================

        // Caso 2: Otro error 400 (ej: "Prenda no encontrada")
        if (data.error) {
          showAlert(`Error al verificar: ${data.error}`, "error");
          return false;
        }
      }

      // Caso 3: Error de red u otro error inesperado
      showAlert("Error al conectar con el servidor para verificar stock", "error");
      return false;
    }
  };
  // ✅ NUEVA FUNCIÓN CENTRALIZADA PARA RECARGAR
  const recargarPedidosFiltrados = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/pedidos/");
      const data = res.data || [];

      // 1. Obtener solo mis pedidos
      let misPedidos = data.filter(p => p.Usuario === user.id);

      // 2. Aplicar el filtro de estado actual
      if (filtros.estado && filtros.estado !== "") {
        misPedidos = misPedidos.filter(p => obtenerEstadoPedido(p) === filtros.estado);
      }
      
      setPedidosFiltrados(misPedidos);

    } catch (err) {
      showAlert("Error al recargar la lista de pedidos", "error");
    }
  };
  // Confirmar pedido (simplificado para Vendedor)
  const confirmarPedido = async () => {
    if (loading || !user || !user.id) {
      showAlert("Error: Usuario no autenticado o no cargado.", "error");
      return;
    }
    const stockOk = await verificarStockAntesDeConfirmar();
    if (!stockOk) return;

    try {
      // ✅ Vendedor SIEMPRE crea como PENDIENTE_DUENO
      let estadoInicial = "PENDIENTE_DUENO";
      const data = {
        usuario: user.id,
        estado: estadoInicial,
        prendas: pedido.map((p) => ({
          id_prenda: p.Prenda_ID,
          cantidad: p.cantidad,
          talle: p.talle,
          tipo: p.tipo || "LISA"
        }))
      };
      // ✅ Eliminada 'porcentaje_ganancia'

      await axios.post("http://localhost:8000/api/pedidos/", data);

      showAlert("✅ Pedido realizado correctamente y enviado para aprobación", "success");

      recargarPedidosFiltrados();
      // ✅ Eliminado 'setResultado'
      setModalOpen(false);
    } catch (err) {
      const responseData = err.response?.data || {};
      if (responseData.tipo === "stock_insuficiente") {
        showAlert(`❌ Stock insuficiente:\n\n${(responseData.mensajes || []).join("\n")}`, "error");
      } else {
        showAlert(`❌ Error: ${err.response?.data?.error || "Error al realizar pedido"}`, "error");
      }
    }
  };

  // Buscar pedidos (simplificado para Vendedor)
  const buscarPedidos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/pedidos/");
      const data = res.data || [];
      
      // ✅ Vendedor SÓLO ve sus pedidos
      let filtrados = data.filter(p => p.Usuario === user.id);

      if (filtros.id && filtros.id.trim() !== "") {
        filtrados = filtrados.filter((p) => String(p.Pedido_ID || p.id || "").includes(filtros.id.trim()));
      }
      if (filtros.estado && filtros.estado !== "") {
        filtrados = filtrados.filter((p) => obtenerEstadoPedido(p) === filtros.estado);
      }
      if (filtros.fecha && filtros.fecha !== "") {
        filtrados = filtrados.filter((p) => {
          if (!p.Pedido_fecha) return false;
          return p.Pedido_fecha.split("T")[0] === filtros.fecha;
        });
      }
      setPedidosFiltrados(filtrados);
      if (filtrados.length === 0) showAlert("No se encontraron pedidos con los filtros aplicados", "error");
    } catch (err) {
      showAlert("Error al buscar pedidos", "error");
    }
  };

  // Limpiar filtros (simplificado para Vendedor)
  const limpiarFiltros = async () => {
    setFiltros({ id: "", estado: "PENDIENTE_DUENO", fecha: "" }); // ✅ Resetea a "Pendiente"
    try {
      const res = await axios.get("http://localhost:8000/api/pedidos/");
      
      let misPedidos = (res.data || []).filter(p => p.Usuario === user.id);
      let pedidosRecargados = misPedidos.filter(p => 
          obtenerEstadoPedido(p) === "PENDIENTE_DUENO"
      );
      setPedidosFiltrados(pedidosRecargados);
      showAlert("Filtros limpiados", "success");
    } catch {
      showAlert("Error al limpiar filtros", "error");
    }
  };

  // Cancelar pedido (sin cambios)
  const cancelarPedido = async (id) => {
    if (!window.confirm("¿Estás seguro de cancelar este pedido?")) return;
    try {
      await axios.patch(`http://localhost:8000/api/pedidos/${id}/`, { Pedido_estado: "CANCELADO" });
      showAlert("✅ Pedido cancelado correctamente", "success");

      recargarPedidosFiltrados(); // ✅ USA LA NUEVA FUNCIÓN

    } catch {
      showAlert("❌ Error al conectar con el servidor", "error");
    }
  };

  // Ver detalles (simplificado sin precio)
  const verDetallesPedido = async (p) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/pedidos/${p.Pedido_ID || p.id}/`);
      setPedidoSeleccionado(res.data);
      setModalDetallesOpen(true);
    } catch {
      showAlert("❌ Error al cargar detalles del pedido", "error");
    }
  };

  const tallesDisponibles = selectedPrenda ? (selectedPrenda.talles || selectedPrenda.Prenda_talles || []) : [];

  if (loading) {
    return <div style={{ color: "white", padding: "50px" }}>Cargando usuario y permisos...</div>;
  }

  return (
    <>
      <Componente onToggle={setIsNavbarCollapsed} />
      <div
        style={{
          ...styles.container,
          backgroundImage: `url(${fondoImg})`,
          marginLeft: isNavbarCollapsed ? "70px" : "250px"
        }}
      >
        <div style={styles.contentWrapper}>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <h1 style={styles.title}>Mis Pedidos</h1>
              <p style={styles.subtitle}>
                Crea y da seguimiento a tus pedidos
              </p>
            </div>
            <button style={styles.btnRealizarPedido} onClick={() => setModalOpen(true)}>
              Realizar Pedido
            </button>
          </div>

          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar por ID..."
              value={filtros.id}
              onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
              style={styles.searchInput}
            />
            {/* ✅ Filtro simplificado solo para Vendedor */}
            <select value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })} style={styles.select}>
                <option value="">Mis Pedidos (Todos)</option>
                <option value="PENDIENTE_DUENO">Pendiente Aprobación</option>
                <option value="PENDIENTE_COSTURERO">Pendiente Costurero</option>
                <option value="EN_PROCESO_COSTURERO">En Proceso Costurero</option>
                <option value="PENDIENTE_ESTAMPADO">Pendiente Estampador</option>
                <option value="EN_PROCESO_ESTAMPADO">En Proceso Estampador</option>
                <option value="COMPLETADO">Completado</option>
                <option value="CANCELADO">Cancelado</option>
            </select>

            {/* ✅ Eliminado filtro de fecha */}

            <button style={styles.btnBuscar} onClick={buscarPedidos}><Search size={18} /> Buscar</button>
            <button style={styles.btnLimpiar} onClick={limpiarFiltros}><X size={18} /> Limpiar</button>
          </div>

          {pedidosFiltrados.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Pedido ID</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Fecha</th>
                    {/* ✅ Eliminada columna 'Detalles' */}
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((p) => {
                    const estado = obtenerEstadoPedido(p);
                    const { texto, estilo } = obtenerEstiloEstado(estado);
                    return (
                      <tr key={p.Pedido_ID || p.id}>
                        <td style={styles.td}>PED{String(p.Pedido_ID || p.id || "").padStart(3, "0")}</td>
                        <td style={styles.td}><span style={{ ...styles.estadoBadge, ...estilo }}>{texto}</span></td>
                        <td style={styles.td}>{p.Pedido_fecha ? new Date(p.Pedido_fecha).toLocaleDateString() : "-"}</td>
                        
                        {/* ✅ Eliminada celda 'Detalles' */}

                        {/* ✅ Acciones simplificadas para Vendedor */}
                        <td style={styles.td}>
                          <div style={styles.actionsContainer}>
                            {p.usuario === user.id && estado === "PENDIENTE_DUENO" && (
                              <button style={styles.btnCancelar} onClick={() => cancelarPedido(p.Pedido_ID || p.id)} title="Cancelar pedido">
                                <XCircle size={16} /> Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <Package size={64} color="#4b5563" />
              <h3 style={{ marginTop: "16px", color: "#9ca3af" }}>No has realizado pedidos</h3>
              <p style={{ color: "#6b7280" }}>Usa el botón "Realizar Pedido" para crear tu primero.</p>
            </div>
          )}

          {/* ----- INICIO MODAL CREAR PEDIDO ----- */}
          {modalOpen && (
            <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Realizar Nuevo Pedido</h2>
                  <button style={styles.btnClose} onClick={() => setModalOpen(false)}><X size={24} /></button>
                </div>

                <div style={styles.searchPrendaContainer}>
                  <input type="text" placeholder="🔍 Buscar prenda por nombre, marca o modelo..." value={searchPrenda} onChange={(e) => setSearchPrenda(e.target.value)} style={styles.searchPrendaInput} />
                  <Search style={styles.searchIcon} size={20} />
                </div>

                {searchPrenda.trim() !== "" && (
                  prendasFiltradas.length > 0 ? (
                    <div style={styles.prendasGrid}>
                      {prendasFiltradas.map((prenda) => {
                        const imagenUrl = prenda.Prenda_imagen ? (prenda.Prenda_imagen.startsWith("http") ? prenda.Prenda_imagen : `http://localhost:8000${prenda.Prenda_imagen}`) : "https://via.placeholder.com/160x140?text=Sin+Imagen";
                        return (
                          <div key={prenda.Prenda_ID} style={{ ...styles.prendaCard, ...(selectedPrenda?.Prenda_ID === prenda.Prenda_ID ? styles.prendaCardSelected : {}) }} onClick={() => setSelectedPrenda(prenda)}>
                            <img src={imagenUrl} alt={prenda.Prenda_nombre} style={styles.prendaImage} onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/160x140?text=Sin+Imagen"; }} />
                            <div style={styles.prendaInfo}>
                              <div style={styles.prendaNombre}>{prenda.Prenda_nombre}</div>
                              <div style={styles.prendaDetalle}>{prenda.Prenda_marca_nombre || "Sin marca"}</div>
                              <div style={styles.prendaDetalle}>{prenda.Prenda_modelo_nombre || "Sin modelo"}</div>
                              {/* ✅ Eliminado precio de la tarjeta */}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", backgroundColor: "rgba(30,30,30,0.6)", borderRadius: "12px", marginBottom: "24px" }}>
                      <Package size={48} color="#4b5563" style={{ margin: "0 auto 12px" }} />
                      <p style={{ margin: 0 }}>No se encontraron prendas con "{searchPrenda}"</p>
                    </div>
                  )
                )}

                {selectedPrenda && (
                  <div style={styles.formContainer}>
                    <div style={styles.formGrid}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Talle</label>
                        <select value={formData.talle} onChange={(e) => setFormData({ ...formData, talle: e.target.value })} style={styles.selectTalle}>
                          <option value="">Seleccionar talle...</option>
                          {tallesDisponibles.map((t, i) => <option key={i} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Tipo</label>
                        <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} style={styles.selectTalle}>
                          <option value="LISA">LISA</option>
                          <option value="ESTAMPADA">ESTAMPADA</option>
                        </select>
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Cantidad</label>
                        <input type="number" min="1" value={formData.cantidad} onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })} style={styles.input} />
                      </div>

                      {/* ✅ Eliminado Recargo XL */}

                      <div>
                        <button onClick={agregarPrenda} style={{ ...styles.addBtn, gridColumn: "span 1" }}><Plus size={18} /> Agregar</button>
                      </div>
                    </div>
                  </div>
                )}

                {pedido.length > 0 && (
                  <div style={styles.pedidosList}>
                    <h3 style={{ color: "#fff", marginBottom: "12px", fontSize: "18px" }}>Prendas en el pedido ({pedido.length})</h3>
                    {pedido.map((p, idx) => (
                      <div key={idx} style={styles.pedidoCard}>
                        <div style={styles.pedidoInfo}>
                          <div style={styles.pedidoNombre}>{p.Prenda_nombre}</div>
                          <div style={styles.pedidoDetalles}>
                            Talle: {p.talle} | Cantidad: {p.cantidad}
                            {/* ✅ Eliminado precio unitario */}
                          </div>
                        </div>

                        {/* ✅ Eliminado precio total del item */}

                        <button onClick={() => eliminarPrendaPedido(idx)} style={styles.btnEliminar}><Trash2 size={18} /></button>
                      </div>
                    ))}

                    {/* ✅ Eliminado cálculo de ganancia y totales */}

                    {/* ✅ Simplificado contenedor de confirmación */}
                    <div style={styles.resultadoContainer}>
                      <p style={{ color: "#d1d5db", textAlign: "center", marginBottom: "16px" }}>El precio final se calculará automáticamente en el sistema central.</p>
                      <button onClick={confirmarPedido} style={styles.btnConfirmar}><CheckCircle size={20} /> Confirmar Pedido</button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}
          {/* ----- FIN MODAL CREAR PEDIDO ----- */}


          {/* ----- INICIO MODAL DETALLES (Simplificado) ----- */}
          {modalDetallesOpen && pedidoSeleccionado && (
            <div style={styles.modalOverlay} onClick={() => setModalDetallesOpen(false)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Detalles del Pedido PED{String(pedidoSeleccionado.Pedido_ID || pedidoSeleccionado.id || "").padStart(3, "0")}</h2>
                  <button style={styles.btnClose} onClick={() => setModalDetallesOpen(false)}><X size={24} /></button>
                </div>

                {/* ✅ Eliminado infoBox de Usuario (es obvio que es él) */}

                <div style={{ backgroundColor: "rgba(30, 30, 30, 0.6)", borderRadius: "12px", padding: "20px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Estado</div>
                      {(() => {
                        const est = obtenerEstadoPedido(pedidoSeleccionado);
                        const { texto, estilo } = obtenerEstiloEstado(est);
                        return <span style={{ ...styles.estadoBadge, ...estilo }}>{texto}</span>;
                      })()}
                    </div>

                    <div>
                      <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Fecha</div>
                      <div style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>
                        {pedidoSeleccionado.Pedido_fecha ? new Date(pedidoSeleccionado.Pedido_fecha).toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" }) : "-"}
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

                <h3 style={{ color: "#fff", marginBottom: "16px", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}><Package size={20} /> Prendas del Pedido</h3>

                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {pedidoSeleccionado.detalles && pedidoSeleccionado.detalles.length > 0 ? (
                    pedidoSeleccionado.detalles.map((detalle, index) => (
                      <div key={index} style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "16px", borderRadius: "12px", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "16px" }}>
                        <img src={detalle.prenda_imagen ? (detalle.prenda_imagen.startsWith("http") ? detalle.prenda_imagen : `http://localhost:8000${detalle.prenda_imagen}`) : "https://via.placeholder.com/100x100?text=Sin+Imagen"} alt={detalle.prenda_nombre} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }} onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/100x100?text=Sin+Imagen"; }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#fff", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>{detalle.prenda_nombre}</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px", fontSize: "13px", color: "#9ca3af" }}>
                            <div>Marca: {detalle.prenda_marca || "-"}</div>
                            <div>Modelo: {detalle.prenda_modelo || "-"}</div>
                            <div>Color: {detalle.prenda_color || "-"}</div>
                            <div>Talle: {detalle.talle_nombre || detalle.talle || "-"}</div>
                            <div>Cantidad: {detalle.cantidad}</div>
                          </div>
                        </div>

                        {/* ✅ Eliminado bloque de precios */}
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", backgroundColor: "rgba(30,30,30,0.6)", borderRadius: "12px" }}>
                      <AlertCircle size={48} style={{ margin: "0 auto 12px" }} />
                      <p>No hay detalles disponibles para este pedido</p>
                    </div>
                  )}
                </div>

                {/* ✅ Eliminado bloque de totales finales */}
              </div>
            </div>
          )}
          {/* ----- FIN MODAL DETALLES ----- */}


          {alert && (
            <div style={{ ...styles.alert, ...(alert.type === "success" ? styles.alertSuccess : styles.alertError) }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
                {alert.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <div style={{ flex: 1, fontSize: "14px", lineHeight: "1.5" }}>{alert.message}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};