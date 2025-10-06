import React, { useState, useEffect } from "react";
import "./RealizarPedido.css";
import Componente from "./componente.jsx";

function RealizarPedido() {
  // Estados para los dropdowns
  const [prendas, setPrendas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [colores, setColores] = useState([]);
  const [talles, setTalles] = useState([]);

  // Estados del formulario
  const [formData, setFormData] = useState({
    prenda: "",
    marca: "",
    modelo: "",
    color: "",
    talle: "",
    cantidad: 1,
    porcentajeGanancia: 25,
  });

  // Estado del resultado del cálculo
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarPrendas();
  }, []);

  // Cargar opciones relacionadas cuando cambia la prenda
  useEffect(() => {
    if (formData.prenda) {
      cargarMarcasPorPrenda(formData.prenda);
      cargarModelosPorPrenda(formData.prenda);
      cargarColoresPorPrenda(formData.prenda);
      cargarTallesPorPrenda(formData.prenda);
    }
  }, [formData.prenda]);

  // Funciones para cargar datos del backend
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
      const response = await fetch(
        `http://localhost:8000/api/prendas/${prendaId}/marcas/`
      );
      const data = await response.json();
      setMarcas(data);
    } catch (err) {
      console.error("Error al cargar marcas:", err);
    }
  };

  const cargarModelosPorPrenda = async (prendaId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/prendas/${prendaId}/modelos/`
      );
      const data = await response.json();
      setModelos(data);
    } catch (err) {
      console.error("Error al cargar modelos:", err);
    }
  };

  const cargarColoresPorPrenda = async (prendaId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/prendas/${prendaId}/colores/`
      );
      const data = await response.json();
      setColores(data);
    } catch (err) {
      console.error("Error al cargar colores:", err);
    }
  };

  const cargarTallesPorPrenda = async (prendaId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/prendas/${prendaId}/talles/`
      );
      const data = await response.json();
      setTalles(data);
    } catch (err) {
      console.error("Error al cargar talles:", err);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar resultado cuando cambian los valores
    if (resultado) {
      setResultado(null);
    }
  };

  // Calcular costos
  const calcularCostos = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch(
        "http://localhost:8000/api/calculador-costos/",
        {
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
        }
      );

      if (!response.ok) {
        throw new Error("Error al calcular los costos");
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Confirmar y crear el pedido
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

      alert("¡Pedido creado exitosamente!");
      
      // Limpiar formulario
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
      alert("Error al crear el pedido: " + err.message);
      console.error("Error:", err);
    }
  };

  return (
    <div className="realizar-pedido-container">
      <Componente />

      <main className="contendor">
        <div className="page-header">
          <h2>Calculador de Costos - Realizar Pedido</h2>
          <p>Complete los datos para calcular el costo de fabricación</p>
        </div>

        <div className="calculador-content">
          {/* Formulario */}
          <form onSubmit={calcularCostos} className="calculador-form">
            <div className="form-grid">
              {/* Prenda */}
              <div className="form-group">
                <label htmlFor="prenda">Prenda *</label>
                <select
                  id="prenda"
                  name="prenda"
                  value={formData.prenda}
                  onChange={handleChange}
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

              {/* Marca */}
              <div className="form-group">
                <label htmlFor="marca">Marca *</label>
                <select
                  id="marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
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

              {/* Modelo */}
              <div className="form-group">
                <label htmlFor="modelo">Modelo *</label>
                <select
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
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

              {/* Color */}
              <div className="form-group">
                <label htmlFor="color">Color *</label>
                <select
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
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

              {/* Talle */}
              <div className="form-group">
                <label htmlFor="talle">Talle *</label>
                <select
                  id="talle"
                  name="talle"
                  value={formData.talle}
                  onChange={handleChange}
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

              {/* Cantidad */}
              <div className="form-group">
                <label htmlFor="cantidad">Cantidad *</label>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              {/* Porcentaje de Ganancia */}
              <div className="form-group">
                <label htmlFor="porcentajeGanancia">
                  Porcentaje de Ganancia (%) *
                </label>
                <input
                  type="number"
                  id="porcentajeGanancia"
                  name="porcentajeGanancia"
                  value={formData.porcentajeGanancia}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                />
              </div>
            </div>

            {/* Botón calcular */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn-calcular"
                disabled={loading}
              >
                {loading ? "Calculando..." : "Calcular Costos"}
              </button>
            </div>

            {/* Error */}
            {error && <div className="error-message">{error}</div>}
          </form>

          {/* Resultado */}
          {resultado && (
            <div className="resultado-container">
              <h3>Resultado del Cálculo</h3>

              <div className="resultado-grid">
                <div className="resultado-item">
                  <span className="label">Costo de Insumos (unitario):</span>
                  <span className="value">
                    ${resultado.costo_insumos_unitario.toFixed(2)}
                  </span>
                </div>

                <div className="resultado-item">
                  <span className="label">Costo de Mano de Obra (unitario):</span>
                  <span className="value">
                    ${resultado.costo_mano_obra_unitario.toFixed(2)}
                  </span>
                </div>

                <div className="resultado-item destacado">
                  <span className="label">Costo Total (unitario):</span>
                  <span className="value">
                    ${resultado.costo_total_unitario.toFixed(2)}
                  </span>
                </div>

                <div className="resultado-item success">
                  <span className="label">Precio de Venta (unitario):</span>
                  <span className="value">
                    ${resultado.precio_venta_unitario.toFixed(2)}
                  </span>
                </div>

                <div className="resultado-item">
                  <span className="label">Cantidad:</span>
                  <span className="value">{formData.cantidad} unidades</span>
                </div>

                <div className="resultado-item total">
                  <span className="label">Total del Pedido:</span>
                  <span className="value">
                    ${resultado.precio_venta_total.toFixed(2)}
                  </span>
                </div>

                <div className="resultado-item ganancia">
                  <span className="label">Ganancia Total:</span>
                  <span className="value">
                    ${resultado.ganancia_total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Desglose de talleres */}
              {resultado.desglose_talleres && resultado.desglose_talleres.length > 0 && (
                <div className="desglose-talleres">
                  <h4>Desglose por Talleres</h4>
                  <div className="talleres-list">
                    {resultado.desglose_talleres.map((taller, index) => (
                      <div key={index} className="taller-item">
                        <span className="taller-nombre">{taller.taller}</span>
                        <span className="taller-costo">
                          ${taller.costo.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón confirmar pedido */}
              <div className="confirmar-actions">
                <button
                  onClick={confirmarPedido}
                  className="btn-confirmar"
                >
                  Confirmar Pedido
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default RealizarPedido;