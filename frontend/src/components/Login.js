import React, { useState } from "react";
import "./Login.css";
import logo from "./assets/logo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Recuperar from "./Recuperar";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // Estados
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // success | error | warning
  const [showPassword, setShowPassword] = useState(false);
  const [mostrarRecuperar, setMostrarRecuperar] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMensaje("⚠️ Completa todos los campos");
      setTipoMensaje("warning");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/usuarios/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Respuesta login:", data);

      if (response.ok) {
        if (!data.id) {
          setMensaje("❌ Error: id de usuario no recibido del backend");
          setTipoMensaje("error");
          return;
        }

        // Guardar datos del usuario en localStorage
        localStorage.setItem("usuarioId", data.id);
        localStorage.setItem("usuarioNombre", data.usuario);
        localStorage.setItem("rol", data.rol);

        setMensaje("✅ " + data.message);
        setTipoMensaje("success");

        // Redirigir según rol
        switch (data.rol) {
          case "Dueño":
            navigate("/dueno");
            break;
          case "Vendedor":
            navigate("/vendedor");
            break;
          case "Costurero":
            navigate("/costurero");
            break;
          case "Estampador":
            navigate("/estampador");
            break;
          default:
            setMensaje("❌ Rol no autorizado");
            setTipoMensaje("error");
            break;
        }
      } else {
        setMensaje("❌ " + (data.error || "Credenciales inválidas"));
        setTipoMensaje("error");
      }
    } catch (error) {
      setMensaje("⚠️ Error de conexión con el servidor");
      setTipoMensaje("warning");
      console.error("Error login:", error);
    }
  };

  // Vista de recuperar contraseña
  if (mostrarRecuperar) {
    return <Recuperar volverAlLogin={() => setMostrarRecuperar(false)} />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <h3>Inicio de Sesión</h3>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>

          <button type="submit">Ingresar</button>
        </form>

        <button
          className="recuperar"
          onClick={() => setMostrarRecuperar(true)}
        >
          Recuperar Contraseña
        </button>

        {/* Mensaje con clase dinámica */}
        {mensaje && <p className={`mensaje ${tipoMensaje}`}>{mensaje}</p>}
      </div>
    </div>
  );
}

export default Login;
