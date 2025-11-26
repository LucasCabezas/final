// src/components/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiAlertTriangle, FiShield, FiClock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import logo from "./assets/logo.png";
import fondoImg from "./assets/fondo.png";
import Recuperar from "./Recuperar";

const styles = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '20px',
    position: 'relative'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '420px'
  },
  logo: {
    width: '200px',
    height: 'auto',
    marginBottom: '40px',
    filter: 'drop-shadow(0 8px 16px rgba(255, 215, 15, 0.3))',
    transition: 'transform 0.3s ease'
  },
  loginBox: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 215, 15, 0.2)',
    border: '1px solid rgba(255, 215, 15, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '32px',
    letterSpacing: '0.5px',
    background: 'linear-gradient(135deg, #FFD70F 0%, #FFA500 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#b0b0b0',
    marginLeft: '4px'
  },
  input: {
    width: '100%',
    padding: '16px 18px',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    color: '#e8e8e8',
    border: '2px solid rgba(60, 60, 60, 0.5)',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  inputContainer: {
    position: 'relative',
    width: '100%'
  },
  eyeIcon: {
    position: 'absolute',
    right: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#888888',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    padding: '4px'
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#FFD70F',
    color: '#101010',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    fontFamily: 'inherit',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 15px rgba(255, 215, 15, 0.3)'
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: '#555555',
    color: '#999999',
    boxShadow: 'none'
  },
  recuperarButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '12px',
    fontFamily: 'inherit'
  },
  mensaje: {
    marginTop: '24px',
    padding: '16px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    animation: 'slideIn 0.4s ease-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    lineHeight: '1.5'
  },
  mensajeSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
  },
  mensajeError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
  },
  mensajeWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: '#f59e0b',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
  },
  mensajeBlocked: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    color: '#dc2626',
    border: '1px solid rgba(220, 38, 38, 0.4)',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
  },
  attemptsBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: '#f59e0b',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    marginTop: '12px',
    border: '1px solid rgba(245, 158, 11, 0.3)'
  },
  lockoutTimer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '16px',
    padding: '12px 16px',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: '10px',
    border: '1px solid rgba(220, 38, 38, 0.3)'
  },
  timerText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#dc2626',
    fontFamily: 'monospace'
  }
};

