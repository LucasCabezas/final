import { useState, useEffect } from "react";
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
          const response = await fetch(apiUrl);
          
          console.log("📡 Respuesta del servidor:", response.status, response.statusText);
          
          if (response.ok) {
            const userData = await response.json();
            console.log("✅ Datos del usuario cargados desde API:", userData);
            
            setFormData({
              nombre: userData.nombre || user.nombre || "",
              apellido: userData.apellido || "",
              correo: userData.correo || "",
              contrasenaActual: "",
              nuevaContrasena: "",
              confirmarContrasena: "",
            });

            // Si el usuario tiene foto de perfil, cargarla
            if (userData.foto_perfil) {
              setProfilePhoto(`http://localhost:8000${userData.foto_perfil}`);
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
      
      const response = await fetch(`http://localhost:8000/api/usuarios/usuarios/${user.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      console.log("📡 Respuesta:", response.status, response.statusText);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        console.log("📋 Content-Type:", contentType);
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || "Error al actualizar el perfil");
        } else {
          const errorText = await response.text();
          console.error("❌ Respuesta del servidor (HTML):", errorText.substring(0, 300));
          throw new Error(`El servidor devolvió un error (${response.status}). Verifica que el endpoint existe.`);
        }
      }

      const updatedUserData = await response.json();
      console.log("✅ Perfil actualizado:", updatedUserData);

      // Si hay una nueva foto, subirla
      if (photoFile) {
        console.log("📸 Subiendo foto de perfil...");
        const formDataPhoto = new FormData();
        formDataPhoto.append("foto_perfil", photoFile);

        const photoResponse = await fetch(`http://localhost:8000/api/usuarios/usuarios/${user.id}/foto/`, {
          method: "POST",
          body: formDataPhoto,
        });

        if (!photoResponse.ok) {
          throw new Error("Error al subir la foto de perfil");
        }

        const photoData = await photoResponse.json();
        console.log("✅ Foto subida correctamente");
        
        // Actualizar la foto en el estado
        if (photoData.foto_perfil) {
          updatedUserData.foto_perfil = photoData.foto_perfil;
        }
      }

      // Actualizar el contexto de autenticación con los nuevos datos
      updateUser(updatedUserData);

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
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#fff",
      margin: 0,
    },
    photoSection: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginBottom: "40px",
      paddingBottom: "30px",
      borderBottom: "1px solid rgba(255, 215, 15, 0.2)",
    },
    photoContainer: {
      position: "relative",
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      background: "rgba(255, 215, 15, 0.1)",
      border: "2px solid rgba(255, 215, 15, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    photo: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "50%",
    },
    uploadLabel: {
      cursor: "pointer",
      background: "rgba(255, 215, 15, 0.1)",
      border: "1px solid rgba(255, 215, 15, 0.3)",
      color: "rgba(255, 215, 15, 1)",
      padding: "10px 15px",
      borderRadius: "8px",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    section: {
      marginBottom: "30px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#fff",
      marginBottom: "15px",
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
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#ccc",
      marginBottom: "8px",
    },
    input: {
      padding: "12px",
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 215, 15, 0.2)",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "14px",
      transition: "all 0.3s ease",
      fontFamily: "inherit",
    },
    inputError: {
      borderColor: "rgba(239, 68, 68, 0.5)",
      background: "rgba(239, 68, 68, 0.05)",
    },
    errorMessage: {
      color: "#ef4444",
      fontSize: "12px",
      marginTop: "5px",
    },
    passwordRequirements: {
      marginTop: "10px",
      padding: "12px",
      background: "rgba(255, 255, 255, 0.03)",
      borderRadius: "6px",
      border: "1px solid rgba(255, 215, 15, 0.1)",
    },
    requirementItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "12px",
      marginBottom: "6px",
      color: "#999",
    },
    requirementMet: {
      color: "#22c55e",
    },
    requirementNotMet: {
      color: "#ef4444",
    },
    buttonContainer: {
      display: "flex",
      gap: "15px",
      justifyContent: "flex-end",
      marginTop: "40px",
      paddingTop: "30px",
      borderTop: "1px solid rgba(255, 215, 15, 0.2)",
    },
    guardarButton: {
      background: "rgba(255, 215, 15, 1)",
      color: "#000",
      padding: "12px 30px",
      borderRadius: "8px",
      border: "none",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      opacity: loading ? 0.6 : 1,
    },
    successMessage: {
      background: "rgba(34, 197, 94, 0.1)",
      border: "1px solid rgba(34, 197, 94, 0.3)",
      color: "#22c55e",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontSize: "14px",
    },
    generalError: {
      background: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      color: "#ef4444",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontSize: "14px",
    },
    loadingOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    },
  };

  if (loading && !user) {
    return (
      <div style={styles.loadingOverlay}>
        <div style={{ color: "#fff", fontSize: "18px" }}>Cargando perfil...</div>
      </div>
    );
  }

  return (
    <>
      <Componente onToggle={handleNavbarToggle} />
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.title}>Mi Perfil</h1>
          </div>

          {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
          {errors.general && <div style={styles.generalError}>{errors.general}</div>}

          <div style={styles.photoSection}>
            <div style={styles.photoContainer}>
              {profilePhoto ? (
                <img src={profilePhoto} alt="Perfil" style={styles.photo} />
              ) : (
                <div style={{ color: "rgba(255, 215, 15, 0.5)", fontSize: "40px" }}>👤</div>
              )}
            </div>
            <div>
              <label style={styles.uploadLabel}>
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
                    placeholder="••••••••"
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
                    placeholder="••••••••"
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
                    placeholder="••••••••"
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