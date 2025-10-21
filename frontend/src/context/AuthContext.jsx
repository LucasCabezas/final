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
  };

  // 🆕 Nueva función para actualizar el perfil del usuario
  const updateUser = (userData) => {
    console.log("🔄 AuthContext - Actualizando perfil del usuario:", userData);
    
    // Actualizar localStorage si hay cambios en nombre
    if (userData.nombre || userData.usuario) {
      localStorage.setItem('usuarioNombre', userData.nombre || userData.usuario);
    }
    
    // Actualizar estado manteniendo el rol
    const updatedUser = {
      ...user,
      nombre: userData.nombre || userData.usuario || user.nombre,
      // Agregar campos adicionales si vienen en la respuesta
      apellido: userData.apellido,
      correo: userData.correo,
      foto_perfil: userData.foto_perfil
    };
    
    setUser(updatedUser);
    console.log("✅ Perfil de usuario actualizado:", updatedUser);
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.clear();
    
    // Limpiar estado
    setUser(null);
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
    updateUser, // 🆕 Agregar la nueva función
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};