import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importar useNavigate
import logo from "./assets/logo.png";
import fondoImg from "./assets/fondo.png";

function RestaurarContraseña() { // 👈 Eliminar prop volverAlLogin
  const navigate = useNavigate(); // 👈 Hook para navegación
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  const [validaciones, setValidaciones] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  });

  // Extraer el token de la URL al cargar el componente
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      verificarToken(tokenFromUrl);
    } else {
      setMensaje("❌ Token no encontrado en la URL.");
      setTipoMensaje("error");
    }
  }, []);

  // Verificar si el token es válido
  const verificarToken = async (tokenToVerify) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/usuarios/password-reset/verify-token/?token=${tokenToVerify}`
      );
      
      if (!response.ok) {
        setMensaje("❌ El enlace es inválido o ha expirado.");
        setTipoMensaje("error");
      }
    } catch (error) {
      setMensaje("⚠️ Error al verificar el token.");
      setTipoMensaje("advertencia");
    }
  };

  // Validar contraseña en tiempo real
  const validarPassword = (password, confirmPass) => {
    setValidaciones({
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      passwordsMatch: password === confirmPass && password.length > 0 && confirmPass.length > 0,
    });
  };

  // Manejar cambio en el campo de nueva contraseña
  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    validarPassword(newPass, confirmPassword);
  };

  // Manejar cambio en el campo de confirmar contraseña
  const handleConfirmPasswordChange = (e) => {
    const confirmPass = e.target.value;
    setConfirmPassword(confirmPass);
    validarPassword(newPassword, confirmPass);
  };

  // Verificar si todas las validaciones están cumplidas
  const todasLasValidacionesCumplen = () => {
    return Object.values(validaciones).every((val) => val === true);
  };

  // 👇 Función para volver al login
  const volverAlLogin = () => {
    navigate('/'); // Redirige a la ruta del login
  };

  // Manejar el envío del formulario
  const handleRestaurar = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!newPassword || !confirmPassword) {
      setMensaje("⚠️ Todos los campos son obligatorios.");
      setTipoMensaje("error");
      return;
    }

    // Validar requisitos de contraseña
    if (!todasLasValidacionesCumplen()) {
      setMensaje("⚠️ La contraseña no cumple con todos los requisitos.");
      setTipoMensaje("error");
      return;
    }

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setMensaje("⚠️ Las contraseñas no coinciden.");
      setTipoMensaje("error");
      return;
    }

    try {
      setLoading(true);
      setMensaje("");
      setTipoMensaje("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/usuarios/password-reset/confirm/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ " + data.message);
        setTipoMensaje("exito");
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          volverAlLogin();
        }, 2000);
      } else {
        setMensaje("❌ " + (data.error || "Error al cambiar la contraseña."));
        setTipoMensaje("error");
      }
    } catch (error) {
      setMensaje("⚠️ Error de conexión con el servidor");
      setTipoMensaje("advertencia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      
      <div style={styles.contentWrapper}>
        <img src={logo} alt="Logo" style={styles.logo} />
        
        <div style={styles.box}>
          <h2 style={styles.title}>Restablecer Contraseña</h2>
          <p style={styles.subtitle}>
            Ingresa tu nueva contraseña a continuación. Asegúrate de que cumpla con todos los requisitos de seguridad.
          </p>

          <form onSubmit={handleRestaurar} style={styles.form}>
            {/* Campo de nueva contraseña */}
            <div style={styles.inputContainer}>
              <input
                type={mostrarPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={handlePasswordChange}
                required
                disabled={loading}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={styles.toggleButton}
                disabled={loading}
              >
                {mostrarPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {/* Campo de confirmar contraseña */}
            <div style={styles.inputContainer}>
              <input
                type={mostrarConfirmPassword ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                disabled={loading}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
                style={styles.toggleButton}
                disabled={loading}
              >
                {mostrarConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {/* Requisitos de contraseña */}
            <div style={styles.requisitos}>
              <p style={styles.requisitosTitle}>Requisitos de la contraseña:</p>
              <ul style={styles.requisitosList}>
                <li style={validaciones.minLength ? styles.cumple : styles.noCumple}>
                  {validaciones.minLength ? "✅" : "❌"} Mínimo 6 caracteres
                </li>
                <li style={validaciones.hasUppercase ? styles.cumple : styles.noCumple}>
                  {validaciones.hasUppercase ? "✅" : "❌"} Al menos una mayúscula
                </li>
                <li style={validaciones.hasLowercase ? styles.cumple : styles.noCumple}>
                  {validaciones.hasLowercase ? "✅" : "❌"} Al menos una minúscula
                </li>
                <li style={validaciones.hasNumber ? styles.cumple : styles.noCumple}>
                  {validaciones.hasNumber ? "✅" : "❌"} Al menos un número
                </li>
                <li style={validaciones.hasSpecialChar ? styles.cumple : styles.noCumple}>
                  {validaciones.hasSpecialChar ? "✅" : "❌"} Al menos un carácter especial (!@#$%^&*...)
                </li>
                <li style={validaciones.passwordsMatch ? styles.cumple : styles.noCumple}>
                  {validaciones.passwordsMatch ? "✅" : "❌"} Las contraseñas coinciden
                </li>
              </ul>
            </div>

            <button 
              type="submit" 
              disabled={loading || !todasLasValidacionesCumplen()} 
              style={{
                ...styles.submitButton,
                ...(loading || !todasLasValidacionesCumplen() ? styles.submitButtonDisabled : {})
              }}
            >
              {loading ? "Actualizando..." : "Cambiar Contraseña"}
            </button>
          </form>

          <button
            style={styles.volverButton}
            onClick={volverAlLogin}
            disabled={loading}
          >
            Volver a Inicio de Sesión
          </button>

          {mensaje && (
            <p style={
              tipoMensaje === "exito" 
                ? styles.mensajeExito 
                : tipoMensaje === "error" 
                ? styles.mensajeError 
                : styles.mensajeAdvertencia
            }>
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Estilos en línea - Mismo estilo que Login
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url(${fondoImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '20px',
    position: 'relative',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
    maxWidth: '550px'
  },
  logo: {
    width: '180px',
    height: 'auto',
    marginBottom: '32px',
    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
  },
  box: {
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
    marginBottom: '10px',
    letterSpacing: '0.5px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#d1d5db',
    marginBottom: '25px',
    lineHeight: '1.5',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '14px 45px 14px 16px',
    fontSize: '15px',
    backgroundColor: '#fff',
    color: '#000',
    border: '2px solid #4b5563',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  toggleButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requisitos: {
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'left',
    marginTop: '10px',
  },
  requisitosTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  requisitosList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  cumple: {
    fontSize: '13px',
    color: '#10b981',
    marginBottom: '5px',
    fontWeight: '500',
  },
  noCumple: {
    fontSize: '13px',
    color: '#ef4444',
    marginBottom: '5px',
    fontWeight: '500',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#000',
    backgroundColor: 'rgba(255, 215, 15, 1)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '10px',
    fontFamily: 'inherit'
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  volverButton: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#93c5fd',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'all 0.2s',
    textDecoration: 'underline',
    fontFamily: 'inherit'
  },
  mensajeExito: {
    marginTop: '20px',
    padding: '12px 16px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center'
  },
  mensajeError: {
    marginTop: '20px',
    padding: '12px 16px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center'
  },
  mensajeAdvertencia: {
    marginTop: '20px',
    padding: '12px 16px',
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center'
  },
};

export default RestaurarContraseña;