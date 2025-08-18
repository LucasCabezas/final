

btnLink.addEventListener('click', function(e) {
    e.preventDefault(); // Previene navegación inmediata

    // Selecciona el contenedor del formulario
    const form = document.querySelector('.form-container');

    // Agrega la animación de salida
    form.classList.add('fade-out-Left');

    // Cuando termina la animación, redirige a la URL del enlace
    form.addEventListener('animationend', function() {
        window.location.href = btnLink.href;
    }, { once: true }); // Se ejecuta solo una vez
});