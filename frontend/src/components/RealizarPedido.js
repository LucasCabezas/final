import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Package, Plus, Trash2 } from 'lucide-react';
import Componente from "./componente.jsx";
import fondoImg from './assets/fondo.png';

const styles = {
  pedidoContainer: {
    padding: '32px',
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'margin-left 0.3s ease'
  },
  contentWrapper: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#d1d5db'
  },
  mosaicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  card: {
    backgroundColor: 'rgba(30,30,30,0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  cardSelected: {
    backgroundColor: 'rgba(255,215,15,0.2)',
    border: '2px solid rgba(255,215,15,1)',
    transform: 'scale(1.03)'
  },
  cardImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  },
  cardBody: {
    padding: '12px',
    textAlign: 'center',
    color: '#fff'
  },
  formContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '12px',
    padding: '28px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    alignItems: 'end'
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    fontSize: '14px'
  },
  addBtn: {
    backgroundColor: 'rgba(255, 215, 15, 1)',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  pedidoCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '12px 20px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white'
  },
  resultadoContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '20px',
    border: '1px solid rgba(255, 215, 15, 0.3)'
  },
  resultadoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  resultadoItem: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
    color: '#fff'
  },
  btnConfirmar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 40px',
    backgroundColor: '#10b981',
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px'
  },
  alert: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '16px 24px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 3000,
    minWidth: '300px'
  },
  alertSuccess: { backgroundColor: '#10b981', color: '#fff' },
  alertError: { backgroundColor: '#ef4444', color: '#fff' }
};