const styleSheet = `
  .login-input:focus {
    border-color: #FFD70F;
    box-shadow: 0 0 0 4px rgba(255, 215, 15, 0.15);
    background-color: rgba(35, 35, 35, 0.9);
  }

  .login-input:hover:not(:disabled) {
    border-color: rgba(255, 215, 15, 0.4);
  }

  .login-submit-button:hover:not(:disabled) {
    background-color: #FFA500;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 215, 15, 0.4);
  }

  .login-submit-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(255, 215, 15, 0.3);
  }

  .login-recuperar-button:hover {
    color: #FFD70F;
    background-color: rgba(255, 215, 15, 0.1);
  }

  .login-eye-icon:hover {
    color: #FFD70F;
    transform: translateY(-50%) scale(1.1);
  }

  .login-logo:hover {
    transform: scale(1.05);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .login-timer-pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    .login-box-responsive {
      padding: 32px 28px;
    }
  }
`;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mostrarRecuperar, setMostrarRecuperar] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // 🔥 TIMER PARA CUENTA REGRESIVA DE BLOQUEO
  useEffect(() => {
    if (remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setMensaje("");
          setTipoMensaje("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const formatTime = (seconds) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}m ${secs}s`;
    }
    return `${seconds}s`;
  };

  const validarCampos = () => {
    if (!username.trim()) {
      setMensaje("⚠️ Por favor ingresa tu usuario");
      setTipoMensaje("warning");
      return false;
    }
    if (!password.trim()) {
      setMensaje("⚠️ Por favor ingresa tu contraseña");
      setTipoMensaje("warning");
      return false;
    }
    if (password.length < 4) {
      setMensaje("⚠️ La contraseña debe tener al menos 4 caracteres");
      setTipoMensaje("warning");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      setLoading(true);
      setMensaje("");

      console.log("🔐 Intentando login...");

      const success = await login({
        username: username,
        password: password
      });

      if (success) {
        setMensaje("✅ ¡Inicio de sesión exitoso!");
        setTipoMensaje("success");
        setAttempts(0);
        setRemainingTime(0);

        setTimeout(() => {
          const rutas = {
            'Dueño': '/dueno',
            'Vendedor': '/vendedor',
            'Costurero': '/costurero',
            'Estampador': '/estampador'
          };

          const userData = JSON.parse(localStorage.getItem('usuario_data') || '{}');
          const rutaDestino = rutas[userData.rol];

          navigate(rutaDestino || '/', { replace: true });
          setLoading(false);
        }, 1000);

      } else {
        setMensaje("❌ Usuario o contraseña incorrectos");
        setTipoMensaje("error");
        setLoading(false);
      }

    } catch (error) {
      console.error("❌ Error completo en login:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error response data:", error.response?.data);
      
      // 🔥 MANEJO DE ERRORES DE BLOQUEO
      if (error.response?.data) {
        const errorData = error.response.data;
        console.log("📦 Datos del error:", errorData);
        
        const { non_field_errors, locked, remaining_time, attempts: failedAttempts } = errorData;
        
        if (locked && remaining_time) {
          console.log("🔒 Usuario bloqueado. Tiempo restante:", remaining_time);
          setRemainingTime(remaining_time);
          setMensaje(non_field_errors || "🔒 Cuenta bloqueada temporalmente");
          setTipoMensaje("blocked");
        } else if (failedAttempts) {
          console.log("⚠️ Intentos fallidos:", failedAttempts);
          setAttempts(failedAttempts);
          setMensaje(non_field_errors || "❌ Credenciales incorrectas");
          setTipoMensaje("error");
        } else if (non_field_errors) {
          console.log("⚠️ Error de campos:", non_field_errors);
          setMensaje(Array.isArray(non_field_errors) ? non_field_errors[0] : non_field_errors);
          setTipoMensaje("error");
        } else {
          setMensaje("❌ Error al iniciar sesión");
          setTipoMensaje("error");
        }
      } else if (error.message) {
        console.log("⚠️ Error message:", error.message);
        setMensaje(error.message);
        setTipoMensaje("warning");
      } else {
        setMensaje("⚠️ Error de conexión con el servidor");
        setTipoMensaje("warning");
      }
      
      setLoading(false);
    }
  };

  if (mostrarRecuperar) {
    return <Recuperar volverAlLogin={() => setMostrarRecuperar(false)} />;
  }

  const isBlocked = remainingTime > 0;

  return (
    <>
      <style>{styleSheet}</style>
      
      <div 
        style={{
          ...styles.loginContainer,
          backgroundImage: `url(${fondoImg})`
        }}
      >
        <div style={styles.overlay}></div>
        
        <div style={styles.contentWrapper}>
          <img 
            src={logo} 
            alt="Logo King Importados" 
            style={styles.logo}
            className="login-logo"
          />
          
          <div style={styles.loginBox} className="login-box-responsive">
            <h1 style={styles.title}>Inicio de Sesión</h1>

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Correo Electrónico</label>
                <input
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  className="login-input"
                  required
                  disabled={loading || isBlocked}
                  autoComplete="username"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Contraseña</label>
                <div style={styles.inputContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{...styles.input, paddingRight: '52px'}}
                    className="login-input"
                    required
                    disabled={loading || isBlocked}
                    autoComplete="current-password"
                  />
                  <span
                    style={styles.eyeIcon}
                    className="login-eye-icon"
                    onClick={() => !isBlocked && setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </span>
                </div>
              </div>

              {/* 🔥 BADGE DE INTENTOS */}
              {attempts > 0 && attempts < 3 && !isBlocked && (
                <div style={styles.attemptsBadge}>
                  <FiAlertTriangle size={16} />
                  <span>{3 - attempts} intento{3 - attempts !== 1 ? 's' : ''} restante{3 - attempts !== 1 ? 's' : ''}</span>
                </div>
              )}

              {/* 🔥 TIMER DE BLOQUEO */}
              {isBlocked && (
                <div style={styles.lockoutTimer}>
                  <FiClock size={20} style={{ color: '#dc2626' }} className="login-timer-pulse" />
                  <span style={styles.timerText}>{formatTime(remainingTime)}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || isBlocked}
                style={{
                  ...styles.submitButton,
                  ...((loading || isBlocked) && styles.submitButtonDisabled)
                }}
                className="login-submit-button"
              >
                {loading ? "🔄 Ingresando..." : isBlocked ? "🔒 Bloqueado" : "Ingresar"}
              </button>
            </form>

            <button
              style={styles.recuperarButton}
              className="login-recuperar-button"
              onClick={() => setMostrarRecuperar(true)}
              disabled={loading || isBlocked}
            >
              ¿Olvidaste tu contraseña?
            </button>

            {mensaje && (
              <div
                style={{
                  ...styles.mensaje,
                  ...(tipoMensaje === 'success' && styles.mensajeSuccess),
                  ...(tipoMensaje === 'error' && styles.mensajeError),
                  ...(tipoMensaje === 'warning' && styles.mensajeWarning),
                  ...(tipoMensaje === 'blocked' && styles.mensajeBlocked)
                }}
              >
                {tipoMensaje === 'blocked' && <FiShield size={20} />}
                {tipoMensaje === 'error' && <FiAlertTriangle size={20} />}
                <span>{mensaje}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;