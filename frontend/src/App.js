import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dueno from "./components/Dueno";
import AgregarUsuario from "./components/AgregarUsuario";
import RealizarPedido from "./components/RealizarPedido";
import Insumos from "./components/Insumos";
import Prendas from "./components/Prendas"; // ya está importado
import DetallePedidos from "./components/DetallesPedidos";

function App() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/Dueno"
        element={
          <Dueno
            usuarioId={localStorage.getItem("usuarioId")}
            logout={handleLogout}
          />
        }
      />
      <Route path="/Insumos" element={<Insumos />} />
      <Route path="/agregarUsuario" element={<AgregarUsuario />} />
      <Route path="/realizar-pedido" element={<RealizarPedido />} />
      <Route path="/detalle-pedidos" element={<DetallePedidos />} />

      {/* Página de prendas */}
      <Route path="/prendas" element={<Prendas />} />
    </Routes>
  );
}

export default App;
