// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
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
    maxWidth: '450px'
  },
  logo: {
    width: '180px',
    height: 'auto',
    marginBottom: '32px',
    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
  },
  loginBox: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '32px',
    letterSpacing: '0.5px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: '#fff',
    color: '#000',
    border: '2px solid #4b5563',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  inputContainer: {
    position: 'relative',
    width: '100%'
  },
  eyeIcon: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s'
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'rgba(255, 215, 15, 1)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '8px',
    fontFamily: 'inherit'
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  recuperarButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    color: '#93c5fd',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '12px',
    textDecoration: 'underline',
    fontFamily: 'inherit'
  },
  mensaje: {
    marginTop: '20px',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    animation: 'slideIn 0.3s ease-out'
  },
  mensajeSuccess: {
    backgroundColor: '#10b981',
    color: '#ffffff'
  },
  mensajeError: {
    backgroundColor: '#ef4444',
    color: '#ffffff'
  },
  mensajeWarning: {
    backgroundColor: '#f59e0b',
    color: '#ffffff'
  }
};

const styleSheet = `
  .login-input:focus {
    border-color: rgba(255, 215, 15, 1);
    box-shadow: 0 0 0 3px rgba(255, 215, 15, 0.1);
  }

  .login-submit-button:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 215, 15, 0.3);
  }

  .login-submit-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-recuperar-button:hover {
    color: #60a5fa;
    background-color: rgba(147, 197, 253, 0.1);
  }

  .login-eye-icon:hover {
    color: rgba(255, 215, 15, 1);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    .login-box-responsive {
      padding: 28px 24px;
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

  const validarCampos = () => {
    const errores = {};
    if (!username.trim()) errores.username = "⚠️ Usuario vacío";
    if (!password.trim()) errores.password = "⚠️ Contraseña vacía";
    else if (password.length < 4)
      errores.password = "⚠️ La contraseña debe tener al menos 4 caracteres";

    if (Object.keys(errores).length > 0) {
      setMensaje(Object.values(errores).join(" | "));
      setTipoMensaje("warning");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

    try {
      setLoading(true);
      setMensaje("");

      console.log("🔐 Iniciando login para usuario:", username);

      const response = await fetch(`${API_URL}/api/usuarios/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("📥 Respuesta del servidor (login):", data);

      if (response.ok) {
        if (!data.id) {
          setMensaje("❌ Error: no se recibió el ID del usuario");
          setTipoMensaje("error");
          setLoading(false);
          return;
        }

        // ✅ CORRECCIÓN: Obtener datos completos del usuario desde la API
        console.log("🔍 Obteniendo datos completos del usuario desde la API...");
        
        try {
          const userDetailsResponse = await fetch(`${API_URL}/api/usuarios/usuarios/${data.id}/`);
          
          if (userDetailsResponse.ok) {
            const userDetails = await userDetailsResponse.json();
            console.log("✅ Datos completos del usuario:", userDetails);
            
            // ✅ Combinar datos del login con datos completos del usuario
            const completeUserData = {
              id: data.id,
              usuario: data.usuario,
              rol: data.rol,
              nombre: userDetails.nombre || data.usuario || '',
              apellido: userDetails.apellido || '',
              correo: userDetails.correo || '',
              foto_perfil: userDetails.foto_perfil || null
            };
            
            console.log("📋 Datos completos combinados:", completeUserData);
            
            setMensaje(`✅ Bienvenido ${completeUserData.nombre} ${completeUserData.apellido}`);
            setTipoMensaje("success");

            // ✅ Llamar a login del contexto con datos completos
            login(completeUserData);

            // Navegar según el rol
            const rutas = {
              'Dueño': '/dueno',
              'Vendedor': '/vendedor',
              'Costurero': '/costurero',
              'Estampador': '/estampador'
            };

            const rutaDestino = rutas[data.rol];

            setTimeout(() => {
              navigate(rutaDestino || '/', { replace: true });
              setLoading(false);
            }, 1000);
            
          } else {
            // Si no se pueden obtener datos completos, usar solo los del login
            console.warn("⚠️ No se pudieron obtener datos completos, usando datos básicos del login");
            
            setMensaje(`✅ Bienvenido ${data.usuario}`);
            setTipoMensaje("success");

            // Llamar a login del contexto con datos básicos
            login(data);

            const rutas = {
              'Dueño': '/dueno',
              'Vendedor': '/vendedor',
              'Costurero': '/costurero',
              'Estampador': '/estampador'
            };

            const rutaDestino = rutas[data.rol];

            setTimeout(() => {
              navigate(rutaDestino || '/', { replace: true });
              setLoading(false);
            }, 1000);
          }
        } catch (detailsError) {
          console.error("❌ Error al obtener datos completos:", detailsError);
          
          // Continuar con login básico
          setMensaje(`✅ Bienvenido ${data.usuario}`);
          setTipoMensaje("success");

          login(data);

          const rutas = {
            'Dueño': '/dueno',
            'Vendedor': '/vendedor',
            'Costurero': '/costurero',
            'Estampador': '/estampador'
          };

          const rutaDestino = rutas[data.rol];

          setTimeout(() => {
            navigate(rutaDestino || '/', { replace: true });
            setLoading(false);
          }, 1000);
        }

      } else {
        setMensaje("❌ Usuario o contraseña incorrectos");
        setTipoMensaje("error");
        setLoading(false);
      }
    } catch (error) {
      setMensaje("⚠️ No se pudo conectar con el servidor");
      setTipoMensaje("warning");
      console.error("Error login:", error);
      setLoading(false);
    }
  };

  if (mostrarRecuperar) {
    return <Recuperar volverAlLogin={() => setMostrarRecuperar(false)} />;
  }

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
          <img src={logo} alt="Logo King Importados" style={styles.logo} />
          
          <div style={styles.loginBox} className="login-box-responsive">
            <h1 style={styles.title}>Inicio de Sesión</h1>

            <form onSubmit={handleLogin} style={styles.form}>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-label="Usuario"
                style={styles.input}
                className="login-input"
                required
                disabled={loading}
              />

              <div style={styles.inputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Contraseña"
                  style={{...styles.input, paddingRight: '48px'}}
                  className="login-input"
                  required
                  disabled={loading}
                />
                <span
                  style={styles.eyeIcon}
                  className="login-eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading && styles.submitButtonDisabled)
                }}
                className="login-submit-button"
              >
                {loading ? "🔄 Ingresando..." : "Ingresar"}
              </button>
            </form>

            <button
              style={styles.recuperarButton}
              className="login-recuperar-button"
              onClick={() => setMostrarRecuperar(true)}
              disabled={loading}
            >
              Recuperar Contraseña
            </button>

            {mensaje && (
              <div
                style={{
                  ...styles.mensaje,
                  ...(tipoMensaje === 'success' && styles.mensajeSuccess),
                  ...(tipoMensaje === 'error' && styles.mensajeError),
                  ...(tipoMensaje === 'warning' && styles.mensajeWarning)
                }}
              >
                {mensaje}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;