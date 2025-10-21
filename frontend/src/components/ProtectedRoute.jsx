// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, hasRole } = useAuth();

  console.log("🛡️ ProtectedRoute - Verificando acceso...");
  console.log("👤 Usuario actual:", user);
  console.log("🔐 Está autenticado:", isAuthenticated());
  console.log("📋 Roles permitidos:", allowedRoles);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    console.log("❌ No autenticado, redirigiendo a login");
    return <Navigate to="/" replace />;
  }

  // Si se especificaron roles permitidos, verificar que el usuario tenga uno de esos roles
  if (allowedRoles && !hasRole(allowedRoles)) {
    console.log("❌ Sin permisos para este rol");
    console.log("🔄 Rol del usuario:", user?.rol);
    console.log("🔄 Roles permitidos:", allowedRoles);
    
    // Redirigir al dashboard correspondiente a su rol
    const rutas = {
      'Dueño': '/dueno',
      'Vendedor': '/vendedor',
      'Costurero': '/costurero',
      'Estampador': '/estampador'
    };
    
    const rutaDestino = rutas[user.rol] || '/';
    console.log("🚀 Redirigiendo a:", rutaDestino);
    
    return <Navigate to={rutaDestino} replace />;
  }

  console.log("✅ Acceso permitido, mostrando componente");
  // Si todo está bien, mostrar el componente
  return children;
};

export default ProtectedRoute;