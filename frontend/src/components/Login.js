import React, { useState } from "react";
import "./Login.css"; // Importamos estilos
import logo from "./assets/logo.png"; // <-- Importamos el logo

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ " + data.message);
        localStorage.setItem("usuario", data.usuario);
      } else {
        setMensaje("❌ " + data.error);
      }
    } catch (error) {
      setMensaje("⚠️ Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" /> {/* <-- Usamos import */}
        <h3>Inicio de Sesion</h3>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Ingresar</button>
        </form>
        <button className="recuperar">Recuperar Contraseña</button>
        <p>{mensaje}</p>
      </div>
    </div>
  );
}

export default Login;