//Si le da a botón login cambia de página
document.addEventListener('DOMContentLoaded', function () {
    try {
        const button = document.getElementById('hacerLogin');
        button.addEventListener('click', function () {
            document.getElementById('hacerLogin').disabled = true;
            const username = document.getElementById("usuario").value.trim();
            const password = document.getElementById("contraseña").value.trim();
            mostrarUsuario(username, password);
        });
    }
    catch {
        return (null);
    }
});



function mostrarUsuario(username, password) {
    fetch('https://localhost:5001/api/BDController/MostrarUsuarioControlador')
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error("Error al obtener usuarios.");
            }
            return respuesta.json();
        })
        .then(datos => {
            let loginExitoso = false;
            let bienvenido;

            datos.forEach(usuario => {
                if (usuario.username === username && usuario.password === password) {
                    loginExitoso = true;
                    bienvenido = usuario.username;
                }
            });

            if (loginExitoso) {
                alert("¡Login exitoso! Bienvenido " + bienvenido);
                document.getElementById('hacerLogin').disabled = false;
                window.location.href = 'VistaUsuario.html';
            } else {
                alert("Usuario o contraseña incorrectos.");
                document.getElementById('hacerLogin').disabled = false;
            }
        })
        .catch(error => {
            console.log("No hay usuarios registrados.");
            console.error(error);
        });
}


