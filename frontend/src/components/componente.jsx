import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaUserPlus,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import logo from "./assets/logo.png";

function Componente({ onToggle }) {
  const [openInventario, setOpenInventario] = useState(false);
  const [openPedidos, setOpenPedidos] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navigate = useNavigate();

  const handleRealizarPedido = () => {
    navigate("/realizar-pedido");
  };

  const handleAprobacionPedidos = () => {
    navigate("/aprobacion-pedidos");
  };

  const handleInicio = () => {
    navigate("/Dueno");
  };

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const handleCerrarSesion = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      // Limpiar localStorage, sessionStorage o tokens
      localStorage.clear();
      sessionStorage.clear();
      
      // Mostrar alerta de éxito
      alert('✅ Sesión cerrada exitosamente');
      
      // Redirigir al login
      navigate('/');
    }
  };

  const styles = {
    sidebar: {
      width: isCollapsed ? '70px' : '250px',
      height: '100vh',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      zIndex: 1000,
      borderRight: '1px solid rgba(255, 215, 15, 0.1)'
    },
    toggleBtn: {
      position: 'absolute',
      right: '-12px',
      top: '30px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: 'rgba(255, 215, 15, 1)',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#000',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(255, 215, 15, 0.4)',
      zIndex: 1001
    },
    logoContainer: {
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 215, 15, 0.2)',
      minHeight: '80px'
    },
    logo: {
      width: isCollapsed ? '40px' : '120px',
      transition: 'width 0.3s ease',
      filter: 'drop-shadow(0 0 10px rgba(255, 215, 15, 0.3))'
    },
    menu: {
      listStyle: 'none',
      padding: '20px 0',
      margin: 0,
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    menuItem: {
      marginBottom: '5px'
    },
    menuLabel: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: isCollapsed ? 'center' : 'space-between',
      padding: isCollapsed ? '15px' : '15px 20px',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderLeft: '3px solid transparent',
      position: 'relative'
    },
    menuTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    icon: {
      fontSize: '20px',
      color: 'rgba(255, 215, 15, 1)',
      minWidth: '20px'
    },
    menuText: {
      fontSize: '15px',
      fontWeight: '500'
    },
    arrow: {
      fontSize: '20px',
      transition: 'transform 0.3s ease'
    },
    arrowOpen: {
      fontSize: '20px',
      transition: 'transform 0.3s ease',
      transform: 'rotate(180deg)'
    },
    submenu: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      maxHeight: 0,
      overflow: 'hidden',
      transition: 'max-height 0.3s ease',
      background: 'rgba(0, 0, 0, 0.3)'
    },
    submenuShow: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      maxHeight: '200px',
      overflow: 'hidden',
      transition: 'max-height 0.3s ease',
      background: 'rgba(0, 0, 0, 0.3)'
    },
    submenuItem: {
      padding: '12px 20px 12px 55px',
      color: '#ccc',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease'
    },
    logoutContainer: {
      padding: '20px',
      borderTop: '1px solid rgba(255, 215, 15, 0.2)'
    },
    logoutButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: isCollapsed ? 'center' : 'flex-start',
      gap: '15px',
      padding: isCollapsed ? '15px' : '15px 20px',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '8px',
      color: '#ef4444',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '15px',
      fontWeight: '500'
    }
  };

  return (
    <aside style={styles.sidebar}>
      {/* Toggle */}
      <button 
        style={styles.toggleBtn}
        onClick={handleToggle}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </button>

      {/* Logo */}
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>

      {/* Menú */}
      <ul style={styles.menu}>
        {/* Inicio */}
        <li style={styles.menuItem}>
          <div 
            style={styles.menuLabel}
            onClick={handleInicio}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 15, 0.1)';
              e.currentTarget.style.borderLeft = '3px solid rgba(255, 215, 15, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderLeft = '3px solid transparent';
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
            onClick={() => setOpenInventario(v => !v)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 15, 0.1)';
              e.currentTarget.style.borderLeft = '3px solid rgba(255, 215, 15, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderLeft = '3px solid transparent';
            }}
          >
            <div style={styles.menuTitle}>
              <FaBoxOpen style={styles.icon} />
              {!isCollapsed && <span style={styles.menuText}>Inventario</span>}
            </div>
            {!isCollapsed && (
              <MdKeyboardArrowDown style={openInventario ? styles.arrowOpen : styles.arrow} />
            )}
          </div>
          {!isCollapsed && (
            <ul style={openInventario ? styles.submenuShow : styles.submenu}>
              <li 
                style={styles.submenuItem}
                onClick={() => navigate("/Insumos")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 215, 15, 1)';
                  e.currentTarget.style.paddingLeft = '60px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ccc';
                  e.currentTarget.style.paddingLeft = '55px';
                }}
              >
                Insumos
              </li>
              <li 
                style={styles.submenuItem}
                onClick={() => navigate("/prendas")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 215, 15, 1)';
                  e.currentTarget.style.paddingLeft = '60px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ccc';
                  e.currentTarget.style.paddingLeft = '55px';
                }}
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
            onClick={() => setOpenPedidos(v => !v)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 15, 0.1)';
              e.currentTarget.style.borderLeft = '3px solid rgba(255, 215, 15, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderLeft = '3px solid transparent';
            }}
          >
            <div style={styles.menuTitle}>
              <FaShoppingCart style={styles.icon} />
              {!isCollapsed && <span style={styles.menuText}>Pedidos</span>}
            </div>
            {!isCollapsed && (
              <MdKeyboardArrowDown style={openPedidos ? styles.arrowOpen : styles.arrow} />
            )}
          </div>
          {!isCollapsed && (
            <ul style={openPedidos ? styles.submenuShow : styles.submenu}>
              <li 
                style={styles.submenuItem}
                onClick={handleRealizarPedido}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 215, 15, 1)';
                  e.currentTarget.style.paddingLeft = '60px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ccc';
                  e.currentTarget.style.paddingLeft = '55px';
                }}
              >
                Realizar pedido
              </li>
              <li 
                style={styles.submenuItem}
                onClick={handleAprobacionPedidos}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 215, 15, 1)';
                  e.currentTarget.style.paddingLeft = '60px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ccc';
                  e.currentTarget.style.paddingLeft = '55px';
                }}
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
            onClick={() => navigate("/agregarUsuario")}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 15, 0.1)';
              e.currentTarget.style.borderLeft = '3px solid rgba(255, 215, 15, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderLeft = '3px solid transparent';
            }}
          >
            <div style={styles.menuTitle}>
              <FaUserPlus style={styles.icon} />
              {!isCollapsed && <span style={styles.menuText}>Usuarios</span>}
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
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          }}
        >
          <FaSignOutAlt style={{ fontSize: '20px', minWidth: '20px' }} />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}

export default Componente;