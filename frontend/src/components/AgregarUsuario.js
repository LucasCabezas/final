import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AgregarUsuario.css";
import Componente from "./componente.jsx";

function AgregarUsuario() {
  const navigate = useNavigate();

  const initialFormData = {
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    password: "",
    rol: "", // aquí guardamos el ID del rol
  };

  const [formData, setFormData] = useState(initialFormData);
  const [roles, setRoles] = useState([]); // Para cargar roles desde backend

  // Cargar roles disponibles
  useEffect(() => {
    fetch("http://localhost:8000/api/usuarios/roles/")
      .then(res => res.json())
      .then(data => setRoles(data))
      .catch(err => console.error("Error cargando roles:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Payload con nombres correctos para Django
    const payloadUsuario = {
      Usuario_nombre: formData.nombre,
      Usuario_apellido: formData.apellido,
      Usuario_dni: formData.dni,
      Usuario_email: formData.email,
      Usuario_contrasena: formData.password,
    };

    try {
      // 1️⃣ Crear usuario
      const resUsuario = await fetch("http://localhost:8000/api/usuarios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadUsuario),
      });

      if (!resUsuario.ok) {
        const errorData = await resUsuario.json();
        throw new Error(JSON.stringify(errorData));
      }

      const nuevoUsuario = await resUsuario.json();

      // 2️⃣ Asignar rol si se seleccionó
      if (formData.rol) {
        const rolPayload = {
          usuario: nuevoUsuario.Usuario_ID,
          rol: parseInt(formData.rol),
        };

        const resRol = await fetch("http://localhost:8000/api/usuarios/rolesxusuarios/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rolPayload),
        });

        if (!resRol.ok) {
          const errorRol = await resRol.json();
          throw new Error(JSON.stringify(errorRol));
        }
      }

      alert("✅ Usuario y rol agregados con éxito");
      setFormData(initialFormData);
    } catch (err) {
      console.error("Error al agregar usuario:", err);
      alert("❌ Error al agregar usuario: " + err.message);
    }
  };

  return (
    <div className="dueno-dashboard">
      <Componente />

      <div className="contenedor-formulario">
        <h2>Detalles del Usuario</h2>
        <form onSubmit={handleSubmit} className="form-usuario">
          <div className="fila">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="dni"
              placeholder="DNI"
              value={formData.dni}
              onChange={handleChange}
              required
            />
          </div>

          <div className="fila">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
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
            >
              <option value="">Seleccionar rol</option>
              {roles.map(r => (
                <option key={r.Rol_ID} value={r.Rol_ID}>{r.Rol_nombre}</option>
              ))}
            </select>
          </div>

          <div className="botones">
            <button type="button" onClick={() => setFormData(initialFormData)}>
              Cancelar
            </button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarUsuario;
