import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import Componente from "./componente";

function Perfil() {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
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

  const handleNavbarToggle = (collapsed) => {
    setIsNavbarCollapsed(collapsed);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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

    if (formData.nuevaContrasena || formData.contrasenaActual || formData.confirmarContrasena) {
      if (!formData.contrasenaActual) {
        newErrors.contrasenaActual = "La contraseña actual es requerida";
      }
      if (!formData.nuevaContrasena) {
        newErrors.nuevaContrasena = "La nueva contraseña es requerida";
      }
      if (formData.nuevaContrasena.length < 8) {
        newErrors.nuevaContrasena = "La contraseña debe tener al menos 8 caracteres";
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
      console.log("Datos a enviar:", formData);
      
      setSuccessMessage("✅ Cambios guardados exitosamente");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setFormData((prev) => ({
        ...prev,
        contrasenaActual: "",
        nuevaContrasena: "",
        confirmarContrasena: "",
      }));
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setErrors({ general: "Error al guardar los cambios" });
    }
  };

  const handleVolver = () => {
    navigate("/Dueno");
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
    backButton: {
      background: "rgba(255, 215, 15, 0.1)",
      border: "1px solid rgba(255, 215, 15, 0.3)",
      color: "rgba(255, 215, 15, 1)",
      padding: "10px 15px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
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
    passwordHint: {
      fontSize: "12px",
      color: "#999",
      marginTop: "5px",
    },
    buttonContainer: {
      display: "flex",
      gap: "15px",
      justifyContent: "flex-end",
      marginTop: "40px",
      paddingTop: "30px",
      borderTop: "1px solid rgba(255, 215, 15, 0.2)",
    },
    volverButton: {
      background: "rgba(100, 100, 100, 0.2)",
      color: "#ccc",
      border: "1px solid rgba(100, 100, 100, 0.3)",
      padding: "12px 30px",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
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
  };

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
            <label style={styles.uploadLabel}>
              <FaUpload /> Cambiar Foto
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <form onSubmit={handleGuardarCambios}>
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
                  {!errors.nuevaContrasena && formData.nuevaContrasena && (
                    <span style={styles.passwordHint}>✓ Contraseña válida</span>
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
                type="submit"
                style={styles.guardarButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 215, 15, 0.9)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 215, 15, 1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Perfil;