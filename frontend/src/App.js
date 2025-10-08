import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dueno from "./components/Dueno";
import AgregarUsuario from "./components/AgregarUsuario";
import RealizarPedido from "./components/RealizarPedido";
import Insumos from "./components/Insumos";

function App() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Routes>
      {/* Página de login */}
      <Route path="/" element={<Login />} />

      {/* Dashboard del dueño (página principal con navbar) */}
      <Route
        path="/Dueno"
        element={
          <Dueno
            usuarioId={localStorage.getItem("usuarioId")}
            logout={handleLogout}
          />
        }
      />

      {/* Página de Insumos */}
      <Route path="/Insumos" element={<Insumos />} />

      {/* Página para agregar usuarios */}
      <Route path="/agregarUsuario" element={<AgregarUsuario />} />

      {/* Página para realizar pedido */}
      <Route path="/realizar-pedido" element={<RealizarPedido />} />

      {/* Puedes agregar más rutas aquí */}
      {/* <Route path="/prendas" element={<Prendas />} /> */}
      {/* <Route path="/aprobacion-pedidos" element={<AprobacionPedidos />} /> */}
      {/* <Route path="/perfil" element={<Perfil />} /> */}
    </Routes>
  );
}

export default App;