export default function RealizarPedido() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [prendas, setPrendas] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [selectedPrenda, setSelectedPrenda] = useState(null);
  const [formData, setFormData] = useState({
    cantidad: 1,
    talle: "",
    recargoTalle: 10,
    porcentajeGanancia: 25
  });
  const [alert, setAlert] = useState(null);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const fetchPrendas = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/inventario/prendas/");
        const data = await res.json();
        setPrendas(data);
      } catch (err) {
        showAlert("Error al cargar prendas", "error");
      }
    };
    fetchPrendas();
  }, []);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const agregarPrenda = () => {
    if (!selectedPrenda) {
      showAlert("Seleccioná una prenda", "error");
      return;
    }

    const prendaBase = prendas.find(p => p.Prenda_ID === selectedPrenda);
    if (!prendaBase) return;

    const recargo = formData.talle.toUpperCase().includes("XL") ? formData.recargoTalle / 100 : 0;
    const precioBase = prendaBase.Prenda_precio_unitario;
    const precioFinal = precioBase * (1 + recargo);

    const nueva = {
      ...prendaBase,
      cantidad: parseInt(formData.cantidad),
      talle: formData.talle,
      precioUnitario: precioFinal
    };

    setPedido([...pedido, nueva]);
    setSelectedPrenda(null);
    setFormData({ ...formData, cantidad: 1, talle: "" });
  };

  const eliminarPrenda = (id) => setPedido(pedido.filter(p => p.Prenda_ID !== id));

  const calcularTotales = () => {
    const subtotal = pedido.reduce((acc, p) => acc + p.precioUnitario * p.cantidad, 0);
    const ganancia = subtotal * (formData.porcentajeGanancia / 100);
    const total = subtotal + ganancia;
    setResultado({ subtotal, ganancia, total });
  };

  const confirmarPedido = async () => {
    try {
      const data = {
        usuario: 1,
        prendas: pedido.map(p => ({
          id_prenda: p.Prenda_ID,
          cantidad: p.cantidad,
          tipo: "LISA"
        }))
      };

      const res = await fetch("http://localhost:8000/api/pedidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Error al crear pedido:", errorData);
        showAlert(`Error al realizar pedido: ${errorData.error}`, "error");
        return;
      }

      const responseData = await res.json();
      showAlert("✅ Pedido realizado correctamente", "success");
      console.log("Pedido creado:", responseData);

      setPedido([]);
      setResultado(null);
    } catch (err) {
      console.error("Error general:", err);
      showAlert("Error al conectar con el servidor", "error");
    }
  };

  return (
    <>
      <Componente onToggle={setIsNavbarCollapsed} />
      <div
        style={{
          ...styles.pedidoContainer,
          backgroundImage: `url(${fondoImg})`,
          marginLeft: isNavbarCollapsed ? "70px" : "250px"
        }}
      >
        <div style={styles.contentWrapper}>
          <div style={styles.header}>
            <h1 style={styles.title}>Realizar Pedido</h1>
            <p style={styles.subtitle}>Seleccioná las prendas y realizá el pedido completo</p>
          </div>

          {/* MOSAICO DE PRENDAS */}
          <div style={styles.mosaicGrid}>
            {prendas.map((p) => (
              <div
                key={p.Prenda_ID}
                style={{
                  ...styles.card,
                  ...(selectedPrenda === p.Prenda_ID ? styles.cardSelected : {})
                }}
                onClick={() => setSelectedPrenda(p.Prenda_ID)}
              >
                <img
                  src={`http://localhost:8000${p.Prenda_imagen}`}
                  alt={p.Prenda_nombre}
                  style={styles.cardImage}
                />
                <div style={styles.cardBody}>
                  <strong>{p.Prenda_nombre}</strong>
                  <p style={{ fontSize: '13px', opacity: 0.7 }}>${p.Prenda_precio_unitario}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FORMULARIO */}
          <div style={styles.formContainer}>
            <div style={styles.formGrid}>
              <div>
                <label style={{ color: '#fff' }}>Talle</label>
                <input
                  type="text"
                  placeholder="Ej: M, XL, XXL"
                  value={formData.talle}
                  onChange={(e) => setFormData({ ...formData, talle: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div>
                <label style={{ color: '#fff' }}>Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div>
                <label style={{ color: '#fff' }}>Recargo Talles Especiales (%)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.recargoTalle}
                  onChange={(e) => setFormData({ ...formData, recargoTalle: e.target.value })}
                  style={styles.input}
                />
              </div>

              <button onClick={agregarPrenda} style={styles.addBtn}>
                <Plus size={18} /> Agregar
              </button>
            </div>

            {pedido.map((p) => (
              <div key={p.Prenda_ID} style={styles.pedidoCard}>
                <span>{p.Prenda_nombre} ({p.talle}) x {p.cantidad}</span>
                <span>${(p.precioUnitario * p.cantidad).toFixed(2)}</span>
                <button onClick={() => eliminarPrenda(p.Prenda_ID)} style={{ background: 'none', border: 'none' }}>
                  <Trash2 color="#f87171" />
                </button>
              </div>
            ))}

            <div style={{ marginTop: '20px' }}>
              <label style={{ color: '#fff' }}>Porcentaje de Ganancia (%)</label>
              <input
                type="number"
                min="0"
                value={formData.porcentajeGanancia}
                onChange={(e) => setFormData({ ...formData, porcentajeGanancia: e.target.value })}
                style={styles.input}
              />
            </div>

            <button onClick={calcularTotales} style={{ ...styles.addBtn, marginTop: '20px' }}>
              <Package /> Realizar Pedido
            </button>

            {resultado && (
              <div style={styles.resultadoContainer}>
                <div style={styles.resultadoGrid}>
                  <div style={styles.resultadoItem}>Subtotal: ${resultado.subtotal.toFixed(2)}</div>
                  <div style={styles.resultadoItem}>Ganancia: ${resultado.ganancia.toFixed(2)}</div>
                  <div style={styles.resultadoItem}>Total Final: ${resultado.total.toFixed(2)}</div>
                </div>

                <button onClick={confirmarPedido} style={styles.btnConfirmar}>
                  <CheckCircle /> Confirmar Pedido
                </button>
              </div>
            )}
          </div>
        </div>

        {alert && (
          <div style={{
            ...styles.alert,
            ...(alert.type === "success" ? styles.alertSuccess : styles.alertError)
          }}>
            {alert.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{alert.message}</span>
          </div>
        )}
      </div>
    </>
  );
}
