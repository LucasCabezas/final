import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dueno from "./components/Dueno";
import AgregarUsuario from "./components/AgregarUsuario";
import RealizarPedido from "./components/RealizarPedido";

function App() {
  return (
    <Routes>
      {/* Página de login */}
      <Route path="/" element={<Login />} />

      {/* Dashboard del dueño */}
      <Route
        path="/dueno"
        element={
          <Dueno
            usuarioId={localStorage.getItem("usuarioId")}
            logout={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          />
        }
      />

      {/* Página para agregar usuarios */}
      <Route path="/agregarUsuario" element={<AgregarUsuario />} />


      <Route path="/realizar-pedido" element={<RealizarPedido />} />
    </Routes>
  );
}

export default App;
