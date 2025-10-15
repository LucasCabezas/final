import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Package, Plus, Trash2, X, Search } from 'lucide-react';
import Componente from "./componente.jsx";
import fondoImg from './assets/fondo.png';

const styles = {
  container: {
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  headerLeft: {
    flex: 1
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
  btnRealizarPedido: {
    backgroundColor: '#ffd70f',
    color: '#000',
    padding: '12px 30px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.2s'
  },
  searchContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: '1 1 200px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: '14px'
  },
  select: {
    flex: '1 1 150px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer'
  },
  btnBuscar: {
    padding: '10px 24px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  tableContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    color: '#9ca3af',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  td: {
    padding: '16px',
    color: '#fff',
    fontSize: '14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  btnVerDetalles: {
    padding: '6px 16px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500'
  },
  estadoBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  },
  estadoPendiente: {
    backgroundColor: '#fbbf24',
    color: '#000'
  },
  estadoEnProceso: {
    backgroundColor: '#3b82f6',
    color: '#fff'
  },
  btnEliminar: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#ef4444',
    padding: '4px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid rgba(255, 215, 15, 0.3)',
    position: 'relative'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  modalTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffd70f'
  },
  btnClose: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '4px'
  },
  formContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    alignItems: 'end'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    color: '#d1d5db',
    fontSize: '13px',
    fontWeight: '500'
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#fff',
    fontSize: '14px'
  },
  selectPrenda: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23ffffff\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center'
  },
  addBtn: {
    backgroundColor: '#ffd70f',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    color: '#000'
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
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '20px',
    border: '1px solid rgba(255, 215, 15, 0.3)'
  },
  resultadoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  },
  resultadoItem: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
    color: '#fff',
    textAlign: 'center'
  },
  resultadoLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '4px'
  },
  resultadoValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffd70f'
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
    width: '100%',
    fontSize: '16px'
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
    minWidth: '300px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  alertSuccess: { backgroundColor: '#10b981', color: '#fff' },
  alertError: { backgroundColor: '#ef4444', color: '#fff' },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#9ca3af'
  },
  searchPrendaInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#fff',
    fontSize: '14px',
    marginBottom: '12px'
  }
};

