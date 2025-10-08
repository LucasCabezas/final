import React, { useState, useEffect } from "react";
import "./Inicio.css";
import Componente from "./componente.jsx"; // Sidebar
import { useNavigate } from "react-router-dom";

function Dueno({ usuarioId }) {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioId) return;

    fetch(`http://localhost:8000/api/usuarios/${usuarioId}`)
      .then((res) => res.json())
      .then((data) => setUsuario(data))
      .catch((err) => console.error("Error al cargar usuario:", err));
  }, [usuarioId]);

  return (
    <div className="dueno-dashboard">
      {/* Sidebar */}
      <Componente />

      {/* Contenido principal */}
      <main className="contendor">
        <div className="welcome">
          <h2>
            Bienvenido,{" "}
            {usuario
              ? `${usuario.Usuario_nombre} ${usuario.Usuario_apellido}`
              : "..."}
          </h2>
        </div>

        {/* Resumen */}
        <section className="resumen">
          <div className="resumen-item">
            <h3>Valor Total</h3>
            <p>$120.000</p>
          </div>
          <div className="resumen-item">
            <h3>Artículos Bajo Stock</h3>
            <p>5</p>
          </div>
          <div className="resumen-item">
            <h3>Distribución</h3>
            <div className="grafico">
              <div
                className="barra"
                style={{ width: "40%", backgroundColor: "#f39c12" }}
              ></div>
              <div
                className="barra"
                style={{ width: "30%", backgroundColor: "#e74c3c" }}
              ></div>
              <div
                className="barra"
                style={{ width: "30%", backgroundColor: "#3498db" }}
              ></div>
            </div>
          </div>
        </section>

        {/* Alertas */}
        <section className="alertas">
          <h3>Alertas Recientes</h3>
          <ul>
            <li>Stock de camisetas casi agotado</li>
            <li>Nuevo pedido recibido</li>
            <li>Insumos retrasados en entrega</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Dueno;
