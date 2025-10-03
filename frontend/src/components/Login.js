// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "./assets/logo.png";
import "./Login.css";
import Recuperar from "./Recuperar";

function Login() {
  const navigate = useNavigate();

  // Estados
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mostrarRecuperar, setMostrarRecuperar] = useState(false);

  // Validación de campos
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

  // Manejo del login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

    try {
      setLoading(true);
      setMensaje("");

      const response = await fetch(`${API_URL}/api/usuarios/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!data.id) {
          setMensaje("❌ Error: no se recibió el ID del usuario");
          setTipoMensaje("error");
          return;
        }

        // Guardar datos directamente
        localStorage.setItem("usuarioId", data.id);
        localStorage.setItem("usuarioNombre", data.usuario);
        localStorage.setItem("rol", data.rol);

        setMensaje(`✅ Bienvenido ${data.usuario}`);
        setTipoMensaje("success");

        // Manejo de rutas según rol
        const rutas = {
          Dueño: "/dueno",
          Vendedor: "/vendedor",
          Costurero: "/costurero",
          Estampador: "/estampador",
        };

        setTimeout(() => {
          if (rutas[data.rol]) navigate(rutas[data.rol]);
          else {
            setMensaje("❌ Rol no autorizado");
            setTipoMensaje("error");
          }
        }, 1000);
      } else {
        setMensaje("❌ Usuario incorrecto");
        setTipoMensaje("error");
      }
    } catch (error) {
      setMensaje("⚠️ No se pudo conectar con el servidor");
      setTipoMensaje("warning");
      console.error("Error login:", error);
    } finally {
      setLoading(false);
    }
  };

  // Vista de recuperación de contraseña
  if (mostrarRecuperar) {
    return <Recuperar volverAlLogin={() => setMostrarRecuperar(false)} />;
  }

  return (
    <div className="login-container">
      <img src={logo} alt="Logo King Importados" className="logo" />
      <div className="login-box">
        <h1>Inicio de Sesión</h1>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="Usuario"
            required
          />

          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Contraseña"
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "🔄 Ingresando..." : "Ingresar"}
          </button>
        </form>

        <button
          className="recuperar"
          onClick={() => setMostrarRecuperar(true)}
        >
          Recuperar Contraseña
        </button>

        {mensaje && <p className={`mensaje ${tipoMensaje}`}>{mensaje}</p>}
      </div>
    </div>
  );
}

export default Login;
