import React, { useEffect, useMemo, useState } from "react";
import { Plus, X, Search, Edit2, Trash2, Eye } from "lucide-react";
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
  searchBox: { position: "relative" },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" },
  searchInput: {
    padding: "8px 16px 8px 40px",
    backgroundColor: "#fff",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    outline: "none",
    width: 260,
    color: "#000",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,215,15,1)",
    color: "#000",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 600,
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 },
  card: {
    backgroundColor: "rgba(30,30,30,0.95)",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    position: "relative",
  },
  cardImage: { width: "100%", height: 220, objectFit: "cover" },
  cardBody: { padding: 14, color: "#fff" },
  cardTitle: { fontWeight: 700, marginBottom: 6 },
  price: { color: "rgba(255,215,15,1)", fontWeight: 700 },
  cardActions: {
    position: "absolute",
    right: 8,
    top: 8,
    display: "flex",
    gap: 8,
    background: "rgba(0,0,0,0.35)",
    padding: 6,
    borderRadius: 8,
  },
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8 },
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
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 24, fontWeight: 800 },
  closeBtn: { background: "none", border: "none", color: "#bbb", cursor: "pointer" },
  input: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #4b5563", background: "#fff", color: "#000" },
  label: { fontWeight: 600, marginBottom: 6, display: "block" },
  insumoRow: { display: "flex", gap: 10, alignItems: "center", marginBottom: 8 },
  select: { flex: 2, padding: 8, borderRadius: 8, border: "1px solid #ccc" },
  smallInput: { flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" },
  removeBtn: { background: "transparent", border: "none", color: "#f87171", cursor: "pointer" },
};

function Prendas() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [prendas, setPrendas] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [search, setSearch] = useState("");

  // MODALES
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detalle, setDetalle] = useState(null);

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

  useEffect(() => {
    cargarPrendas();
    cargarInsumos();
  }, []);

  const cargarPrendas = async () => {
    const res = await fetch(`${CDN}/api/inventario/prendas/`);
    const data = await res.json();
    setPrendas(Array.isArray(data) ? data : []);
  };

  const cargarInsumos = async () => {
    const res = await fetch(`${CDN}/api/inventario/insumos/`);
    const data = await res.json();
    setInsumos(Array.isArray(data) ? data : []);
  };

  const insumoPorId = useMemo(() => {
    const map = new Map();
    insumos.forEach((i) => map.set(i.Insumo_ID, i));
    return map;
  }, [insumos]);

  // BUSCADOR
  const prendasFiltradas = prendas.filter((p) =>
    (p.Prenda_nombre || "").toLowerCase().includes(search.toLowerCase())
  );

  // DETALLE
  const abrirDetalle = async (p) => {
    const res = await fetch(`${CDN}/api/inventario/prendas/${p.Prenda_ID}/`);
    const det = await res.json();
    setDetalle(det);
    setShowDetail(true);
  };

  const cerrarDetalle = () => {
    setShowDetail(false);
    setDetalle(null);
  };

  // CRUD
  const abrirCrear = () => {
    setEditing(null);
    setForm({ nombre: "", marca: "", modelo: "", color: "", precioUnitario: "", imagen: null });
    setInsumosPrenda([]);
    setShowModal(true);
  };

  const abrirEditar = async (p) => {
    const res = await fetch(`${CDN}/api/inventario/prendas/${p.Prenda_ID}/`);
    const det = await res.json();
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
    setShowModal(true);
  };

  const eliminarPrenda = async (id) => {
    if (!window.confirm("¿Eliminar esta prenda?")) return;
    await fetch(`${CDN}/api/inventario/prendas/${id}/`, { method: "DELETE" });
    cargarPrendas();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const addInsumo = () => setInsumosPrenda([...insumosPrenda, { insumo: "", cantidad: "" }]);
  const removeInsumo = (idx) => setInsumosPrenda(insumosPrenda.filter((_, i) => i !== idx));
  const changeInsumo = (idx, field, value) => {
    const clone = [...insumosPrenda];
    clone[idx] = { ...clone[idx], [field]: value };
    setInsumosPrenda(clone);
  };

  const onSubmit = async () => {
    const fd = new FormData();
    fd.append("Prenda_nombre", form.nombre);
    fd.append("Prenda_marca", form.marca);
    fd.append("Prenda_modelo", form.modelo);
    fd.append("Prenda_color", form.color);
    fd.append("Prenda_precio_unitario", form.precioUnitario);
    if (form.imagen) fd.append("Prenda_imagen", form.imagen);

    const payloadInsumos = insumosPrenda
      .filter((r) => r.insumo && r.cantidad)
      .map((r) => ({ insumo: Number(r.insumo), cantidad: Number(r.cantidad) }));
    fd.append("insumos_prendas", JSON.stringify(payloadInsumos));

    const url = editing
      ? `${CDN}/api/inventario/prendas/${editing.Prenda_ID}/`
      : `${CDN}/api/inventario/prendas/`;
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, { method, body: fd });
    if (!res.ok) alert("Error al guardar la prenda");
    else {
      setShowModal(false);
      cargarPrendas();
    }
  };

  const costoTotal = (detalle?.insumos_prendas || []).reduce((acc, row) => {
    const insumo = insumoPorId.get(Number(row.insumo)) || {};
    return acc + (row.Insumo_prenda_cantidad_utilizada * (insumo.Insumo_precio_unitario || 0));
  }, 0);

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
        <div style={styles.header}>
          <h1 style={styles.title}>Catálogo de Prendas</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={styles.searchBox}>
              <Search style={styles.searchIcon} />
              <input
                style={styles.searchInput}
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button style={styles.addBtn} onClick={abrirCrear}>
              <Plus /> Nueva Prenda
            </button>
          </div>
        </div>

        {/* --- LISTA --- */}
        <div style={styles.grid}>
          {prendasFiltradas.map((p) => (
            <div key={p.Prenda_ID} style={styles.card}>
              <img
                src={p.Prenda_imagen ? `${CDN}${p.Prenda_imagen}` : "/placeholder.png"}
                alt={p.Prenda_nombre}
                style={styles.cardImage}
              />
              <div style={styles.cardActions}>
                <button title="Ver" style={styles.iconBtn} onClick={() => abrirDetalle(p)}>
                  <Eye color="#e5e7eb" />
                </button>
                <button title="Editar" style={styles.iconBtn} onClick={() => abrirEditar(p)}>
                  <Edit2 color="#60a5fa" />
                </button>
                <button title="Eliminar" style={styles.iconBtn} onClick={() => eliminarPrenda(p.Prenda_ID)}>
                  <Trash2 color="#f87171" />
                </button>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.cardTitle}>{p.Prenda_nombre}</div>
                <div style={styles.price}>${p.Prenda_precio_unitario}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

{/* --- MODAL CRUD --- */}
{showModal && (
  <div style={styles.overlay} onClick={() => setShowModal(false)}>
    <div
      style={{
        ...styles.modal,
        maxWidth: "700px",
        width: "95%",
        maxHeight: "90vh",
        overflowY: "auto",
        overflowX: "hidden", // 🚫 elimina scroll lateral
        borderRadius: "12px",
        padding: "24px 20px 10px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxSizing: "border-box",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        style={{
          ...styles.modalHeader,
          marginBottom: "10px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "10px",
        }}
      >
        <h2 style={styles.modalTitle}>{editing ? "Editar Prenda" : "Agregar Prenda"}</h2>
        <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
          <X size={24} />
        </button>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingRight: "4px" }}>
        <label style={styles.label}>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Marca</label>
        <input name="marca" value={form.marca} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Modelo</label>
        <input name="modelo" value={form.modelo} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Color</label>
        <input name="color" value={form.color} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Precio Unitario</label>
        <input
          type="number"
          name="precioUnitario"
          value={form.precioUnitario}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Imagen</label>
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleChange}
          style={{ ...styles.input, padding: "6px" }}
        />

        <h3 style={{ marginTop: 25, color: "#fff" }}>Insumos para esta prenda</h3>

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
                flexWrap: "wrap",
              }}
            >
              <select
                value={row.insumo}
                onChange={(e) => changeInsumo(idx, "insumo", e.target.value)}
                style={{ ...styles.select, flex: 2 }}
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
                style={{ ...styles.smallInput, flex: 1 }}
              />

              <span style={{ color: "#a3e635", fontWeight: 600, flex: 1 }}>
                ${costo.toFixed(2)}
              </span>

              <button onClick={() => removeInsumo(idx)} style={styles.removeBtn}>
                ✕
              </button>
            </div>
          );
        })}

        <button style={styles.addBtn} onClick={addInsumo}>
          + Agregar insumo
        </button>
      </div>

      {/* Pie fijo */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "linear-gradient(to top, rgba(15,15,15,0.95), transparent)",
          paddingTop: "10px",
          marginTop: "10px",
          textAlign: "right",
        }}
      >
        <button
          style={{
            ...styles.addBtn,
            backgroundColor: editing ? "#3b82f6" : "rgba(255,215,15,1)",
            color: "#000",
            padding: "10px 22px",
          }}
          onClick={onSubmit}
        >
          {editing ? "Guardar Cambios" : "Guardar Prenda"}
        </button>
      </div>
    </div>
  </div>
)}

