import React, { useState } from "react";
import "./Prendas.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Componente from "./componente.jsx"; // Sidebar
import avatar from "./assets/avatar.png";

const prendasIniciales = [
  {
    id: 1,
    nombre: "Remera Clasica",
    marca: "Louis Vuitton",
    codigo: "LV001",
    color: "Negro",
    precio: 25.0,
    imagen: "https://via.placeholder.com/200x200?text=Remera+LV",
  },
  {
    id: 2,
    nombre: "Buzo Oversize",
    marca: "Balenciaga",
    codigo: "BAL002",
    color: "Blanco",
    precio: 45.0,
    imagen: "https://via.placeholder.com/200x200?text=Buzo+Balenciaga",
  },
  {
    id: 3,
    nombre: "Remera Oversize",
    marca: "GUCCI",
    codigo: "GUC003",
    color: "Negro",
    precio: 30.0,
    imagen: "https://via.placeholder.com/200x200?text=Remera+GUCCI",
  },
];

export default function Prendas() {
  const [prendas, setPrendas] = useState(prendasIniciales);
  const navigate = useNavigate();

  const eliminarPrenda = (id) => {
    setPrendas(prendas.filter((p) => p.id !== id));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handlePerfil = () => {
    navigate("/perfil");
  };

  return (
    <div className="prendas-container">
      <Componente />

      {/* Header (Logout + Avatar) */}
      <div className="header-right">
        <button className="btn-logout" onClick={handleLogout}>
          <FiLogOut /> <span>Cerrar sesión</span>
        </button>
        <button className="btn-avatar" onClick={handlePerfil}>
          <img src={avatar} alt="avatar" className="avatar" />
        </button>
      </div>

      {/* Contenido */}
      <div className="contenido">
        <h2 className="titulo">Prendas</h2>

        <div className="prendas-grid">
          {prendas.map((p) => (
            <div className="prenda-card" key={p.id}>
              <img src={p.imagen} alt={p.nombre} />
              <div className="prenda-info">
                <h3>{p.nombre}</h3>
                <p>{p.marca}</p>
                <p>{p.codigo}</p>
                <p>{p.color}</p>
                <span className="precio">${p.precio.toFixed(2)}</span>
                <div className="acciones">
                  <button className="btn-edit">
                    <FaEdit />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => eliminarPrenda(p.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="acciones-footer">
          <button className="btn-volver" onClick={() => navigate("/dueno")}>
            Volver
          </button>
          <button className="btn-agregar">Agregar Prenda</button>
        </div>
      </div>
    </div>
  );
}
