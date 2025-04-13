//Si le da a botón login cambia de página
document.addEventListener('DOMContentLoaded', function () {
    try {
        const button = document.getElementById('hacerLogin');
        button.addEventListener('click', function () {
            window.location.href = 'VistaUsuario.html';
        });
    }
    catch {
        return (null);
    }
});


