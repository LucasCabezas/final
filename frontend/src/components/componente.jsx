// src/components/componente.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBoxOpen, FaShoppingCart, FaUserPlus, FaHome, FaSignOutAlt, FaUser, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import logo from "./assets/logo.png";

// Modal de Confirmación
function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      animation: "fadeIn 0.3s ease",
    },
    modal: {
      background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
      borderRadius: "12px",
      padding: "30px",
      maxWidth: "450px",
      width: "90%",
      animation: "slideIn 0.3s ease",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "20px",
    },
    icon: {
      fontSize: "32px",
      color: "#ef4444",
    },
    title: {
      fontSize: "22px",
      fontWeight: "600",
      color: "#fff",
      margin: 0,
    },
    message: {
      fontSize: "16px",
      color: "#ccc",
      marginBottom: "30px",
      lineHeight: "1.5",
    },
    buttonContainer: {
      display: "flex",
      gap: "15px",
      justifyContent: "flex-end",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      fontSize: "15px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    cancelButton: {
      background: "rgba(255, 255, 255, 0.1)",
      color: "#fff",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    confirmButton: {
      background: "rgba(239, 68, 68, 0.2)",
      color: "#ef4444",
      border: "1px solid rgba(239, 68, 68, 0.4)",
    },
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <FaExclamationTriangle style={styles.icon} />
            <h3 style={styles.title}>{title}</h3>
          </div>
          <p style={styles.message}>{message}</p>
          <div style={styles.buttonContainer}>
            <button
              style={{ ...styles.button, ...styles.cancelButton }}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              Cancelar
            </button>
            <button
              style={{ ...styles.button, ...styles.confirmButton }}
              onClick={onConfirm}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Modal de Éxito
function SuccessModal({ isOpen, message }) {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      animation: "fadeIn 0.3s ease",
    },
    modal: {
      background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
      borderRadius: "12px",
      padding: "30px",
      maxWidth: "400px",
      width: "90%",
      animation: "slideIn 0.3s ease",
      textAlign: "center",
    },
    icon: {
      fontSize: "48px",
      color: "rgba(255, 215, 15, 1)",
      marginBottom: "20px",
      filter: "drop-shadow(0 0 10px rgba(255, 215, 15, 0.5))",
    },
    message: {
      fontSize: "18px",
      color: "#fff",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <FaCheckCircle style={styles.icon} />
        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
}

function Componente({ onToggle }) {
  const [openInventario, setOpenInventario] = useState(false);
  const [openPedidos, setOpenPedidos] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  
  const { logout } = useAuth();

  // --- Navegaciones ---
  const handleInicio = () => navigate("/Dueno");
  const handlePrendas = () => navigate("/Prendas");
  const handleRealizarPedido = () => navigate("/realizar-pedido");
  const handleAprobacionPedidos = () => navigate("/aprobacion-pedidos");
  const handleUsuarios = () => navigate("/agregarUsuario");
  const handlePerfil = () => navigate("/perfil");
  const handleInsumos = () => navigate("/Insumos");

  // --- Toggle Sidebar ---
  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onToggle) onToggle(newCollapsed);
  };

  // --- Cerrar Sesión ---
  const handleCerrarSesion = () => {
    setShowConfirmModal(true);
  };

  const confirmLogout = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
    
    // ✅ Llamar a logout del contexto
    logout();
    
    // ✅ Navegar manualmente al login
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1500);
  };

  // --- Estilos ---
  const styles = {
    sidebar: {
      width: isCollapsed ? "70px" : "250px",
      height: "100vh",
      background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
      position: "fixed",
      left: 0,
      top: 0,
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s ease",
      zIndex: 1000,
      borderRight: "1px solid rgba(255, 215, 15, 0.1)",
    },
    toggleBtn: {
      position: "absolute",
      right: "-12px",
      top: "30px",
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      background: "rgba(255, 215, 15, 1)",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#000",
      fontSize: "16px",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(255, 215, 15, 0.4)",
      zIndex: 1001,
    },
    logoContainer: {
      padding: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderBottom: "1px solid rgba(255, 215, 15, 0.2)",
      minHeight: "80px",
    },
    logo: {
      width: isCollapsed ? "40px" : "120px",
      transition: "width 0.3s ease",
      filter: "drop-shadow(0 0 10px rgba(255, 215, 15, 0.3))",
    },
    menu: {
      listStyle: "none",
      padding: "20px 0",
      margin: 0,
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
    },
    menuItem: { marginBottom: "5px" },
    menuLabel: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "15px 20px",
      color: "#fff",
      cursor: "pointer",
      transition: "all 0.3s ease",
      borderLeft: "3px solid transparent",
    },
    menuTitle: { display: "flex", alignItems: "center", gap: "15px" },
    icon: { fontSize: "20px", color: "rgba(255, 215, 15, 1)", minWidth: "20px" },
    menuText: { fontSize: "15px", fontWeight: "500" },
    arrow: { fontSize: "20px", transition: "transform 0.3s ease" },
    arrowOpen: { fontSize: "20px", transition: "transform 0.3s ease", transform: "rotate(180deg)" },
    submenu: { listStyle: "none", padding: 0, margin: 0, maxHeight: 0, overflow: "hidden", transition: "max-height 0.3s ease", background: "rgba(0,0,0,0.3)" },
    submenuShow: { listStyle: "none", padding: 0, margin: 0, maxHeight: "200px", overflow: "hidden", transition: "max-height 0.3s ease", background: "rgba(0,0,0,0.3)" },
    submenuItem: { padding: "12px 20px 12px 55px", color: "#ccc", cursor: "pointer", fontSize: "14px", transition: "all 0.3s ease" },
    logoutContainer: { padding: "20px", borderTop: "1px solid rgba(255, 215, 15, 0.2)" },
    logoutButton: { width: "100%", display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "flex-start", gap: "15px", padding: "15px 20px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", color: "#ef4444", cursor: "pointer", transition: "all 0.3s ease", fontSize: "15px", fontWeight: "500" },
  };

  return (
    <>
      <aside style={styles.sidebar}>
        {/* Botón de colapsar */}
        <button
          style={styles.toggleBtn}
          onClick={handleToggle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
        </button>

        {/* Logo */}
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>

        {/* Menú principal */}
        <ul style={styles.menu}>
          {/* Inicio */}
          <li style={styles.menuItem}>
            <div
              style={styles.menuLabel}
              onClick={handleInicio}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,215,15,0.1)";
                e.currentTarget.style.borderLeft = "3px solid rgba(255,215,15,1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderLeft = "3px solid transparent";
              }}
            >
              <div style={styles.menuTitle}>
                <FaHome style={styles.icon} />
                {!isCollapsed && <span style={styles.menuText}>Inicio</span>}
              </div>
            </div>
          </li>

          {/* Inventario */}
          <li style={styles.menuItem}>
            <div
              style={styles.menuLabel}
              onClick={() => setOpenInventario((v) => !v)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,215,15,0.1)";
                e.currentTarget.style.borderLeft = "3px solid rgba(255,215,15,1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderLeft = "3px solid transparent";
              }}
            >
              <div style={styles.menuTitle}>
                <FaBoxOpen style={styles.icon} />
                {!isCollapsed && <span style={styles.menuText}>Inventario</span>}
              </div>
              {!isCollapsed && <MdKeyboardArrowDown style={openInventario ? styles.arrowOpen : styles.arrow} />}
            </div>
            {!isCollapsed && (
              <ul style={openInventario ? styles.submenuShow : styles.submenu}>
                <li
                  style={styles.submenuItem}
                  onClick={handleInsumos}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255, 215, 15, 1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
                >
                  Insumos
                </li>
                <li
                  style={styles.submenuItem}
                  onClick={handlePrendas}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255, 215, 15, 1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
                >
                  Prendas
                </li>
              </ul>
            )}
          </li>

          {/* Pedidos */}
          <li style={styles.menuItem}>
            <div
              style={styles.menuLabel}
              onClick={() => setOpenPedidos((v) => !v)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,215,15,0.1)";
                e.currentTarget.style.borderLeft = "3px solid rgba(255,215,15,1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderLeft = "3px solid transparent";
              }}
            >
              <div style={styles.menuTitle}>
                <FaShoppingCart style={styles.icon} />
                {!isCollapsed && <span style={styles.menuText}>Pedidos</span>}
              </div>
              {!isCollapsed && <MdKeyboardArrowDown style={openPedidos ? styles.arrowOpen : styles.arrow} />}
            </div>
            {!isCollapsed && (
              <ul style={openPedidos ? styles.submenuShow : styles.submenu}>
                <li
                  style={styles.submenuItem}
                  onClick={handleRealizarPedido}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255, 215, 15, 1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
                >
                  Realizar pedido
                </li>
                <li
                  style={styles.submenuItem}
                  onClick={handleAprobacionPedidos}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255, 215, 15, 1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
                >
                  Aprobación de pedidos
                </li>
              </ul>
            )}
          </li>

          {/* Usuarios */}
          <li style={styles.menuItem}>
            <div
              style={styles.menuLabel}
              onClick={handleUsuarios}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,215,15,0.1)";
                e.currentTarget.style.borderLeft = "3px solid rgba(255,215,15,1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderLeft = "3px solid transparent";
              }}
            >
              <div style={styles.menuTitle}>
                <FaUserPlus style={styles.icon} />
                {!isCollapsed && <span style={styles.menuText}>Usuarios</span>}
              </div>
            </div>
          </li>

          {/* Perfil */}
          <li style={styles.menuItem}>
            <div
              style={styles.menuLabel}
              onClick={handlePerfil}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,215,15,0.1)";
                e.currentTarget.style.borderLeft = "3px solid rgba(255,215,15,1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderLeft = "3px solid transparent";
              }}
            >
              <div style={styles.menuTitle}>
                <FaUser style={styles.icon} />
                {!isCollapsed && <span style={styles.menuText}>Perfil</span>}
              </div>
            </div>
          </li>
        </ul>

        {/* Botón Cerrar Sesión */}
        <div style={styles.logoutContainer}>
          <button
            style={styles.logoutButton}
            onClick={handleCerrarSesion}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
              e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
            }}
          >
            <FaSignOutAlt style={{ fontSize: "20px", minWidth: "20px" }} />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Modales Personalizados */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmLogout}
        title="Confirmar cierre de sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
      />

      <SuccessModal
        isOpen={showSuccessModal}
        message="Sesión cerrada exitosamente"
      />
    </>
  );
}

export default Componente;