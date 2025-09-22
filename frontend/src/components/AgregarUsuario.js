import React, { useState, useEffect } from "react";
import"react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./AgregarUsuario.css"; // Importar estilos
import logo from "./assets/logo.png";
import avatar from "./assets/avatar.png";
import Componente from "./componente.jsx";  // ✅ corregido



function AgregarUsuario() {
  const [openPedidos, setOpenPedidos] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/api/usuarios/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Usuario agregado con éxito");
        setFormData({
          nombre: "",
          apellido: "",
          dni: "",
          email: "",
          password: "",
          rol: "",
        });
      })
      .catch((err) => console.error("Error al agregar usuario:", err));
  };

  const handlePerfil = () => navigate("/perfil");
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

   return (

    <div className="dueno-dashboard">
      {/* Sidebar */}
      <Componente />


    <div className="contenedor-formulario">
      <h2>Detalles del Usuario</h2>
      <form onSubmit={handleSubmit} className="form-usuario">
        <div className="fila">
          <input
            type="text"
            name="nombre"
            placeholder="Introduzca el nombre del usuario"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="Introduzca el apellido del usuario"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="dni"
            placeholder="Introduzca el DNI del usuario"
            value={formData.dni}
            onChange={handleChange}
            required
          />
        </div>

        <div className="fila">
          <input
            type="email"
            name="email"
            placeholder="Introduzca el correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Introduzca la contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="fila">
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar rol</option>
            <option value="admin">Administrador</option>
            <option value="empleado">Empleado</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>

        <div className="botones">
          <button type="button" onClick={() => setFormData({})}>
            Cancelar
          </button>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
    </div>
  )

  }
export default AgregarUsuario;
