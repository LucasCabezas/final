import React, { useState, useEffect } from "react";
import { Calculator, CheckCircle, AlertCircle, Package } from 'lucide-react';
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
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px'
  },
  formContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '12px',
    padding: '28px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px'
  },
  select: {
    padding: '10px 16px',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    outline: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'border-color 0.2s'
  },
  selectDisabled: {
    padding: '10px 16px',
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    outline: 'none',
    fontSize: '14px',
    cursor: 'not-allowed',
    opacity: 0.6
  },
  input: {
    padding: '10px 16px',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    outline: 'none',
    fontSize: '14px',
    transition: 'border-color 0.2s'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px'
  },
  btnCalcular: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 32px',
    backgroundColor: 'rgba(255, 215, 15, 1)',
    color: '#000000',
    borderRadius: '8px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  },
  btnCalcularDisabled: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 32px',
    backgroundColor: '#6b7280',
    color: '#d1d5db',
    borderRadius: '8px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'not-allowed',
    opacity: 0.6
  },
  resultadoContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: '12px',
    padding: '28px',
    border: '1px solid rgba(255, 215, 15, 0.3)'
  },
  resultadoTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  resultadoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  resultadoItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  resultadoItemDestacado: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid rgba(59, 130, 246, 0.3)'
  },
  resultadoItemSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid rgba(16, 185, 129, 0.3)'
  },
  resultadoItemTotal: {
    backgroundColor: 'rgba(255, 215, 15, 0.1)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid rgba(255, 215, 15, 0.4)'
  },
  resultadoItemGanancia: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid rgba(34, 197, 94, 0.3)'
  },
  resultadoLabel: {
    color: '#9ca3af',
    fontSize: '13px',
    fontWeight: '500'
  },
  resultadoValue: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  desgloseTalleres: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  desgloseTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '16px'
  },
  talleresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  tallerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  tallerNombre: {
    color: '#d1d5db',
    fontSize: '14px',
    fontWeight: '500'
  },
  tallerCosto: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  confirmarActions: {
    marginTop: '28px',
    display: 'flex',
    justifyContent: 'center'
  },
  btnConfirmar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 40px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
  },
  errorMessage: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#f87171',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px'
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
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'slideIn 0.3s ease-out'
  },
  alertSuccess: {
    backgroundColor: '#10b981',
    color: '#ffffff'
  },
  alertError: {
    backgroundColor: '#ef4444',
    color: '#ffffff'
  },
  alertText: {
    flex: 1,
    fontWeight: '500'
  }
};

