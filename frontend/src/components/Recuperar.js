import React, { useState } from "react";
import logo from "./assets/logo.png";
import fondoImg from "./assets/fondo.png";

function Recuperar({ volverAlLogin }) {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecuperar = async (e) => {
    e.preventDefault();

    // Validación de email vacío
    if (!email) {
      setMensaje("⚠️ El campo de correo no puede estar vacío.");
      setTipoMensaje("error");
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensaje("⚠️ Ingrese un correo válido.");
      setTipoMensaje("error");
      return;
    }

    try {
      setLoading(true);
      setMensaje("");
      setTipoMensaje("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/usuarios/password-reset/request/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      // La respuesta siempre será genérica por seguridad
      if (response.ok) {
        setMensaje("✅ " + data.message);
        setTipoMensaje("exito");
      } else {
        setMensaje("❌ " + (data.error || "Error al enviar el correo."));
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
        <img src={logo} alt="Logo King Importados" style={styles.logo} />
        
        <div style={styles.box}>
          <h2 style={styles.title}>Recuperación de Contraseña</h2>
          <p style={styles.subtitle}>
            Ingresa tu dirección de correo electrónico a continuación y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          
          <form onSubmit={handleRecuperar} style={styles.form}>
            <input
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={styles.input}
            />
            <button 
              type="submit" 
              disabled={loading} 
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {})
              }}
            >
              {loading ? "Enviando..." : "Enviar enlace"}
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
    maxWidth: '450px'
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
  input: {
    width: '100%',
    padding: '14px 16px',
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
    marginTop: '8px',
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

export default Recuperar;