export default function PedidosView() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [prendas, setPrendas] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [selectedPrenda, setSelectedPrenda] = useState("");
  const [searchPrenda, setSearchPrenda] = useState("");
  const [formData, setFormData] = useState({
    cantidad: 1,
    talle: "",
    recargoTalle: 10,
    porcentajeGanancia: 25
  });
  const [filtros, setFiltros] = useState({
    id: "",
    estado: "",
    fecha: ""
  });
  const [alert, setAlert] = useState(null);
  const [resultado, setResultado] = useState(null);

  // Cargar prendas
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

  // Cargar pedidos pendientes por defecto
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/pedidos/");
        const data = await res.json();
        // Solo mostrar pedidos pendientes por defecto
        const pendientes = data.filter(p => p.Estado === "Pendiente");
        setPedidosFiltrados(pendientes);
      } catch (err) {
        showAlert("Error al cargar pedidos", "error");
      }
    };
    fetchPedidos();
  }, []);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const prendasFiltradas = prendas.filter(p =>
    p.Prenda_nombre.toLowerCase().includes(searchPrenda.toLowerCase())
  );

  const agregarPrenda = () => {
    if (!selectedPrenda) {
      showAlert("Seleccioná una prenda", "error");
      return;
    }

    const prendaBase = prendas.find(p => p.Prenda_ID === parseInt(selectedPrenda));
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
    setSelectedPrenda("");
    setFormData({ ...formData, cantidad: 1, talle: "" });
    setSearchPrenda("");
  };

  const eliminarPrendaPedido = (index) => {
    setPedido(pedido.filter((_, i) => i !== index));
  };

  const calcularTotales = () => {
    if (pedido.length === 0) {
      showAlert("Agregá al menos una prenda", "error");
      return;
    }
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
        showAlert(`Error al realizar pedido: ${errorData.error}`, "error");
        return;
      }

      await res.json();
      showAlert("✅ Pedido realizado correctamente", "success");

      // Recargar pedidos
      const resPedidos = await fetch("http://localhost:8000/api/pedidos/");
      const dataPedidos = await resPedidos.json();
      const pendientes = dataPedidos.filter(p => p.Estado === "Pendiente");
      setPedidosFiltrados(pendientes);

      setPedido([]);
      setResultado(null);
      setModalOpen(false);
    } catch (err) {
      showAlert("Error al conectar con el servidor", "error");
    }
  };

  const buscarPedidos = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/pedidos/");
      const data = await res.json();
      
      let filtrados = data;

      if (filtros.id) {
        filtrados = filtrados.filter(p => 
          p.Pedido_ID.toString().includes(filtros.id)
        );
      }

      if (filtros.estado) {
        filtrados = filtrados.filter(p => p.Estado === filtros.estado);
      } else if (!filtros.id && !filtros.fecha) {
        // Si no hay filtros activos, mostrar solo pendientes
        filtrados = filtrados.filter(p => p.Estado === "Pendiente");
      }

      if (filtros.fecha) {
        filtrados = filtrados.filter(p => 
          p.Fecha && p.Fecha.startsWith(filtros.fecha)
        );
      }

      setPedidosFiltrados(filtrados);
    } catch (err) {
      showAlert("Error al buscar pedidos", "error");
    }
  };

  const eliminarPedido = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este pedido?")) return;
    
    try {
      const res = await fetch(`http://localhost:8000/api/pedidos/${id}/`, {
        method: "DELETE"
      });

      if (res.ok) {
        showAlert("Pedido eliminado correctamente", "success");
        setPedidosFiltrados(pedidosFiltrados.filter(p => p.Pedido_ID !== id));
      } else {
        showAlert("Error al eliminar pedido", "error");
      }
    } catch (err) {
      showAlert("Error al conectar con el servidor", "error");
    }
  };

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
              <h1 style={styles.title}>pedidos</h1>
              <p style={styles.subtitle}>Lista de los últimos pedidos y su estado actual.</p>
            </div>
            <button 
              style={styles.btnRealizarPedido}
              onClick={() => setModalOpen(true)}
            >
              Realizar Pedido
            </button>
          </div>

          {/* BUSCADOR */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar por ID..."
              value={filtros.id}
              onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
              style={styles.searchInput}
            />
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
              style={styles.select}
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Completado">Completado</option>
            </select>
            <input
              type="date"
              value={filtros.fecha}
              onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
              style={styles.searchInput}
            />
            <button style={styles.btnBuscar} onClick={buscarPedidos}>
              <Search size={18} /> Buscar
            </button>
          </div>

          {/* TABLA DE PEDIDOS */}
          {pedidosFiltrados.length > 0 ? (
            <div style={styles.tableContainer}>
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
                  {pedidosFiltrados.map((p) => (
                    <tr key={p.Pedido_ID}>
                      <td style={styles.td}>PED{p.Pedido_ID.toString().padStart(3, '0')}</td>
                      <td style={styles.td}>{p.Cantidad || 5}</td>
                      <td style={styles.td}>
                        <button style={styles.btnVerDetalles}>
                          VER DETALLES
                        </button>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.estadoBadge,
                          ...(p.Estado === "Pendiente" ? styles.estadoPendiente : styles.estadoEnProceso)
                        }}>
                          {p.Estado}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {p.Fecha ? new Date(p.Fecha).toLocaleDateString('es-AR') : '3/9/2025'}
                      </td>
                      <td style={styles.td}>
                        <button 
                          style={styles.btnEliminar}
                          onClick={() => eliminarPedido(p.Pedido_ID)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <Package size={64} color="#4b5563" />
              <h3 style={{ marginTop: '16px', color: '#9ca3af' }}>
                No hay pedidos pendientes
              </h3>
              <p style={{ color: '#6b7280' }}>
                Usa el buscador para ver todos los pedidos o realiza uno nuevo
              </p>
            </div>
          )}
        </div>

        {/* MODAL REALIZAR PEDIDO */}
        {modalOpen && (
          <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Realizar Nuevo Pedido</h2>
                <button style={styles.btnClose} onClick={() => setModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div style={styles.formContainer}>
                <input
                  type="text"
                  placeholder="🔍 Buscar prenda..."
                  value={searchPrenda}
                  onChange={(e) => setSearchPrenda(e.target.value)}
                  style={styles.searchPrendaInput}
                />

                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Prenda</label>
                    <select
                      value={selectedPrenda}
                      onChange={(e) => setSelectedPrenda(e.target.value)}
                      style={styles.selectPrenda}
                    >
                      <option value="">Seleccionar prenda...</option>
                      {prendasFiltradas.map((p) => (
                        <option key={p.Prenda_ID} value={p.Prenda_ID}>
                          {p.Prenda_nombre} - ${p.Prenda_precio_unitario}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Talle</label>
                    <input
                      type="text"
                      placeholder="Ej: M, XL, XXL"
                      value={formData.talle}
                      onChange={(e) => setFormData({ ...formData, talle: e.target.value })}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.cantidad}
                      onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Recargo XL (%)</label>
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

                {pedido.map((p, index) => (
                  <div key={index} style={styles.pedidoCard}>
                    <span>{p.Prenda_nombre} ({p.talle}) x {p.cantidad}</span>
                    <span>${(p.precioUnitario * p.cantidad).toFixed(2)}</span>
                    <button onClick={() => eliminarPrendaPedido(index)} style={styles.btnEliminar}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <div style={{ marginTop: '20px' }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Porcentaje de Ganancia (%)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.porcentajeGanancia}
                      onChange={(e) => setFormData({ ...formData, porcentajeGanancia: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                </div>

                <button onClick={calcularTotales} style={{ ...styles.addBtn, marginTop: '20px', width: '100%' }}>
                  <Package size={18} /> Calcular Totales
                </button>

                {resultado && (
                  <div style={styles.resultadoContainer}>
                    <div style={styles.resultadoGrid}>
                      <div style={styles.resultadoItem}>
                        <div style={styles.resultadoLabel}>Subtotal</div>
                        <div style={styles.resultadoValue}>${resultado.subtotal.toFixed(2)}</div>
                      </div>
                      <div style={styles.resultadoItem}>
                        <div style={styles.resultadoLabel}>Ganancia</div>
                        <div style={styles.resultadoValue}>${resultado.ganancia.toFixed(2)}</div>
                      </div>
                      <div style={styles.resultadoItem}>
                        <div style={styles.resultadoLabel}>Total Final</div>
                        <div style={styles.resultadoValue}>${resultado.total.toFixed(2)}</div>
                      </div>
                    </div>

                    <button onClick={confirmarPedido} style={styles.btnConfirmar}>
                      <CheckCircle size={20} /> Confirmar Pedido
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {alert && (
          <div style={{
            ...styles.alert,
            ...(alert.type === "success" ? styles.alertSuccess : styles.alertError)
          }}>
            {alert.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{alert.message}</span>
          </div>
        )}
      </div>
    </>
  );
}