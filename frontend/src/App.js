import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dueno from "./components/Dueno"; // ✅ Importa tu Dueno.js real
import Componente from "./components/componente";import AgregarUsuario from "./components/AgregarUsuario"; //

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dueno"
        element={
          <Dueno
            usuarioId={localStorage.getItem("usuarioId")} // ✅ pasa el ID guardado en el login
            logout={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          />
        }
      />
       <Route path="/agregarUsuario" element={<AgregarUsuario />} />
    </Routes>
  );
}

export default App;