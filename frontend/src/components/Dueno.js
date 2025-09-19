import React, { useState, useEffect, useRef } from "react";
import "./Dueno.css";
import avatar from "./assets/avatar.png";
import logo from "./assets/logo.png";
import {
  FiChevronDown,
  FiHome,
  FiBox,
  FiPackage,
  FiClipboard,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Dueno({ usuarioId }) {
  const [openPedidos, setOpenPedidos] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // Referencia al submenu para animación acordeón
  const submenuRef = useRef(null);

  // Traer datos del usuario desde la API
  useEffect(() => {
    if (!usuarioId) return;

    fetch(`http://localhost:8000/api/usuarios/${usuarioId}`)
      .then((res) => res.json())
      .then((data) => setUsuario(data))
      .catch((err) => console.error("Error al cargar usuario:", err));
  }, [usuarioId]);

  const handlePerfil = () => navigate("/perfil");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Controla altura del submenu tipo acordeón
  useEffect(() => {
    if (submenuRef.current) {
      if (openPedidos) {
        submenuRef.current.style.height = `${submenuRef.current.scrollHeight}px`;
      } else {
        submenuRef.current.style.height = "0px";
      }
    }
  }, [openPedidos]);

  return (
    <div className="dueno-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <ul className="menu">
          <li>
            <FiHome /> Inicio
          </li>
          <li>
            <FiBox /> Inventario
          </li>
          <li>
            <FiPackage /> Insumos
          </li>

          {/* Submenu tipo acordeón */}
          <li className="submenu-item">
            <div
              className="submenu-header"
              onClick={() => setOpenPedidos(!openPedidos)}
            >
              <FiClipboard />
              <span className="submenu-title">Pedidos</span>
              <FiChevronDown
                className={`chevron ${openPedidos ? "rotate" : ""}`}
              />
            </div>
            <ul className="submenu" ref={submenuRef}>
              <li>Pedidos Pendientes</li>
              <li>Pedidos Completados</li>
            </ul>
          </li>

          <li><FiBox />Prendas</li>
        </ul>
      </aside>

      {/* Panel principal */}
      <main className="main-panel">
        {/* Header */}
        <header className="header">
          <div className="welcome">
            <h2>
              Bienvenido,{" "}
              {usuario
                ? `${usuario.Usuario_nombre} ${usuario.Usuario_apellido}`
                : "..."}
            </h2>
          </div>
          <div className="header-right">
            <button className="btn-logout" onClick={handleLogout}>
              <FiLogOut /> Cerrar sesión
            </button>
            <button className="btn-avatar" onClick={handlePerfil}>
              <img src={avatar} alt="avatar" className="avatar" />
            </button>
          </div>
        </header>

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