const styleSheet = `
  .select-input:focus {
    border-color: rgba(255, 215, 15, 1);
  }
  
  .text-input:focus {
    border-color: rgba(255, 215, 15, 1);
  }
  
  .hover-calcular:hover {
    opacity: 0.9;
  }
  
  .hover-confirmar:hover {
    background-color: #059669;
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

function RealizarPedido() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  
  const [prendas, setPrendas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [colores, setColores] = useState([]);
  const [talles, setTalles] = useState([]);

  const [formData, setFormData] = useState({
    prenda: "",
    marca: "",
    modelo: "",
    color: "",
    talle: "",
    cantidad: 1,
    porcentajeGanancia: 25,
  });

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    cargarPrendas();
  }, []);

  useEffect(() => {
    if (formData.prenda) {
      cargarMarcasPorPrenda(formData.prenda);
      cargarModelosPorPrenda(formData.prenda);
      cargarColoresPorPrenda(formData.prenda);
      cargarTallesPorPrenda(formData.prenda);
    }
  }, [formData.prenda]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const cargarPrendas = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/prendas/");
      const data = await response.json();
      setPrendas(data);
    } catch (err) {
      console.error("Error al cargar prendas:", err);
    }
  };

  const cargarMarcasPorPrenda = async (prendaId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/prendas/${prendaId}/marcas/`);
      const data = await response.json();
      setMarcas(data);
    } catch (err) {
      console.error("Error al cargar marcas:", err);
    }
  };

  const cargarModelosPorPrenda = async (prendaId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/prendas/${prendaId}/modelos/`);
      const data = await response.json();
      setModelos(data);
    } catch (err) {
      console.error("Error al cargar modelos:", err);
    }
  };

  const cargarColoresPorPrenda = async (prendaId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/prendas/${prendaId}/colores/`);
      const data = await response.json();
      setColores(data);
    } catch (err) {
      console.error("Error al cargar colores:", err);
    }
  };

  const cargarTallesPorPrenda = async (prendaId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/prendas/${prendaId}/talles/`);
      const data = await response.json();
      setTalles(data);
    } catch (err) {
      console.error("Error al cargar talles:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (resultado) {
      setResultado(null);
    }
  };

  const calcularCostos = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch("http://localhost:8000/api/calculador-costos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prenda_id: formData.prenda,
          marca_id: formData.marca,
          modelo_id: formData.modelo,
          color_id: formData.color,
          talle_id: formData.talle,
          cantidad: parseInt(formData.cantidad),
          porcentaje_ganancia: parseFloat(formData.porcentajeGanancia),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al calcular los costos");
      }

      const data = await response.json();
      setResultado(data);
      showAlert('Cálculo realizado exitosamente', 'success');
    } catch (err) {
      setError(err.message);
      showAlert(err.message, 'error');
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmarPedido = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/pedidos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prenda_id: formData.prenda,
          marca_id: formData.marca,
          modelo_id: formData.modelo,
          color_id: formData.color,
          talle_id: formData.talle,
          cantidad: parseInt(formData.cantidad),
          porcentaje_ganancia: parseFloat(formData.porcentajeGanancia),
          ...resultado,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el pedido");
      }

      showAlert('¡Pedido creado exitosamente!', 'success');
      
      setFormData({
        prenda: "",
        marca: "",
        modelo: "",
        color: "",
        talle: "",
        cantidad: 1,
        porcentajeGanancia: 25,
      });
      setResultado(null);
    } catch (err) {
      showAlert('Error al crear el pedido: ' + err.message, 'error');
      console.error("Error:", err);
    }
  };

  return (
    <>
      <style>{styleSheet}</style>
      
      <div>
        <Componente onToggle={setIsNavbarCollapsed} />
        
        <div style={{
          ...styles.pedidoContainer,
          backgroundImage: `url(${fondoImg})`,
          marginLeft: isNavbarCollapsed ? '70px' : '250px'
        }}>
          <div style={styles.contentWrapper}>
            <div style={styles.header}>
              <h1 style={styles.title}>Calculador de Costos</h1>
              <p style={styles.subtitle}>Complete los datos para calcular el costo de fabricación</p>
            </div>

            <div style={styles.mainContent}>
              <div style={styles.formContainer}>
                <form onSubmit={calcularCostos}>
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Prenda *</label>
                      <select
                        name="prenda"
                        value={formData.prenda}
                        onChange={handleChange}
                        style={styles.select}
                        className="select-input"
                        required
                      >
                        <option value="">Seleccione una prenda</option>
                        {prendas.map((prenda) => (
                          <option key={prenda.Prenda_ID} value={prenda.Prenda_ID}>
                            {prenda.Prenda_nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Marca *</label>
                      <select
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        style={formData.prenda ? styles.select : styles.selectDisabled}
                        className="select-input"
                        disabled={!formData.prenda}
                        required
                      >
                        <option value="">Seleccione una marca</option>
                        {marcas.map((marca) => (
                          <option key={marca.Marca_ID} value={marca.Marca_ID}>
                            {marca.Marca_nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Modelo *</label>
                      <select
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        style={formData.prenda ? styles.select : styles.selectDisabled}
                        className="select-input"
                        disabled={!formData.prenda}
                        required
                      >
                        <option value="">Seleccione un modelo</option>
                        {modelos.map((modelo) => (
                          <option key={modelo.Modelo_ID} value={modelo.Modelo_ID}>
                            {modelo.Modelo_nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Color *</label>
                      <select
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        style={formData.prenda ? styles.select : styles.selectDisabled}
                        className="select-input"
                        disabled={!formData.prenda}
                        required
                      >
                        <option value="">Seleccione un color</option>
                        {colores.map((color) => (
                          <option key={color.Color_ID} value={color.Color_ID}>
                            {color.Color_nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Talle *</label>
                      <select
                        name="talle"
                        value={formData.talle}
                        onChange={handleChange}
                        style={formData.prenda ? styles.select : styles.selectDisabled}
                        className="select-input"
                        disabled={!formData.prenda}
                        required
                      >
                        <option value="">Seleccione un talle</option>
                        {talles.map((talle) => (
                          <option key={talle.Talle_ID} value={talle.Talle_ID}>
                            {talle.Talle_codigo}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Cantidad *</label>
                      <input
                        type="number"
                        name="cantidad"
                        value={formData.cantidad}
                        onChange={handleChange}
                        min="1"
                        style={styles.input}
                        className="text-input"
                        required
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Porcentaje de Ganancia (%) *</label>
                      <input
                        type="number"
                        name="porcentajeGanancia"
                        value={formData.porcentajeGanancia}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        style={styles.input}
                        className="text-input"
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.formActions}>
                    <button
                      type="submit"
                      style={loading ? styles.btnCalcularDisabled : styles.btnCalcular}
                      className="hover-calcular"
                      disabled={loading}
                    >
                      <Calculator style={{ width: '20px', height: '20px' }} />
                      {loading ? "Calculando..." : "Calcular Costos"}
                    </button>
                  </div>

                  {error && (
                    <div style={styles.errorMessage}>
                      <AlertCircle style={{ width: '20px', height: '20px' }} />
                      {error}
                    </div>
                  )}
                </form>
              </div>

              {resultado && (
                <div style={styles.resultadoContainer}>
                  <h3 style={styles.resultadoTitle}>
                    <Package style={{ width: '28px', height: '28px', color: 'rgba(255, 215, 15, 1)' }} />
                    Resultado del Cálculo
                  </h3>

                  <div style={styles.resultadoGrid}>
                    <div style={styles.resultadoItem}>
                      <span style={styles.resultadoLabel}>Costo de Insumos (unitario):</span>
                      <span style={styles.resultadoValue}>
                        ${resultado.costo_insumos_unitario.toFixed(2)}
                      </span>
                    </div>

                    <div style={styles.resultadoItem}>
                      <span style={styles.resultadoLabel}>Costo de Mano de Obra (unitario):</span>
                      <span style={styles.resultadoValue}>
                        ${resultado.costo_mano_obra_unitario.toFixed(2)}
                      </span>
                    </div>

                    <div style={styles.resultadoItemDestacado}>
                      <span style={styles.resultadoLabel}>Costo Total (unitario):</span>
                      <span style={styles.resultadoValue}>
                        ${resultado.costo_total_unitario.toFixed(2)}
                      </span>
                    </div>

                    <div style={styles.resultadoItemSuccess}>
                      <span style={styles.resultadoLabel}>Precio de Venta (unitario):</span>
                      <span style={styles.resultadoValue}>
                        ${resultado.precio_venta_unitario.toFixed(2)}
                      </span>
                    </div>

                    <div style={styles.resultadoItem}>
                      <span style={styles.resultadoLabel}>Cantidad:</span>
                      <span style={styles.resultadoValue}>{formData.cantidad} unidades</span>
                    </div>

                    <div style={styles.resultadoItemTotal}>
                      <span style={styles.resultadoLabel}>Total del Pedido:</span>
                      <span style={styles.resultadoValue}>
                        ${resultado.precio_venta_total.toFixed(2)}
                      </span>
                    </div>

                    <div style={styles.resultadoItemGanancia}>
                      <span style={styles.resultadoLabel}>Ganancia Total:</span>
                      <span style={styles.resultadoValue}>
                        ${resultado.ganancia_total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {resultado.desglose_talleres && resultado.desglose_talleres.length > 0 && (
                    <div style={styles.desgloseTalleres}>
                      <h4 style={styles.desgloseTitle}>Desglose por Talleres</h4>
                      <div style={styles.talleresList}>
                        {resultado.desglose_talleres.map((taller, index) => (
                          <div key={index} style={styles.tallerItem}>
                            <span style={styles.tallerNombre}>{taller.taller}</span>
                            <span style={styles.tallerCosto}>
                              ${taller.costo.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={styles.confirmarActions}>
                    <button
                      onClick={confirmarPedido}
                      style={styles.btnConfirmar}
                      className="hover-confirmar"
                    >
                      <CheckCircle style={{ width: '20px', height: '20px' }} />
                      Confirmar Pedido
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {alert && (
          <div style={{
            ...styles.alert,
            ...(alert.type === 'success' ? styles.alertSuccess : styles.alertError)
          }}>
            {alert.type === 'success' ? (
              <CheckCircle style={{ width: '24px', height: '24px' }} />
            ) : (
              <AlertCircle style={{ width: '24px', height: '24px' }} />
            )}
            <span style={styles.alertText}>{alert.message}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default RealizarPedido;