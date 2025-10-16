import React, { useEffect, useMemo, useState } from "react";
import { Plus, X, Search, Edit2, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import Componente from "./componente.jsx";
import fondoImg from "./assets/fondo.png";

const CDN = "http://localhost:8000";

const styles = {
  container: {
    padding: "32px",
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "margin-left 0.3s ease",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 36, fontWeight: "bold", color: "#fff" },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  searchContainer: { 
    position: "relative", 
    display: "flex", 
    alignItems: "center" 
  },
  searchIcon: { 
    position: "absolute", 
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#000", 
    width: "20px", 
    height: "20px", 
    pointerEvents: "none" 
  },
  searchInput: {
    paddingLeft: "40px",
    paddingRight: "36px",
    paddingTop: "8px",
    paddingBottom: "8px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
    width: "256px",
    color: "#000",
    transition: "border-color 0.2s",
    fontSize: "14px"
  },
  clearButton: {
    position: "absolute",
    right: "8px",
    padding: "4px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#999",
    transition: "color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchCounter: {
    marginLeft: "0",
    padding: "6px 12px",
    backgroundColor: "rgba(255, 215, 15, 0.2)",
    color: "#ffd70f",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(255,215,15,1)",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "opacity 0.2s",
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", 
    gap: 20 
  },
  card: {
    backgroundColor: "rgba(30,30,30,0.95)",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    position: "relative",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  cardImage: { 
    width: "100%", 
    height: 200, 
    objectFit: "cover", 
    backgroundColor: "#1a1a1a" 
  },
  cardBody: { 
    padding: 14, 
    color: "#fff" 
  },
  cardTitle: { 
    fontWeight: 700, 
    marginBottom: 4,
    fontSize: "16px"
  },
  cardSubtitle: {
    fontSize: "13px",
    color: "#bbb",
    marginBottom: 2
  },
  price: { 
    color: "rgba(255,215,15,1)", 
    fontWeight: 700,
    marginTop: 8,
    fontSize: "15px"
  },
  cardActions: {
    position: "absolute",
    right: 8,
    top: 8,
    display: "flex",
    gap: 8,
    background: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  iconBtn: { 
    background: "transparent", 
    border: "none", 
    cursor: "pointer", 
    padding: 6, 
    borderRadius: 8, 
    transition: "background-color 0.2s" 
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  modal: {
    background: "rgba(25,25,25,0.98)",
    color: "#fff",
    width: "95%",
    maxWidth: 800,
    borderRadius: 12,
    padding: 24,
  },
  modalHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 16 
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: 800 
  },
  closeBtn: { 
    background: "none", 
    border: "none", 
    color: "#bbb", 
    cursor: "pointer", 
    transition: "background-color 0.2s",
    padding: 8,
    borderRadius: 8
  },
  input: { 
    width: "100%", 
    padding: "8px 12px", 
    borderRadius: 8, 
    border: "1px solid #4b5563", 
    background: "#fff", 
    color: "#000", 
    transition: "border-color 0.2s",
    marginBottom: 12
  },
  label: { 
    fontWeight: 600, 
    marginBottom: 6, 
    marginTop: 8,
    display: "block",
    color: "#fff"
  },
  select: { 
    flex: 2, 
    padding: 8, 
    borderRadius: 8, 
    border: "1px solid #ccc" 
  },
  smallInput: { 
    flex: 1, 
    padding: 8, 
    borderRadius: 8, 
    border: "1px solid #ccc" 
  },
  talleInput: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ccc",
    color: "#000"
  },
  removeBtn: { 
    background: "transparent", 
    border: "none", 
    color: "#f87171", 
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold"
  },
  emptyState: {
    textAlign: "center",
    padding: "64px 32px",
    color: "#9ca3af",
    fontSize: "16px",
    backgroundColor: "rgba(30,30,30,0.7)",
    borderRadius: 12
  },
  alert: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "16px 24px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    zIndex: 3000,
    minWidth: "300px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    animation: "slideIn 0.3s ease-out",
  },
  alertSuccess: {
    backgroundColor: "#10b981",
    color: "#ffffff",
  },
  alertError: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
  },
  alertText: {
    flex: 1,
    fontWeight: "500",
  },
  confirmModal: {
    backgroundColor: "rgba(30, 30, 30, 0.98)",
    borderRadius: "12px",
    padding: "28px",
    width: "100%",
    maxWidth: "420px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  confirmHeader: {
    marginBottom: "20px",
  },
  confirmTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "12px",
  },
  confirmMessage: {
    color: "#d1d5db",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  confirmActions: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  },
  confirmCancelButton: {
    flex: 1,
    padding: "10px 16px",
    backgroundColor: "#374151",
    color: "#ffffff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
    fontSize: "14px",
  },
  confirmActionButton: {
    flex: 1,
    padding: "10px 16px",
    backgroundColor: "#10b981",
    color: "#ffffff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
    fontSize: "14px",
  },
  confirmDeleteButton: {
    flex: 1,
    padding: "10px 16px",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
    fontSize: "14px",
  },
  modalFooter: {
    display: "flex",
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.1)"
  },
  cancelBtn: {
    flex: 1,
    padding: "10px 16px",
    backgroundColor: "#374151",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    transition: "background-color 0.2s"
  },
  submitBtn: {
    flex: 1,
    padding: "10px 16px",
    backgroundColor: "rgba(255,215,15,1)",
    color: "#000",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    transition: "opacity 0.2s"
  }
};

