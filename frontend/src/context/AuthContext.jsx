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
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // 🔥 CONFIGURAR AXIOS INTERCEPTORS
  const setupAxiosInterceptors = () => {
    const axios = require('axios');
    
    // Request interceptor - agregar token a todas las requests
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - manejar token expirado
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          const refresh = localStorage.getItem('refresh_token');
          if (refresh) {
            try {
              const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
              const response = await axios.post(`${API_URL}/api/usuarios/auth/refresh/`, {
                refresh: refresh
              });
              
              const { access } = response.data;
              localStorage.setItem('access_token', access);
              setAccessToken(access);
              
              // Reintentar request original
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return axios(originalRequest);
              
            } catch (refreshError) {
              console.error('❌ Error al refrescar token:', refreshError);
              logout();
              return Promise.reject(refreshError);
            }
          } else {
            logout();
          }
        }
        
        return Promise.reject(error);
      }
    );
  };

  // Verificar si hay sesión activa al cargar la app
  useEffect(() => {
    const cargarUsuarioDesdeStorage = async () => {
      try {
        const storedAccessToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');
        const usuarioData = localStorage.getItem('usuario_data');
        
        if (storedAccessToken && storedRefreshToken && usuarioData) {
          console.log("🔥 Cargando sesión JWT desde localStorage");
          
          const userData = JSON.parse(usuarioData);
          setUser(userData);
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          
          // 🔥 Verificar si el token es válido llamando al endpoint protegido
          try {
            const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
            const response = await fetch(`${API_URL}/api/usuarios/usuarios/${userData.id}/`, {
              headers: {
                'Authorization': `Bearer ${storedAccessToken}`,
                'Content-Type': 'application/json',
              }
            });
            
            if (response.ok) {
              const freshUserData = await response.json();
              console.log("✅ Token válido, datos actualizados:", freshUserData);
              
              // Actualizar datos del usuario
              const updatedUser = {
                ...userData,
                nombre: freshUserData.nombre || userData.nombre,
                apellido: freshUserData.apellido || userData.apellido,
                correo: freshUserData.correo || userData.correo,
                foto_perfil: freshUserData.foto_perfil || userData.foto_perfil
              };
              
              setUser(updatedUser);
              localStorage.setItem('usuario_data', JSON.stringify(updatedUser));
              
            } else if (response.status === 401) {
              console.warn("⚠️ Token expirado, intentando refrescar...");
              await refreshAccessToken();
            }
          } catch (apiError) {
            console.warn("⚠️ Error verificando token, intentando refrescar:", apiError);
            await refreshAccessToken();
          }
        }
        
        // 🔥 Configurar interceptors después de cargar tokens
        setupAxiosInterceptors();
        
      } catch (error) {
        console.error("❌ Error al cargar usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarioDesdeStorage();
  }, []);

  // 🔥 FUNCIÓN PARA REFRESCAR ACCESS TOKEN
  const refreshAccessToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refresh_token');
      if (!storedRefreshToken) {
        logout();
        return false;
      }
      
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/api/usuarios/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: storedRefreshToken })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        setAccessToken(data.access);
        console.log("✅ Token refrescado correctamente");
        return true;
      } else {
        console.error("❌ Error al refrescar token:", response.status);
        logout();
        return false;
      }
    } catch (error) {
      console.error("❌ Error en refreshAccessToken:", error);
      logout();
      return false;
    }
  };

  // 🔥 FUNCIÓN LOGIN MEJORADA CON JWT
  const login = async (credentials) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      
      // Opción 1: Usar endpoint JWT nuevo
      let response;
      let data;
      
      if (credentials.username && credentials.password) {
        // Login con credenciales
        response = await fetch(`${API_URL}/api/usuarios/auth/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password
          })
        });
        
        if (response.ok) {
          data = await response.json();
          
          // 🔥 Guardar tokens JWT
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          
          // 🔥 Guardar datos del usuario
          const userData = data.user;
          localStorage.setItem('usuario_data', JSON.stringify(userData));
          
          setUser(userData);
          setAccessToken(data.access);
          setRefreshToken(data.refresh);
          
          console.log("✅ Login JWT exitoso:", userData);
          return true;
        }
      } else if (credentials.access_token) {
        // Login con datos existentes (para compatibilidad)
        localStorage.setItem('access_token', credentials.access_token);
        localStorage.setItem('refresh_token', credentials.refresh_token);
        
        const userData = {
          id: credentials.id,
          username: credentials.usuario || credentials.username,
          nombre: credentials.nombre,
          apellido: credentials.apellido,
          correo: credentials.correo,
          rol: credentials.rol,
          foto_perfil: credentials.foto_perfil
        };
        
        localStorage.setItem('usuario_data', JSON.stringify(userData));
        
        setUser(userData);
        setAccessToken(credentials.access_token);
        setRefreshToken(credentials.refresh_token);
        
        console.log("✅ Login con tokens existentes:", userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("❌ Error en login JWT:", error);
      return false;
    }
  };

  // 🔥 FUNCIÓN LOGIN LEGACY (para compatibilidad con el sistema actual)
  const loginLegacy = async (userData) => {
    try {
      console.log("🔥 AuthContext - Login legacy:", userData);
      
      // Si vienen tokens JWT, usarlos
      if (userData.access_token && userData.refresh_token) {
        return await login(userData);
      }
      
      // Si no, hacer login legacy y obtener tokens
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      
      // Intentar obtener tokens haciendo login con usuario/contraseña si están disponibles
      // Por ahora, guardar datos sin tokens (modo compatibilidad)
      const userInfo = {
        id: userData.id,
        username: userData.usuario || userData.username || '',
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        correo: userData.correo || userData.email || '',
        rol: userData.rol,
        foto_perfil: userData.foto_perfil || null
      };
      
      localStorage.setItem('usuario_data', JSON.stringify(userInfo));
      setUser(userInfo);
      
      console.log("✅ Login legacy guardado:", userInfo);
      return true;
      
    } catch (error) {
      console.error("❌ Error en loginLegacy:", error);
      return false;
    }
  };

  // ✅ FUNCIÓN para actualizar el perfil del usuario
  const updateUser = (userData) => {
    console.log("🔄 AuthContext - Actualizando perfil del usuario:", userData);
    
    try {
      const updatedUser = {
        ...user,
        nombre: (userData.nombre || user?.nombre || '').trim(),
        apellido: (userData.apellido || user?.apellido || '').trim(),
        correo: userData.correo || user?.correo || '',
        foto_perfil: userData.foto_perfil !== undefined ? userData.foto_perfil : (user?.foto_perfil || null)
      };
      
      localStorage.setItem('usuario_data', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      console.log("✅ Perfil actualizado:", updatedUser);
      return true;
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      return false;
    }
  };

  const logout = () => {
    console.log("🚪 Cerrando sesión JWT...");
    
    // Limpiar tokens y datos
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('usuario_data');
    
    // Limpiar datos legacy por si acaso
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioApellido');
    localStorage.removeItem('usuarioCorreo');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuarioFotoPerfil');
    
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    
    console.log("✅ Sesión cerrada correctamente");
  };

  const isAuthenticated = () => {
    return user !== null && accessToken !== null;
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.rol);
    }
    return user.rol === roles;
  };

  // 🔥 NUEVA: Función para hacer requests autenticadas
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return fetch(url, {
      ...options,
      headers
    });
  };

  const value = {
    user,
    loading,
    accessToken,
    refreshToken,
    login,
    loginLegacy,  // Para compatibilidad
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
    refreshAccessToken,
    authenticatedFetch  // Nueva función útil
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;