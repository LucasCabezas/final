import { useState } from "react";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaCalculator,
  FaUserPlus,
} from "react-icons/fa";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import logo from "./assets/logo.png"; // ajusta la ruta
import avatar from "./assets/avatar.png"; 
import "./componente.css";

function Componente() {
  const [openInventario, setOpenInventario] = useState(false);
  const [openPedidos, setOpenPedidos] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handlePerfil = () => {
    window.location.href = "/perfil";
  };

  return (
    <div className="app-container">
     <div className="buttons-top-right">
  <button className="btn-logout" onClick={handleLogout}>
    <FiLogOut /> Cerrar sesión
  </button>
  <button className="btn-avatar" onClick={handlePerfil}>
    <img src={avatar} alt="avatar" className="avatar" />
  </button>
</div>


      {/* SIDEBAR */}
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Botón para colapsar/expandir */}
        <button
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
        </button>

        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        {/* MENÚ */}
        <ul className="menu">
          {/* INVENTARIO */}
          <li className="menu-item">
            <div
              className="menu-label"
              onClick={(e) => {
                e.stopPropagation();
                setOpenInventario((v) => !v);
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaBoxOpen className="icon" />
                {!isCollapsed && <span>Inventario</span>}
              </div>
              {!isCollapsed && (
                <MdKeyboardArrowDown
                  className={`arrow ${openInventario ? "open" : ""}`}
                />
              )}
            </div>

            {openInventario && !isCollapsed && (
              <ul className="submenu">
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Insumos clicked");
                  }}
                >
                  Insumos
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Prendas clicked");
                  }}
                >
                  Prendas
                </li>
              </ul>
            )}
          </li>

          {/* PEDIDOS */}
          <li className="menu-item">
            <div
              className="menu-label"
              onClick={(e) => {
                e.stopPropagation();
                setOpenPedidos((v) => !v);
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaShoppingCart className="icon" />
                {!isCollapsed && <span>Pedidos</span>}
              </div>
              {!isCollapsed && (
                <MdKeyboardArrowDown
                  className={`arrow ${openPedidos ? "open" : ""}`}
                />
              )}
            </div>

            {openPedidos && !isCollapsed && (
              <ul className="submenu">
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Realizar pedido clicked");
                  }}
                >
                  Realizar pedido
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Aprobación de pedidos clicked");
                  }}
                >
                  Aprobación de pedidos
                </li>
              </ul>
            )}
          </li>

          {/* CALCULADORA */}
          <li className="menu-item">
            <div className="menu-label">
              <FaCalculator className="icon" />
              {!isCollapsed && "Calculador de costos"}
            </div>
          </li>

          {/* AGREGAR USUARIO */}
          <li className="menu-item">
            <div className="menu-label">
              <FaUserPlus className="icon" />
              <a
                href="/Agregarusuario"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {!isCollapsed && "Agregar usuario"}
              </a>
            </div>
          </li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        {/* Aquí van tus otras páginas o componentes */}
      </main>
    </div>
  );
}

export default Componente;