const styleSheet = `
  .hover-card:hover {
    transform: translateY(-4px);
  }
  .hover-button:hover {
    opacity: 0.9;
  }
  .hover-icon:hover {
    background-color: #4b5563;
  }
  .search-input:focus {
    border-color: rgba(255, 215, 15, 1);
  }
  .form-input:focus {
    border-color: rgba(255, 215, 15, 1);
  }
  .hover-clear:hover {
    color: #666 !important;
  }
  .hover-cancel:hover {
    background-color: #4b5563;
  }
  .hover-confirm-cancel:hover {
    background-color: #4b5563;
  }
  .hover-confirm-action:hover {
    background-color: #059669;
  }
  .hover-confirm-delete:hover {
    background-color: #dc2626;
  }
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

function Prendas() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [prendas, setPrendas] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [search, setSearch] = useState("");

  // MODALES
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detalle, setDetalle] = useState(null);

  // CONFIRMACIONES Y ALERTAS
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [alert, setAlert] = useState(null);

  // FORMULARIO
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    color: "",
    precioUnitario: "",
    imagen: null,
  });
  const [insumosPrenda, setInsumosPrenda] = useState([]);
  const [tallesPrenda, setTallesPrenda] = useState([]);

  useEffect(() => {
    cargarPrendas();
    cargarInsumos();
  }, []);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const cargarPrendas = async () => {
    try {
      const res = await fetch(`${CDN}/api/inventario/prendas/`);
      const data = await res.json();
      console.log("Prendas cargadas:", data);
      setPrendas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar prendas:", error);
      setPrendas([]);
      showAlert("Error al cargar las prendas", "error");
    }
  };

  const cargarInsumos = async () => {
    try {
      const res = await fetch(`${CDN}/api/inventario/insumos/`);
      const data = await res.json();
      setInsumos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar insumos:", error);
      setInsumos([]);
    }
  };

  const insumoPorId = useMemo(() => {
    const map = new Map();
    insumos.forEach((i) => map.set(i.Insumo_ID, i));
    return map;
  }, [insumos]);

  const prendasFiltradas = search.trim() === "" 
    ? [] 
    : prendas.filter((p) =>
        (p.Prenda_nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.Prenda_marca_nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.Prenda_modelo_nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.Prenda_color_nombre || "").toLowerCase().includes(search.toLowerCase())
      );

  const handleClearSearch = () => {
    setSearch("");
  };

  const getImageUrl = (prenda) => {
    if (prenda.Prenda_imagen_url) {
      if (prenda.Prenda_imagen_url.startsWith("http")) {
        return prenda.Prenda_imagen_url;
      }
      return `${CDN}${prenda.Prenda_imagen_url}`;
    }
    if (prenda.Prenda_imagen) {
      if (prenda.Prenda_imagen.startsWith("http")) {
        return prenda.Prenda_imagen;
      }
      return `${CDN}${prenda.Prenda_imagen}`;
    }
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='200'%3E%3Crect fill='%231a1a1a' width='240' height='200'/%3E%3Ctext fill='%23666' font-family='Arial' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ESin Imagen%3C/text%3E%3C/svg%3E";
  };

  const abrirDetalle = async (p) => {
    try {
      const res = await fetch(`${CDN}/api/inventario/prendas/${p.Prenda_ID}/`);
      const det = await res.json();
      console.log("Detalle de prenda:", det);
      setDetalle(det);
      setShowDetail(true);
    } catch (error) {
      console.error("Error al cargar detalle:", error);
      showAlert("Error al cargar el detalle", "error");
    }
  };

  const cerrarDetalle = () => {
    setShowDetail(false);
    setDetalle(null);
  };

  const abrirCrear = () => {
    setEditing(null);
    setForm({ nombre: "", marca: "", modelo: "", color: "", precioUnitario: "", imagen: null });
    setInsumosPrenda([]);
    setTallesPrenda([]);
    setShowModal(true);
  };

  const abrirEditar = async (p, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${CDN}/api/inventario/prendas/${p.Prenda_ID}/`);
      const det = await res.json();
      console.log("Datos de edición:", det);
      setEditing(p);
      setForm({
        nombre: det.Prenda_nombre || "",
        marca: det.Prenda_marca || "",
        modelo: det.Prenda_modelo || "",
        color: det.Prenda_color || "",
        precioUnitario: det.Prenda_precio_unitario || "",
        imagen: null,
      });
      setInsumosPrenda(
        (det.insumos_prendas || []).map((row) => ({
          insumo: row.Insumo_ID ?? row.insumo ?? "",
          cantidad: row.Insumo_prenda_cantidad_utilizada ?? 0,
        }))
      );
      
      const tallesArray = [];
      if (det.talles && Array.isArray(det.talles)) {
        det.talles.forEach(talle => {
          if (typeof talle === 'string') {
            tallesArray.push(talle);
          } else if (talle.Talle_nombre) {
            tallesArray.push(talle.Talle_nombre);
          }
        });
      }
      setTallesPrenda(tallesArray);
      
      setShowModal(true);
    } catch (error) {
      console.error("Error al cargar prenda para editar:", error);
      showAlert("Error al cargar la prenda", "error");
    }
  };

  const eliminarPrenda = (prenda, e) => {
    e.stopPropagation();
    setConfirmAction("delete");
    setConfirmData(prenda);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`${CDN}/api/inventario/prendas/${confirmData.Prenda_ID}/`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        throw new Error("Error al eliminar la prenda");
      }
      await cargarPrendas();
      showAlert(`Prenda "${confirmData.Prenda_nombre}" eliminada exitosamente`, "success");
      setShowConfirmModal(false);
      setConfirmAction(null);
      setConfirmData(null);
    } catch (error) {
      console.error("Error al eliminar prenda:", error);
      showAlert("Error al eliminar la prenda", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "nombre" || name === "color") {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!regex.test(value)) {
        return;
      }
    }
    
    if (name === "marca") {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!regex.test(value)) {
        return;
      }
    }
    
    if (name === "modelo") {
      const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!regex.test(value)) {
        return;
      }
    }
    
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const addInsumo = () => setInsumosPrenda([...insumosPrenda, { insumo: "", cantidad: "" }]);
  const removeInsumo = (idx) => setInsumosPrenda(insumosPrenda.filter((_, i) => i !== idx));
  const changeInsumo = (idx, field, value) => {
    const clone = [...insumosPrenda];
    clone[idx] = { ...clone[idx], [field]: value };
    setInsumosPrenda(clone);
  };

  const addTalle = () => setTallesPrenda([...tallesPrenda, ""]);
  const removeTalle = (idx) => setTallesPrenda(tallesPrenda.filter((_, i) => i !== idx));
  const changeTalle = (idx, value) => {
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/;
    if (!regex.test(value)) {
      return;
    }
    const clone = [...tallesPrenda];
    clone[idx] = value;
    setTallesPrenda(clone);
  };

  const onSubmit = () => {
    if (!form.nombre || !form.marca || !form.modelo || !form.color || !form.precioUnitario) {
      showAlert("Por favor completa todos los campos obligatorios", "error");
      return;
    }

    if (!editing && insumosPrenda.length === 0) {
      showAlert("Debes agregar al menos un insumo para esta prenda", "error");
      return;
    }

    const insumosIncompletos = insumosPrenda.some(r => !r.insumo || !r.cantidad || r.cantidad <= 0);
    if (insumosPrenda.length > 0 && insumosIncompletos) {
      showAlert("Completa todos los insumos agregados o elimínalos", "error");
      return;
    }

    if (!editing && tallesPrenda.length === 0) {
      showAlert("Debes agregar al menos un talle para esta prenda", "error");
      return;
    }

    const tallesIncompletos = tallesPrenda.some(t => !t || t.trim() === "");
    if (tallesPrenda.length > 0 && tallesIncompletos) {
      showAlert("Completa todos los talles agregados o elimínalos", "error");
      return;
    }

    setConfirmAction(editing ? "edit" : "add");
    setConfirmData(form);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const payloadInsumos = insumosPrenda
        .filter((r) => r.insumo && r.cantidad)
        .map((r) => ({ 
          insumo: Number(r.insumo), 
          cantidad: Number(r.cantidad) 
        }));

      const payloadTalles = tallesPrenda.filter(t => t && t.trim() !== "");

      const jsonData = {
        Prenda_nombre: confirmData.nombre,
        Prenda_marca: confirmData.marca,
        Prenda_modelo: confirmData.modelo,
        Prenda_color: confirmData.color,
        Prenda_precio_unitario: Number(confirmData.precioUnitario),
        insumos_prendas: payloadInsumos,
        talles: payloadTalles
      };

      const url = editing
        ? `${CDN}/api/inventario/prendas/${editing.Prenda_ID}/`
        : `${CDN}/api/inventario/prendas/`;
      
      let res;

      if (confirmData.imagen) {
        const fd = new FormData();
        fd.append("Prenda_nombre", confirmData.nombre);
        fd.append("Prenda_marca", confirmData.marca);
        fd.append("Prenda_modelo", confirmData.modelo);
        fd.append("Prenda_color", confirmData.color);
        fd.append("Prenda_precio_unitario", confirmData.precioUnitario);
        fd.append("Prenda_imagen", confirmData.imagen);
        fd.append("insumos_prendas", JSON.stringify(payloadInsumos));
        fd.append("talles", JSON.stringify(payloadTalles));

        const method = editing ? "PUT" : "POST";
        res = await fetch(url, { 
          method, 
          body: fd 
        });
      } else {
        const method = editing ? "PUT" : "POST";
        res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        });
      }

      if (!res.ok) {
        const error = await res.json();
        console.error("Error del servidor:", error);
        throw new Error("Error al guardar la prenda");
      }

      await cargarPrendas();
      showAlert(
        editing 
          ? `Prenda "${confirmData.nombre}" actualizada exitosamente` 
          : `Prenda "${confirmData.nombre}" creada exitosamente`,
        "success"
      );
      setShowConfirmModal(false);
      setConfirmAction(null);
      setConfirmData(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar prenda:", error);
      showAlert("Error al guardar la prenda", "error");
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmData(null);
  };

  const getConfirmModalContent = () => {
    if (confirmAction === "add") {
      return {
        title: "Agregar Prenda",
        message: "¿Está seguro que desea agregar esta prenda al catálogo?",
        buttonText: "Agregar",
        buttonStyle: styles.confirmActionButton,
        buttonClass: "hover-confirm-action",
        onConfirm: handleConfirmSubmit,
      };
    } else if (confirmAction === "edit") {
      return {
        title: "Guardar Cambios",
        message: "¿Está seguro que desea guardar los cambios realizados?",
        buttonText: "Guardar",
        buttonStyle: styles.confirmActionButton,
        buttonClass: "hover-confirm-action",
        onConfirm: handleConfirmSubmit,
      };
    } else if (confirmAction === "delete") {
      return {
        title: "Eliminar Prenda",
        message: `¿Estás seguro de que deseas eliminar la prenda "${confirmData?.Prenda_nombre}"? Esta acción no se puede deshacer.`,
        buttonText: "Eliminar",
        buttonStyle: styles.confirmDeleteButton,
        buttonClass: "hover-confirm-delete",
        onConfirm: handleConfirmDelete,
      };
    }
    return null;
  };

  return (
    <>
      <style>{styleSheet}</style>
      <Componente onToggle={setIsNavbarCollapsed} />
      <div
        style={{
          ...styles.container,
          backgroundImage: `url(${fondoImg})`,
          marginLeft: isNavbarCollapsed ? "70px" : "250px",
        }}
      >
        <div style={styles.header}>
          <h1 style={styles.title}>Prendas</h1>
          <div style={styles.headerActions}>
            <div style={styles.searchContainer}>
              <Search style={styles.searchIcon} />
              <input
                style={styles.searchInput}
                className="search-input"
                placeholder="Buscar prenda..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {search && (
                <button
                  onClick={handleClearSearch}
                  style={styles.clearButton}
                  className="hover-clear"
                  title="Limpiar búsqueda"
                >
                  <X style={{ width: "18px", height: "18px" }} />
                </button>
              )}
            </div>
            {search && (
              <div style={styles.searchCounter}>
                {prendasFiltradas.length} de {prendas.length}
              </div>
            )}
            <button style={styles.addBtn} className="hover-button" onClick={abrirCrear}>
              <Plus style={{ width: '20px', height: '20px' }} />
              Agregar Prenda
            </button>
          </div>
        </div>

        {search.trim() === "" ? (
          <div style={styles.emptyState}>
            Comienza a escribir en el buscador para ver las prendas
          </div>
        ) : prendasFiltradas.length === 0 ? (
          <div style={styles.emptyState}>
            No se encontraron prendas que coincidan con "{search}"
          </div>
        ) : (
          <div style={styles.grid}>
            {prendasFiltradas.map((p) => (
              <div 
                key={p.Prenda_ID} 
                style={styles.card} 
                className="hover-card"
                onClick={() => abrirDetalle(p)}
              >
                <img
                  src={getImageUrl(p)}
                  alt={p.Prenda_nombre}
                  style={styles.cardImage}
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='200'%3E%3Crect fill='%231a1a1a' width='240' height='200'/%3E%3Ctext fill='%23666' font-family='Arial' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EError al cargar%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div style={styles.cardActions}>
                  <button 
                    title="Editar" 
                    style={styles.iconBtn} 
                    className="hover-icon" 
                    onClick={(e) => abrirEditar(p, e)}
                  >
                    <Edit2 color="#60a5fa" size={18} />
                  </button>
                  <button 
                    title="Eliminar" 
                    style={styles.iconBtn} 
                    className="hover-icon" 
                    onClick={(e) => eliminarPrenda(p, e)}
                  >
                    <Trash2 color="#f87171" size={18} />
                  </button>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.cardTitle}>{p.Prenda_nombre}</div>
                  {p.Prenda_marca_nombre && (
                    <div style={styles.cardSubtitle}>Marca: {p.Prenda_marca_nombre}</div>
                  )}
                  {p.Prenda_modelo_nombre && (
                    <div style={styles.cardSubtitle}>Modelo: {p.Prenda_modelo_nombre}</div>
                  )}
                  <div style={styles.price}>${p.Prenda_precio_unitario}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL CRUD */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div
            style={{
              ...styles.modal,
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? "Editar Prenda" : "Agregar Prenda"}</h2>
              <button style={styles.closeBtn} className="hover-icon" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div>
              <label style={styles.label}>Nombre *</label>
              <input 
                name="nombre" 
                value={form.nombre} 
                onChange={handleChange} 
                style={styles.input} 
                className="form-input" 
                placeholder="Ej: Remera Oversize"
              />

              <label style={styles.label}>Marca</label>
              <input 
                name="marca" 
                value={form.marca} 
                onChange={handleChange} 
                style={styles.input} 
                className="form-input" 
                placeholder="Ej: Gucci"
              />

              <label style={styles.label}>Modelo</label>
              <input 
                name="modelo" 
                value={form.modelo} 
                onChange={handleChange} 
                style={styles.input} 
                className="form-input" 
                placeholder="Ej: GUC1"
              />

              <label style={styles.label}>Color</label>
              <input 
                name="color" 
                value={form.color} 
                onChange={handleChange} 
                style={styles.input} 
                className="form-input" 
                placeholder="Ej: Negro"
              />

              <label style={styles.label}>Precio Unitario *</label>
              <input
                type="number"
                name="precioUnitario"
                value={form.precioUnitario}
                onChange={handleChange}
                style={styles.input}
                className="form-input"
                placeholder="1000.0"
                min="0"
                step="0.01"
              />

              <label style={styles.label}>Imagen</label>
              <input
                type="file"
                name="imagen"
                accept="image/*"
                onChange={handleChange}
                style={{ ...styles.input, padding: "8px" }}
              />

              <h3 style={{ marginTop: 25, marginBottom: 12, color: "#fff" }}>Insumos para esta prenda</h3>

              {insumosPrenda.map((row, idx) => {
                const insumo = insumos.find((i) => i.Insumo_ID === Number(row.insumo)) || {};
                const costo = (row.cantidad || 0) * (insumo.Insumo_precio_unitario || 0);

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <select
                      value={row.insumo}
                      onChange={(e) => changeInsumo(idx, "insumo", e.target.value)}
                      style={styles.select}
                    >
                      <option value="">Seleccionar insumo</option>
                      {insumos.map((i) => (
                        <option key={i.Insumo_ID} value={i.Insumo_ID}>
                          {i.Insumo_nombre}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={row.cantidad}
                      onChange={(e) => changeInsumo(idx, "cantidad", e.target.value)}
                      style={styles.smallInput}
                      min="0"
                      step="0.01"
                    />

                    <span style={{ color: "#a3e635", fontWeight: 600, minWidth: "80px" }}>
                      ${costo.toFixed(2)}
                    </span>

                    <button onClick={() => removeInsumo(idx)} style={styles.removeBtn} title="Eliminar">
                      ✕
                    </button>
                  </div>
                );
              })}

              <button style={styles.addBtn} className="hover-button" onClick={addInsumo}>
                <Plus size={18} /> Agregar insumo
              </button>

              <h3 style={{ marginTop: 25, marginBottom: 12, color: "#fff" }}>Talles disponibles</h3>

              {tallesPrenda.map((talle, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Ej: S, M, L, XL"
                    value={talle}
                    onChange={(e) => changeTalle(idx, e.target.value)}
                    style={styles.talleInput}
                  />

                  <button onClick={() => removeTalle(idx)} style={styles.removeBtn} title="Eliminar">
                    ✕
                  </button>
                </div>
              ))}

              <button style={styles.addBtn} className="hover-button" onClick={addTalle}>
                <Plus size={18} /> Agregar talle
              </button>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowModal(false)}
                style={styles.cancelBtn}
                className="hover-cancel"
              >
                Cancelar
              </button>
              <button
                onClick={onSubmit}
                style={styles.submitBtn}
                className="hover-button"
              >
                {editing ? "Guardar Cambios" : "Agregar Prenda"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE */}
      {showDetail && detalle && (
        <div style={styles.overlay} onClick={cerrarDetalle}>
          <div
            style={{
              ...styles.modal,
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{detalle.Prenda_nombre}</h2>
              <button style={styles.closeBtn} className="hover-icon" onClick={cerrarDetalle}>
                <X size={24} />
              </button>
            </div>

            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <img
                src={getImageUrl(detalle)}
                alt={detalle.Prenda_nombre}
                style={{
                  width: "100%",
                  maxHeight: "350px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  backgroundColor: "#111",
                  padding: "8px",
                }}
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='350'%3E%3Crect fill='%231a1a1a' width='400' height='350'/%3E%3Ctext fill='%23666' font-family='Arial' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EError al cargar%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            <div style={{ fontSize: "15px", lineHeight: "1.6", color: "#fff" }}>
              <p><strong>Marca:</strong> {detalle.Prenda_marca_nombre || "-"}</p>
              <p><strong>Modelo:</strong> {detalle.Prenda_modelo_nombre || "-"}</p>
              <p><strong>Color:</strong> {detalle.Prenda_color_nombre || "-"}</p>
              <p style={{ color: "rgba(255,215,15,1)", fontWeight: 700 }}>
                Precio unitario: ${detalle.Prenda_precio_unitario}
              </p>

              <h3 style={{ marginTop: 20, marginBottom: 10, color: "#fff" }}>Insumos utilizados:</h3>
              {(detalle.insumos_prendas || []).length === 0 ? (
                <p style={{ color: "#aaa" }}>No hay insumos registrados.</p>
              ) : (
                <ul style={{ marginTop: 10, paddingLeft: "20px" }}>
                  {detalle.insumos_prendas.map((i, idx) => {
                    const insumoId = Number(i.insumo) || Number(i.Insumo_ID);
                    const cantidad = Number(i.Insumo_prenda_cantidad_utilizada || i.cantidad || 0);
                    const insumo = insumoPorId.get(insumoId) || {};
                    const costo = (cantidad * Number(insumo.Insumo_precio_unitario || 0)).toFixed(2);

                    return (
                      <li key={idx} style={{ marginBottom: 6, color: "#ddd" }}>
                        🧵 <strong>{insumo.Insumo_nombre || "Insumo"}</strong> — {cantidad}{" "}
                        {insumo.Insumo_unidad_medida || ""} — ${costo}
                      </li>
                    );
                  })}
                </ul>
              )}

              <h3 style={{ marginTop: 20, marginBottom: 10, color: "#fff" }}>Talles disponibles:</h3>
              {!detalle.talles || detalle.talles.length === 0 ? (
                <p style={{ color: "#aaa" }}>No hay talles registrados.</p>
              ) : (
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {detalle.talles.map((talle, idx) => {
                    const nombreTalle = typeof talle === 'string' ? talle : (talle.Talle_nombre || 'N/A');
                    return (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: "rgba(255,215,15,0.2)",
                          color: "#ffd70f",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {nombreTalle}
                      </span>
                    );
                  })}
                </div>
              )}

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  textAlign: "right",
                }}
              >
                <h4
                  style={{
                    fontSize: "17px",
                    color: "#a3e635",
                    fontWeight: 700,
                  }}
                >
                  💰 Costo total de producción: $
                  {(
                    (detalle.insumos_prendas || []).reduce((acc, i) => {
                      const insumoId = Number(i.insumo) || Number(i.Insumo_ID);
                      const cantidad = Number(i.Insumo_prenda_cantidad_utilizada || i.cantidad || 0);
                      const insumo = insumoPorId.get(insumoId);
                      const precio = insumo ? Number(insumo.Insumo_precio_unitario || 0) : 0;
                      return acc + cantidad * precio;
                    }, 0) || 0
                  ).toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmModal && (() => {
        const content = getConfirmModalContent();
        return (
          <div style={styles.overlay} onClick={handleCancelConfirm}>
            <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.confirmHeader}>
                <h2 style={styles.confirmTitle}>{content.title}</h2>
                <p style={styles.confirmMessage}>{content.message}</p>
              </div>

              <div style={styles.confirmActions}>
                <button
                  onClick={handleCancelConfirm}
                  style={styles.confirmCancelButton}
                  className="hover-confirm-cancel"
                >
                  Cancelar
                </button>
                <button
                  onClick={content.onConfirm}
                  style={content.buttonStyle}
                  className={content.buttonClass}
                >
                  {content.buttonText}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ALERTA DE NOTIFICACIÓN */}
      {alert && (
        <div
          style={{
            ...styles.alert,
            ...(alert.type === "success" ? styles.alertSuccess : styles.alertError),
          }}
        >
          {alert.type === "success" ? (
            <CheckCircle style={{ width: "24px", height: "24px" }} />
          ) : (
            <AlertCircle style={{ width: "24px", height: "24px" }} />
          )}
          <span style={styles.alertText}>{alert.message}</span>
        </div>
      )}
    </>
  );
}

export default Prendas;