import React, { useState } from "react"; // Importa React y el hook useState para manejar estados en el componente
import "./Recuperar.css"; // Importa los estilos CSS específicos para este componente
import logo from "./assets/logo.png"; // Importa la imagen del logo para mostrarla en la vista

function Recuperar({ volverAlLogin }) { // Define el componente funcional Recuperar, recibe la función volverAlLogin como prop
  const [email, setEmail] = useState(""); // Estado para almacenar el email ingresado por el usuario
  const [mensaje, setMensaje] = useState(""); // Estado para mostrar mensajes al usuario (éxito, error, advertencia)
  const [tipoMensaje, setTipoMensaje] = useState(""); // Estado para controlar el tipo/color del mensaje
  const [loading, setLoading] = useState(false); // Estado para indicar si la petición está en curso

  const handleRecuperar = async (e) => { // Función que se ejecuta al enviar el formulario
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)

    // Validación de email vacío
    if (!email) { // Si el campo email está vacío
      setMensaje("⚠️ El campo de correo no puede estar vacío."); // Muestra mensaje de error
      setTipoMensaje("error"); // Cambia el tipo de mensaje a error
      return; // Sale de la función
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar formato de email
    if (!emailRegex.test(email)) { // Si el email no cumple el formato
      setMensaje("⚠️ Ingrese un correo válido."); // Muestra mensaje de error
      setTipoMensaje("error"); // Cambia el tipo de mensaje a error
      return; // Sale de la función
    }

    try {
      setLoading(true); // Indica que la petición está en curso
      setMensaje(""); // Limpia el mensaje anterior
      setTipoMensaje(""); // Limpia el tipo de mensaje anterior

      const response = await fetch(
        "http://127.0.0.1:8000/api/usuarios/validar-correo/", // URL de la API para validar el correo
        {
          method: "POST", // Método HTTP POST
          headers: { "Content-Type": "application/json" }, // Especifica que el contenido es JSON
          body: JSON.stringify({ email }), // Envía el email en el cuerpo de la petición
        }
      );

      // La respuesta siempre será genérica por seguridad
      if (response.ok) { // Si la respuesta es exitosa (código 200)
        setMensaje(
          "✅ Hemos enviado un enlace de recuperación a tu correo, revisa tu bandeja de entrada."
        ); // Muestra mensaje de éxito genérico
        setTipoMensaje("exito"); // Cambia el tipo de mensaje a éxito
      } else { // Si la respuesta no es exitosa
        setMensaje(
          "❌ Correo Incorrecto."
        ); // Muestra mensaje de error genérico
        setTipoMensaje("error"); // Cambia el tipo de mensaje a error
      }
    } catch (error) { // Si ocurre un error en la petición (por ejemplo, no hay conexión)
      setMensaje("⚠️ Error de conexión con el servidor"); // Muestra mensaje de advertencia
      setTipoMensaje("advertencia"); // Cambia el tipo de mensaje a advertencia
    } finally {
      setLoading(false); // Indica que la petición ha terminado
    }
  };

  return (
    <div className="recuperar-container"> {/* Contenedor principal con fondo y centrado */}
      <img src={logo} alt="Logo" className="logo" /> {/* Muestra el logo arriba de la caja */}
      <div className="recuperar-box"> {/* Caja del formulario */}
        <h2>Recuperación de Contraseña</h2> {/* Título de la vista */}
        <p>Ingresa tu dirección de correo electrónico a continuación y te enviaremos un enlace para restablecer tu contraseña.</p>
        <form onSubmit={handleRecuperar}> {/* Formulario para ingresar el email */}
          <input
            type="email"
            placeholder="Ingrese su correo electronico"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado email al escribir
            required // Hace que el campo sea obligatorio
            disabled={loading} // Deshabilita el input mientras se envía la petición
          />
          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace"} {/* Cambia el texto del botón según el estado */}
          </button>
        </form>
        <button className="volver" onClick={volverAlLogin} disabled={loading}>
          Volver a Inicio de Sesión  {/* Botón para volver al login */}
        </button>
        {mensaje && <p className={`mensaje ${tipoMensaje}`}>{mensaje}</p>} {/* Muestra el mensaje con el color según el tipo */}
      </div>
    </div>
  );
}

export default Recuperar; // Exporta el componente para poder usarlo en otros archivos