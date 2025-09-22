import { useState } from "react";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaCalculator,
  FaUserPlus,
} from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import logo from "./assets/logo.png";
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
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Toggle */}
      <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </button>

      {/* Logo */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Menú */}
      <ul className="menu">
        <li className="menu-item">
          <div className="menu-label" onClick={() => setOpenInventario(v => !v)}>
            <div className="menu-title">
              <FaBoxOpen className="icon" />
              {!isCollapsed && <span>Inventario</span>}
            </div>
            {!isCollapsed && <MdKeyboardArrowDown className={`arrow ${openInventario ? "open" : ""}`} />}
          </div>
          <ul className={`submenu ${openInventario ? "show" : ""}`}>
            <li onClick={() => console.log("Insumos clicked")}>Insumos</li>
            <li onClick={() => console.log("Prendas clicked")}>Prendas</li>
          </ul>
        </li>

        <li className="menu-item">
          <div className="menu-label" onClick={() => setOpenPedidos(v => !v)}>
            <div className="menu-title">
              <FaShoppingCart className="icon" />
              {!isCollapsed && <span>Pedidos</span>}
            </div>
            {!isCollapsed && <MdKeyboardArrowDown className={`arrow ${openPedidos ? "open" : ""}`} />}
          </div>
          <ul className={`submenu ${openPedidos ? "show" : ""}`}>
            <li onClick={() => console.log("Realizar pedido clicked")}>Realizar pedido</li>
            <li onClick={() => console.log("Aprobación de pedidos clicked")}>Aprobación de pedidos</li>
          </ul>
        </li>

        <li className="menu-item">
          <div className="menu-label">
            <FaCalculator className="icon" />
            {!isCollapsed && <span>Calculador de costos</span>}
          </div>
        </li>

        <li className="menu-item">
          <div className="menu-label">
            <FaUserPlus className="icon" />
            <a href="/agregarUsuario" style={{ color: "inherit", textDecoration: "none" }}>
              {!isCollapsed && "Agregar usuario"}
            </a>
          </div>
        </li>

        <li className="menu-item top-logout">
          <button className="btn-logout" onClick={handleLogout}>
            <FiLogOut /> {!isCollapsed && "Cerrar sesión"}
          </button>
        </li>
      </ul>

      {/* Avatar */}
      <button className="btn-avatar" onClick={handlePerfil}>
        <img src={avatar} alt="avatar" className="avatar" />
      </button>
    </aside>
  );
}

export default Componente;
