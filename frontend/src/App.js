// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Componentes
import Login from "./components/Login";
import Recuperar from "./components/Recuperar";
import RestaurarContraseña from "./components/RestaurarContraseña";
import Dueno from "./components/Dueno";
import GestionUsuarios from "./components/AgregarUsuario";
import RealizarPedido from "./components/RealizarPedido";
import Insumos from "./components/Insumos";
import Prendas from "./components/Prendas";
import Perfil from "./components/Perfil";
import Vendedor from "./components/Vendedor";
import Costurero from "./components/Costurero"; 
import AprobacionPedidos from "./components/AprobacionPedidos";
import Estampador from "./components/Estampador";

// 🔥 NUEVOS COMPONENTES PARA GESTIÓN DE PEDIDOS
import AprobacionPedidosCosturero from "./components/Aprobacionpedidoscosturero";
import AprobacionPedidosEstampador from "./components/Aprobacionpedidosestampador";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ============================================ */}
        {/* RUTAS PÚBLICAS - LOGIN Y RECUPERACIÓN */}
        {/* ============================================ */}
        <Route path="/" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<Recuperar />} />
        <Route path="/reset-password" element={<RestaurarContraseña />} />

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
        {/* RUTAS PROTEGIDAS PARA DUEÑO, COSTURERO Y ESTAMPADOR */}
        {/* ============================================ */}
        
        {/* Insumos - Dueño, Costurero y Estampador */}
        <Route
          path="/insumos"
          element={
            <ProtectedRoute allowedRoles={['Dueño', 'Costurero', 'Estampador']}>
              <Insumos />
            </ProtectedRoute>
          }
        />

        {/* Prendas - Dueño, Costurero y Estampador */}
        <Route
          path="/prendas"
          element={
            <ProtectedRoute allowedRoles={['Dueño', 'Costurero', 'Estampador']}>
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

        {/* ============================================ */}
        {/* 🔥 RUTAS ESPECÍFICAS PARA GESTIÓN DE PEDIDOS */}
        {/* ============================================ */}

        {/* Aprobación de Pedidos - Solo DUEÑO (el original) */}
        <Route
          path="/aprobacion-pedidos"
          element={
            <ProtectedRoute allowedRoles={['Dueño']}>
              <AprobacionPedidos />
            </ProtectedRoute>
          }
        />

        {/* 🔥 NUEVA: Gestión de Pedidos - Solo COSTURERO */}
        <Route
          path="/pedidos-costurero"
          element={
            <ProtectedRoute allowedRoles={['Costurero']}>
              <AprobacionPedidosCosturero />
            </ProtectedRoute>
          }
        />

        {/* 🔥 NUEVA: Gestión de Pedidos - Solo ESTAMPADOR */}
        <Route
          path="/pedidos-estampador"
          element={
            <ProtectedRoute allowedRoles={['Estampador']}>
              <AprobacionPedidosEstampador />
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
              <Vendedor />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Costurero */}
        <Route
          path="/costurero"
          element={
            <ProtectedRoute allowedRoles={['Costurero']}>
              <Costurero />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Estampador */}
        <Route
          path="/estampador"
          element={
            <ProtectedRoute allowedRoles={['Estampador']}>
              <Estampador />
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