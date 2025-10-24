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
    const cargarUsuarioDesdeStorage = async () => {
      try {
        const usuarioId = localStorage.getItem('usuarioId');
        const usuarioNombre = localStorage.getItem('usuarioNombre');
        const rol = localStorage.getItem('rol');
        
        // ✅ Cargar apellido y foto de perfil
        const apellido = localStorage.getItem('usuarioApellido');
        const correo = localStorage.getItem('usuarioCorreo');
        const fotoPerfil = localStorage.getItem('usuarioFotoPerfil');

        if (usuarioId && usuarioNombre && rol) {
          console.log("📥 Cargando usuario desde localStorage:", {
            id: usuarioId,
            nombre: usuarioNombre,
            apellido: apellido,
            correo: correo,
            rol: rol,
            foto_perfil: fotoPerfil
          });

          // ✅ SIEMPRE intentar obtener datos completos desde la API al cargar
          try {
            const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
            const response = await fetch(`${API_URL}/api/usuarios/usuarios/${usuarioId}/`);
            
            if (response.ok) {
              const userData = await response.json();
              console.log("✅ Datos completos obtenidos desde API:", userData);
              
              // ✅ Actualizar localStorage con datos completos y limpios
              if (userData.nombre) {
                localStorage.setItem('usuarioNombre', userData.nombre.trim());
              }
              if (userData.apellido) {
                localStorage.setItem('usuarioApellido', userData.apellido.trim());
              }
              if (userData.correo) {
                localStorage.setItem('usuarioCorreo', userData.correo);
              }
              if (userData.foto_perfil) {
                localStorage.setItem('usuarioFotoPerfil', userData.foto_perfil);
              } else {
                localStorage.removeItem('usuarioFotoPerfil'); // Limpiar si no hay foto
              }
              
              // ✅ Establecer usuario con datos completos de la API
              setUser({
                id: usuarioId,
                nombre: (userData.nombre || usuarioNombre).trim(),
                apellido: (userData.apellido || apellido || '').trim(),
                correo: userData.correo || correo || '',
                rol: rol,
                foto_perfil: userData.foto_perfil || fotoPerfil || null
              });
            } else {
              console.warn("⚠️ No se pudieron obtener datos desde API, usando localStorage");
              // Si falla la API, usar datos del localStorage
              setUser({
                id: usuarioId,
                nombre: (usuarioNombre || '').trim(),
                apellido: (apellido || '').trim(),
                correo: correo || '',
                rol: rol,
                foto_perfil: fotoPerfil || null
              });
            }
          } catch (apiError) {
            console.warn("⚠️ Error al conectar con API, usando localStorage:", apiError);
            setUser({
              id: usuarioId,
              nombre: (usuarioNombre || '').trim(),
              apellido: (apellido || '').trim(),
              correo: correo || '',
              rol: rol,
              foto_perfil: fotoPerfil || null
            });
          }
        }
      } catch (error) {
        console.error("❌ Error al cargar usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarioDesdeStorage();
  }, []);

  // ✅ FUNCIÓN LOGIN MEJORADA: Obtiene datos completos del usuario después del login
  const login = async (userData) => {
    console.log("📥 AuthContext - Recibiendo datos de login:", userData);
    
    try {
      // ✅ PASO 1: Obtener datos completos del usuario desde la API
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      
      console.log(`🔍 Obteniendo datos completos del usuario con ID: ${userData.id}`);
      const response = await fetch(`${API_URL}/api/usuarios/usuarios/${userData.id}/`);
      
      let nombre = '';
      let apellido = '';
      let correo = '';
      let fotoPerfil = null;
      
      if (response.ok) {
        const fullUserData = await response.json();
        console.log("✅ Datos completos obtenidos desde API:", fullUserData);
        
        // Usar datos completos de la API
        nombre = (fullUserData.nombre || '').trim();
        apellido = (fullUserData.apellido || '').trim();
        correo = fullUserData.correo || fullUserData.email || '';
        fotoPerfil = fullUserData.foto_perfil || null;
      } else {
        console.warn("⚠️ No se pudieron obtener datos completos, procesando datos básicos del login");
        
        // Procesar datos básicos del login
        let nombreCompleto = userData.usuario || userData.nombre || '';
        apellido = userData.apellido || '';
        correo = userData.correo || userData.email || '';
        fotoPerfil = userData.foto_perfil || null;
        
        // Si el nombre contiene espacios y no hay apellido, separar
        if (!apellido && nombreCompleto && nombreCompleto.includes(' ')) {
          const partes = nombreCompleto.trim().split(/\s+/); // Dividir por cualquier cantidad de espacios
          nombre = partes[0];
          apellido = partes.slice(1).join(' ');
          console.log("⚠️ Apellido separado del nombre:", { nombre, apellido });
        } else {
          nombre = nombreCompleto.trim();
        }
      }
      
      // ✅ PASO 2: Guardar TODOS los datos en localStorage (limpios)
      localStorage.setItem('usuarioId', userData.id);
      localStorage.setItem('usuarioNombre', nombre);
      localStorage.setItem('usuarioApellido', apellido);
      localStorage.setItem('usuarioCorreo', correo);
      localStorage.setItem('rol', userData.rol);
      
      // Guardar foto de perfil si existe
      if (fotoPerfil) {
        localStorage.setItem('usuarioFotoPerfil', fotoPerfil);
      } else {
        localStorage.removeItem('usuarioFotoPerfil'); // Asegurar que no haya datos viejos
      }
      
      console.log("💾 Datos guardados en localStorage:", {
        usuarioId: userData.id,
        usuarioNombre: nombre,
        usuarioApellido: apellido,
        usuarioCorreo: correo,
        rol: userData.rol,
        foto_perfil: fotoPerfil
      });

      // ✅ PASO 3: Actualizar estado con TODOS los datos
      const newUser = {
        id: userData.id,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        rol: userData.rol,
        foto_perfil: fotoPerfil
      };
      
      setUser(newUser);
      console.log("✅ Estado de usuario actualizado:", newUser);
      
      return true;
    } catch (error) {
      console.error("❌ Error en login:", error);
      
      // Fallback: usar datos básicos si falla todo
      let nombreCompleto = userData.usuario || userData.nombre || '';
      let nombre = nombreCompleto.trim();
      let apellido = '';
      
      if (nombreCompleto.includes(' ')) {
        const partes = nombreCompleto.trim().split(/\s+/);
        nombre = partes[0];
        apellido = partes.slice(1).join(' ');
      }
      
      localStorage.setItem('usuarioId', userData.id);
      localStorage.setItem('usuarioNombre', nombre);
      localStorage.setItem('usuarioApellido', apellido);
      localStorage.setItem('rol', userData.rol);
      
      setUser({
        id: userData.id,
        nombre: nombre,
        apellido: apellido,
        correo: '',
        rol: userData.rol,
        foto_perfil: null
      });
      
      return false;
    }
  };

  // ✅ FUNCIÓN MEJORADA para actualizar el perfil del usuario
  const updateUser = (userData) => {
    console.log("🔄 AuthContext - Actualizando perfil del usuario:", userData);
    
    try {
      // Crear objeto con todos los datos actualizados
      const updatedUser = {
        id: user?.id || userData.id,
        nombre: (userData.nombre || user?.nombre || '').trim(),
        apellido: (userData.apellido || user?.apellido || '').trim(),
        correo: userData.correo || user?.correo || '',
        rol: user?.rol || userData.rol || '',
        foto_perfil: userData.foto_perfil !== undefined ? userData.foto_perfil : (user?.foto_perfil || null)
      };
      
      console.log("📋 Datos a actualizar:", updatedUser);
      
      // ✅ Actualizar localStorage con TODOS los datos (limpios)
      localStorage.setItem('usuarioId', updatedUser.id);
      localStorage.setItem('usuarioNombre', updatedUser.nombre);
      localStorage.setItem('usuarioApellido', updatedUser.apellido);
      localStorage.setItem('usuarioCorreo', updatedUser.correo);
      localStorage.setItem('rol', updatedUser.rol);
      
      // ✅ Manejar foto de perfil correctamente
      if (updatedUser.foto_perfil) {
        localStorage.setItem('usuarioFotoPerfil', updatedUser.foto_perfil);
        console.log("📸 Foto de perfil guardada en localStorage:", updatedUser.foto_perfil);
      } else {
        localStorage.removeItem('usuarioFotoPerfil');
        console.log("🗑️ Foto de perfil eliminada de localStorage");
      }
      
      console.log("💾 localStorage actualizado:", {
        usuarioId: updatedUser.id,
        usuarioNombre: updatedUser.nombre,
        usuarioApellido: updatedUser.apellido,
        usuarioCorreo: updatedUser.correo,
        rol: updatedUser.rol,
        foto_perfil: updatedUser.foto_perfil
      });
      
      // ✅ Actualizar estado
      setUser(updatedUser);
      console.log("✅ Perfil de usuario actualizado en estado:", updatedUser);
      
      return true;
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      return false;
    }
  };

  const logout = () => {
    console.log("🚪 Cerrando sesión...");
    // Limpiar localStorage completamente
    localStorage.clear();
    
    // Limpiar estado
    setUser(null);
    console.log("✅ Sesión cerrada correctamente");
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
    updateUser,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;