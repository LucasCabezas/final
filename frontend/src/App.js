// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Componentes
import Login from "./components/Login";
import Dueno from "./components/Dueno";
import GestionUsuarios from "./components/AgregarUsuario";
import RealizarPedido from "./components/RealizarPedido";
import Insumos from "./components/Insumos";
import Prendas from "./components/Prendas";
import Perfil from "./components/Perfil";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ============================================ */}
        {/* RUTA PÚBLICA - LOGIN */}
        {/* ============================================ */}
        <Route path="/" element={<Login />} />

        {/* ============================================ */}
        {/* RUTAS PROTEGIDAS SOLO PARA DUEÑO */}
        {/* ============================================ */}
        <Route
          path="/dueno"
          element={
            <ProtectedRoute allowedRoles={['Dueño']}>
              <Dueno />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agregarUsuario"
          element={
            <ProtectedRoute allowedRoles={['Dueño']}>
              <GestionUsuarios />
            </ProtectedRoute>
          }
        />

        {/* ============================================ */}
        {/* RUTAS PROTEGIDAS PARA DUEÑO Y COSTURERO */}
        {/* ============================================ */}
        
        {/* Insumos - Dueño y Costurero */}
        <Route
          path="/insumos"
          element={
            <ProtectedRoute allowedRoles={['Dueño', 'Costurero']}>
              <Insumos />
            </ProtectedRoute>
          }
        />

        {/* Prendas - Dueño y Costurero */}
        <Route
          path="/prendas"
          element={
            <ProtectedRoute allowedRoles={['Dueño', 'Costurero']}>
              <Prendas />
            </ProtectedRoute>
          }
        />

        {/* ============================================ */}
        {/* RUTAS PROTEGIDAS PARA DUEÑO Y VENDEDOR */}
        {/* ============================================ */}
        
        {/* Realizar Pedido - Dueño y Vendedor */}
        <Route
          path="/realizar-pedido"
          element={
            <ProtectedRoute allowedRoles={['Dueño', 'Vendedor']}>
              <RealizarPedido />
            </ProtectedRoute>
          }
        />

        {/* Aprobación de Pedidos - Dueño */}
        <Route
          path="/aprobacion-pedidos"
          element={
            <ProtectedRoute allowedRoles={['Dueño']}>
              <RealizarPedido />
            </ProtectedRoute>
          }
        />

        {/* ============================================ */}
        {/* RUTAS PARA OTROS ROLES (DASHBOARDS) */}
        {/* ============================================ */}
        
        {/* Dashboard Vendedor */}
        <Route
          path="/vendedor"
          element={
            <ProtectedRoute allowedRoles={['Vendedor']}>
              <RealizarPedido />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Costurero */}
        <Route
          path="/costurero"
          element={
            <ProtectedRoute allowedRoles={['Costurero']}>
              <Insumos />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Estampador */}
        <Route
          path="/estampador"
          element={
            <ProtectedRoute allowedRoles={['Estampador']}>
              <Prendas />
            </ProtectedRoute>
          }
        />

        {/* ============================================ */}
        {/* PERFIL - TODOS LOS USUARIOS AUTENTICADOS */}
        {/* ============================================ */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        {/* ============================================ */}
        {/* RUTA PARA URLs NO ENCONTRADAS */}
        {/* ============================================ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;