// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay sesión activa al cargar la app
  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    const usuarioNombre = localStorage.getItem('usuarioNombre');
    const rol = localStorage.getItem('rol');

    if (usuarioId && usuarioNombre && rol) {
      setUser({
        id: usuarioId,
        nombre: usuarioNombre,
        rol: rol
      });
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log("📥 AuthContext - Recibiendo datos de login:", userData);
    
    // Guardar en localStorage
    localStorage.setItem('usuarioId', userData.id);
    localStorage.setItem('usuarioNombre', userData.usuario);
    localStorage.setItem('rol', userData.rol);
    
    console.log("💾 Datos guardados en localStorage:", {
      usuarioId: userData.id,
      usuarioNombre: userData.usuario,
      rol: userData.rol
    });

    // Actualizar estado
    const newUser = {
      id: userData.id,
      nombre: userData.usuario,
      rol: userData.rol
    };
    
    setUser(newUser);
    console.log("✅ Estado de usuario actualizado:", newUser);
    
    // ✅ NO navegamos aquí, lo hace el componente Login
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.clear();
    
    // Limpiar estado
    setUser(null);
    
    // ✅ NO navegamos aquí, lo hace el componente que llama logout
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.rol);
    }
    return user.rol === roles;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};