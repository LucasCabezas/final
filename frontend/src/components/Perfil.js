import { useState, useEffect } from "react";
import axios from "axios";
import { FaUpload, FaCheck, FaTimes } from "react-icons/fa";
import Componente from "./componente";
import { useAuth } from "../context/AuthContext";

function Perfil() {
  const { user, updateUser } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        console.log("📥 Cargando datos del usuario:", user);

        // Intentar cargar datos completos desde la API
        try {
          const apiUrl = `http://localhost:8000/api/usuarios/usuarios/${user.id}/`;
          console.log(`🔍 Intentando cargar desde: ${apiUrl}`);
          const response = await axios.get(apiUrl); // ✅ AÑADE axios.get(apiUrl)
          
          console.log("📡 Respuesta del servidor:", response.status, response.statusText);
          
          if (response.status === 200) { 
            const userData = response.data; 
              console.log("✅ Datos del usuario cargados desde API:", userData);

              setFormData({
                nombre: userData.nombre || user.nombre || "",
              apellido: userData.apellido || user.apellido || "",
              correo: userData.correo || user.correo || "",
              contrasenaActual: "",
              nuevaContrasena: "",
              confirmarContrasena: "",
            });

            // Si el usuario tiene foto de perfil, cargarla
            if (userData.foto_perfil) {
              setProfilePhoto(`http://localhost:8000${userData.foto_perfil}`);
            } else if (user.foto_perfil) {
              setProfilePhoto(`http://localhost:8000${user.foto_perfil}`);
            }
          } else {
            const errorText = await response.text();
            console.error("❌ Error del servidor:", response.status, errorText.substring(0, 200));
            
            // Si falla la API, usar los datos del contexto
            console.log("⚠️ No se pudieron cargar datos desde la API, usando datos del contexto");
            setFormData({
              nombre: user.nombre || "",
              apellido: user.apellido || "",
              correo: user.correo || "",
              contrasenaActual: "",
              nuevaContrasena: "",
              confirmarContrasena: "",
            });
            
            if (user.foto_perfil) {
              setProfilePhoto(`http://localhost:8000${user.foto_perfil}`);
            }
          }
        } catch (apiError) {
          console.error("⚠️ Error al conectar con la API:", apiError);
          setFormData({
            nombre: user.nombre || "",
            apellido: user.apellido || "",
            correo: user.correo || "",
            contrasenaActual: "",
            nuevaContrasena: "",
            confirmarContrasena: "",
          });
          
          if (user.foto_perfil) {
            setProfilePhoto(`http://localhost:8000${user.foto_perfil}`);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("❌ Error al cargar datos del usuario:", error);
        setErrors({ general: "Error al cargar los datos del perfil" });
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleNavbarToggle = (collapsed) => {
    setIsNavbarCollapsed(collapsed);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño de archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: "La imagen debe ser menor a 5MB" });
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, photo: "El archivo debe ser una imagen" });
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Limpiar error de foto si existía
      if (errors.photo) {
        const newErrors = { ...errors };
        delete newErrors.photo;
        setErrors(newErrors);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validar requisitos de contraseña en tiempo real
    if (name === "nuevaContrasena") {
      validatePasswordRequirements(value);
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePasswordRequirements = (password) => {
    setPasswordRequirements({
      minLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "El correo no es válido";
    }

    // Validación de contraseña mejorada
    if (formData.nuevaContrasena || formData.contrasenaActual || formData.confirmarContrasena) {
      if (!formData.contrasenaActual) {
        newErrors.contrasenaActual = "La contraseña actual es requerida";
      }
      if (!formData.nuevaContrasena) {
        newErrors.nuevaContrasena = "La nueva contraseña es requerida";
      } else {
        // Validar todos los requisitos de contraseña
        if (formData.nuevaContrasena.length < 6) {
          newErrors.nuevaContrasena = "La contraseña debe tener al menos 6 caracteres";
        } else if (!/[A-Z]/.test(formData.nuevaContrasena)) {
          newErrors.nuevaContrasena = "La contraseña debe contener al menos una mayúscula";
        } else if (!/[a-z]/.test(formData.nuevaContrasena)) {
          newErrors.nuevaContrasena = "La contraseña debe contener al menos una minúscula";
        } else if (!/\d/.test(formData.nuevaContrasena)) {
          newErrors.nuevaContrasena = "La contraseña debe contener al menos un número";
        }
      }
      if (formData.nuevaContrasena !== formData.confirmarContrasena) {
        newErrors.confirmarContrasena = "Las contraseñas no coinciden";
      }
    }

    return newErrors;
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      console.log("💾 Guardando cambios del perfil...");

      // Preparar datos para enviar
      const updateData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
      };

      // Si hay cambio de contraseña
      if (formData.nuevaContrasena) {
        updateData.contrasenaActual = formData.contrasenaActual;
        updateData.nuevaContrasena = formData.nuevaContrasena;
      }

      // Actualizar información del usuario
      console.log(`📤 Enviando datos a: http://localhost:8000/api/usuarios/usuarios/${user.id}/`);
      console.log("📦 Datos a enviar:", updateData);
      
      const response = await axios.put( // ✅ USA AXIOS.PUT
        `http://localhost:8000/api/usuarios/usuarios/${user.id}/`,
        updateData // ✅ AXIOS MANEJA EL JSON
      );

      console.log("📡 Respuesta:", response.status, response.statusText);

      const updatedUserData = response.data;
      console.log("✅ Perfil actualizado:", updatedUserData);

      // Si hay una nueva foto, subirla
      if (photoFile) {
        console.log("📸 Subiendo foto de perfil...");
        const formDataPhoto = new FormData();
        formDataPhoto.append("foto_perfil", photoFile);

        const photoResponse = await axios.post( // ✅ USA AXIOS.POST
          `http://localhost:8000/api/usuarios/usuarios/${user.id}/foto/`,
          formDataPhoto
        );

        const photoData = photoResponse.data;
        console.log("✅ Foto subida correctamente:", photoData);
        
        // Actualizar la foto en el estado y en los datos actualizados
        if (photoData.foto_perfil) {
          updatedUserData.foto_perfil = photoData.foto_perfil;
          setProfilePhoto(`http://localhost:8000${photoData.foto_perfil}`);
        }
      }

      // ✅ CORRECCIÓN PRINCIPAL: Asegurar que todos los datos se actualicen en el contexto
      // Crear un objeto con todos los datos del usuario, incluyendo los que no cambiaron
      const completeUserData = {
        ...user, // Mantener todos los datos existentes del usuario
        id: user.id, // Asegurar que el ID se mantenga
        nombre: updatedUserData.nombre || formData.nombre,
        apellido: updatedUserData.apellido || formData.apellido,
        correo: updatedUserData.correo || formData.correo,
        foto_perfil: updatedUserData.foto_perfil || user.foto_perfil,
      };

      console.log("🔄 Actualizando contexto con:", completeUserData);
      
      // Actualizar el contexto de autenticación con los datos completos
      updateUser(completeUserData);
      
      // También actualizar localStorage para persistencia
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        const updatedStoredUser = {
          ...userObj,
          ...completeUserData
        };
        localStorage.setItem('user', JSON.stringify(updatedStoredUser));
        console.log("💾 Usuario actualizado en localStorage:", updatedStoredUser);
      }

      setSuccessMessage("✅ Cambios guardados exitosamente");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // Limpiar campos de contraseña
      setFormData((prev) => ({
        ...prev,
        contrasenaActual: "",
        nuevaContrasena: "",
        confirmarContrasena: "",
      }));

      setPasswordRequirements({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
      });

      setPhotoFile(null);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      setErrors({ general: error.message || "Error al guardar los cambios" });
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
      padding: "40px 20px",
      marginLeft: isNavbarCollapsed ? "70px" : "250px",
      transition: "margin-left 0.3s ease",
    },
    content: {
      maxWidth: "900px",
      margin: "0 auto",
      background: "rgba(20, 20, 20, 0.8)",
      borderRadius: "12px",
      padding: "40px",
      border: "1px solid rgba(255, 215, 15, 0.2)",
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: "30px",
      gap: "15px",
      paddingBottom: "20px",
      borderBottom: "1px solid rgba(255, 215, 15, 0.2)",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#FFD70F",
      margin: 0,
    },
    subtitle: {
      fontSize: "14px",
      color: "#999",
      marginTop: "5px",
    },
    profilePhotoSection: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      padding: "30px",
      background: "rgba(30, 30, 30, 0.5)",
      borderRadius: "10px",
      marginBottom: "30px",
      border: "1px solid rgba(255, 215, 15, 0.1)",
    },
    photoContainer: {
      position: "relative",
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      border: "3px solid rgba(255, 215, 15, 0.3)",
      overflow: "hidden",
      background: "rgba(255, 215, 15, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    profileImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    placeholderText: {
      fontSize: "48px",
      color: "#FFD70F",
      fontWeight: "700",
    },
    photoInfo: {
      flex: 1,
    },
    photoTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#fff",
      marginBottom: "10px",
    },
    uploadButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      background: "rgba(255, 215, 15, 0.1)",
      color: "#FFD70F",
      border: "1px solid rgba(255, 215, 15, 0.3)",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginBottom: "10px",
    },
    section: {
      marginBottom: "30px",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#FFD70F",
      marginBottom: "20px",
      paddingBottom: "10px",
      borderBottom: "1px solid rgba(255, 215, 15, 0.2)",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
    formGridFull: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#ccc",
    },
    input: {
      padding: "12px 15px",
      background: "rgba(30, 30, 30, 0.8)",
      border: "1px solid rgba(255, 215, 15, 0.2)",
      borderRadius: "8px",
      fontSize: "14px",
      color: "#fff",
      transition: "all 0.3s ease",
      outline: "none",
    },
    inputError: {
      borderColor: "#ff4444",
    },
    errorMessage: {
      fontSize: "12px",
      color: "#ff4444",
      marginTop: "5px",
    },
    successMessage: {
      padding: "15px",
      background: "rgba(76, 175, 80, 0.1)",
      border: "1px solid rgba(76, 175, 80, 0.3)",
      borderRadius: "8px",
      color: "#4CAF50",
      fontSize: "14px",
      marginBottom: "20px",
      textAlign: "center",
    },
    passwordRequirements: {
      marginTop: "12px",
      padding: "12px",
      background: "rgba(30, 30, 30, 0.5)",
      borderRadius: "8px",
      border: "1px solid rgba(255, 215, 15, 0.1)",
    },
    requirementItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "12px",
      marginTop: "6px",
    },
    requirementMet: {
      color: "#4CAF50",
    },
    requirementNotMet: {
      color: "#999",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "30px",
      paddingTop: "20px",
      borderTop: "1px solid rgba(255, 215, 15, 0.2)",
    },
    guardarButton: {
      padding: "12px 30px",
      background: "rgba(255, 215, 15, 1)",
      color: "#000",
      border: "none",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(255, 215, 15, 0.3)",
    },
  };

  if (loading) {
    return (
      <>
        <Componente onToggle={handleNavbarToggle} />
        <div style={styles.container}>
          <div style={{ ...styles.content, textAlign: "center", padding: "60px 40px" }}>
            <div style={{ fontSize: "18px", color: "#FFD70F", marginBottom: "15px" }}>
              Cargando perfil...
            </div>
            <div style={{ fontSize: "14px", color: "#999" }}>
              Por favor espera un momento
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Componente onToggle={handleNavbarToggle} />
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Mi Perfil</h1>
              <p style={styles.subtitle}>Administra tu información personal y preferencias</p>
            </div>
          </div>

          {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
          {errors.general && <div style={styles.errorMessage}>{errors.general}</div>}

          <div style={styles.profilePhotoSection}>
            <div style={styles.photoContainer}>
              {profilePhoto ? (
                <img src={profilePhoto} alt="Perfil" style={styles.profileImage} />
              ) : (
                <span style={styles.placeholderText}>
                  {formData.nombre ? formData.nombre.charAt(0).toUpperCase() : "?"}
                </span>
              )}
            </div>
            <div style={styles.photoInfo}>
              <div style={styles.photoTitle}>Foto de Perfil</div>
              <label style={styles.uploadButton}>
                <FaUpload /> Cambiar Foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
              </label>
              {errors.photo && <div style={styles.errorMessage}>{errors.photo}</div>}
              <div style={{ fontSize: "11px", color: "#666", marginTop: "5px" }}>
                Máximo 5MB (JPG, PNG, GIF)
              </div>
            </div>
          </div>

          <div onSubmit={handleGuardarCambios}>
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Información Personal</h2>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Juan"
                    style={{
                      ...styles.input,
                      ...(errors.nombre ? styles.inputError : {}),
                    }}
                  />
                  {errors.nombre && <span style={styles.errorMessage}>{errors.nombre}</span>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Pérez"
                    style={{
                      ...styles.input,
                      ...(errors.apellido ? styles.inputError : {}),
                    }}
                  />
                  {errors.apellido && <span style={styles.errorMessage}>{errors.apellido}</span>}
                </div>
              </div>

              <div style={{ ...styles.formGrid, marginTop: "20px" }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    placeholder="juan.perez@ejemplo.com"
                    style={{
                      ...styles.input,
                      ...(errors.correo ? styles.inputError : {}),
                    }}
                  />
                  {errors.correo && <span style={styles.errorMessage}>{errors.correo}</span>}
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Cambiar Contraseña</h2>
              <p style={{ color: "#999", fontSize: "13px", marginBottom: "15px" }}>
                Deja estos campos vacíos si no deseas cambiar tu contraseña
              </p>

              <div style={styles.formGridFull}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Contraseña Actual</label>
                  <input
                    type="password"
                    name="contrasenaActual"
                    value={formData.contrasenaActual}
                    onChange={handleInputChange}
                    placeholder=""
                    style={{
                      ...styles.input,
                      ...(errors.contrasenaActual ? styles.inputError : {}),
                    }}
                  />
                  {errors.contrasenaActual && (
                    <span style={styles.errorMessage}>{errors.contrasenaActual}</span>
                  )}
                </div>
              </div>

              <div style={{ ...styles.formGrid, marginTop: "20px" }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nueva Contraseña</label>
                  <input
                    type="password"
                    name="nuevaContrasena"
                    value={formData.nuevaContrasena}
                    onChange={handleInputChange}
                    placeholder=""
                    style={{
                      ...styles.input,
                      ...(errors.nuevaContrasena ? styles.inputError : {}),
                    }}
                  />
                  {errors.nuevaContrasena && (
                    <span style={styles.errorMessage}>{errors.nuevaContrasena}</span>
                  )}
                  
                  {formData.nuevaContrasena && (
                    <div style={styles.passwordRequirements}>
                      <div style={{ fontSize: "12px", fontWeight: "600", color: "#ccc", marginBottom: "8px" }}>
                        Requisitos de contraseña:
                      </div>
                      <div
                        style={{
                          ...styles.requirementItem,
                          ...(passwordRequirements.minLength ? styles.requirementMet : styles.requirementNotMet),
                        }}
                      >
                        {passwordRequirements.minLength ? <FaCheck /> : <FaTimes />}
                        <span>Mínimo 6 caracteres</span>
                      </div>
                      <div
                        style={{
                          ...styles.requirementItem,
                          ...(passwordRequirements.hasUpperCase ? styles.requirementMet : styles.requirementNotMet),
                        }}
                      >
                        {passwordRequirements.hasUpperCase ? <FaCheck /> : <FaTimes />}
                        <span>Al menos una letra mayúscula</span>
                      </div>
                      <div
                        style={{
                          ...styles.requirementItem,
                          ...(passwordRequirements.hasLowerCase ? styles.requirementMet : styles.requirementNotMet),
                        }}
                      >
                        {passwordRequirements.hasLowerCase ? <FaCheck /> : <FaTimes />}
                        <span>Al menos una letra minúscula</span>
                      </div>
                      <div
                        style={{
                          ...styles.requirementItem,
                          ...(passwordRequirements.hasNumber ? styles.requirementMet : styles.requirementNotMet),
                        }}
                      >
                        {passwordRequirements.hasNumber ? <FaCheck /> : <FaTimes />}
                        <span>Al menos un número</span>
                      </div>
                    </div>
                  )}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    name="confirmarContrasena"
                    value={formData.confirmarContrasena}
                    onChange={handleInputChange}
                    placeholder=""
                    style={{
                      ...styles.input,
                      ...(errors.confirmarContrasena ? styles.inputError : {}),
                    }}
                  />
                  {errors.confirmarContrasena && (
                    <span style={styles.errorMessage}>{errors.confirmarContrasena}</span>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <button
                type="button"
                disabled={loading}
                onClick={handleGuardarCambios}
                style={styles.guardarButton}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "rgba(255, 215, 15, 0.9)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "rgba(255, 215, 15, 1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Perfil;