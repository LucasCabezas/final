import React, { useState } from "react";
import "./Recuperar.css";
import logo from "./assets/logo.png";

function Recuperar({ volverAlLogin }) {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // Estado para controlar el color

  const handleRecuperar = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/usuarios/validar-correo/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Revisa tu correo, se envió un enlace de recuperación.");
        setTipoMensaje("exito");
      } else {
        setMensaje("❌ " + data.error);
        setTipoMensaje("error");
      }
    } catch (error) {
      setMensaje("⚠️ Error de conexión con el servidor");
      setTipoMensaje("advertencia");
    }
  };

  return (
    <div className="recuperar-container">
      <div className="recuperar-box">
        <img src={logo} alt="Logo" className="logo" />
        <h3>Recuperar Contraseña</h3>
        <form onSubmit={handleRecuperar}>
          <input
            type="email"
            placeholder="Ingrese su correo registrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Enviar enlace</button>
        </form>
        <button className="volver" onClick={volverAlLogin}>
          Volver al Login
        </button>
        <p className={`mensaje ${tipoMensaje}`}>{mensaje}</p>
      </div>
    </div>
  );
}

export default Recuperar;