{/* --- MODAL DETALLE --- */}
{showDetail && detalle && (
  <div style={styles.overlay} onClick={cerrarDetalle}>
    <div
      style={{
        ...styles.modal,
        maxWidth: "600px",
        width: "90%",
        maxHeight: "90vh",
        overflowY: "auto",
        borderRadius: "12px",
        padding: "20px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>{detalle.Prenda_nombre}</h2>
        <button style={styles.closeBtn} onClick={cerrarDetalle}>
          <X size={24} />
        </button>
      </div>

      {/* Imagen */}
      <div style={{ textAlign: "center" }}>
        <img
          src={detalle.Prenda_imagen ? `${CDN}${detalle.Prenda_imagen}` : "/placeholder.png"}
          alt={detalle.Prenda_nombre}
          style={{
            width: "100%",
            maxHeight: "350px",
            objectFit: "contain",
            borderRadius: "10px",
            marginBottom: "20px",
            backgroundColor: "#111",
            padding: "8px",
          }}
        />
      </div>

      {/* Contenido principal */}
      <div style={{ flex: 1, fontSize: "15px", lineHeight: "1.6" }}>
        <p><strong>Marca:</strong> {detalle.Prenda_marca || "-"}</p>
        <p><strong>Modelo:</strong> {detalle.Prenda_modelo || "-"}</p>
        <p><strong>Color:</strong> {detalle.Prenda_color || "-"}</p>
        <p style={{ color: "rgba(255,215,15,1)", fontWeight: 700 }}>
          Precio unitario: ${detalle.Prenda_precio_unitario}
        </p>

        <h3 style={{ marginTop: 20, color: "#fff" }}>Insumos utilizados:</h3>
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
      </div>

      {/* Pie fijo con el total */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "linear-gradient(to top, rgba(15,15,15,0.95), transparent)",
          paddingTop: "10px",
          marginTop: "10px",
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
)}

</>
  );
}

export default Prendas;
