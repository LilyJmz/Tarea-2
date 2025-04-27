document.addEventListener("DOMContentLoaded", function () {
    console.log("Cargando datos"); 
    CargarDatos();
    console.log("Datos Cargados"); 

    try {
        const button = document.getElementById('hacerLogin');
        if (button) {
            button.addEventListener('click', function () {
                this.disabled = true;
                const username = document.getElementById("usuario").value.trim();
                const password = document.getElementById("contraseña").value.trim();
                mostrarUsuario(username, password);
            });
        }
    } catch (error) {
        console.error("Error setting up login button:", error);
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
                    localStorage.setItem('usuario', JSON.stringify(usuario));
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


async function CargarDatos() {
    try {
        const response = await fetch('https://localhost:5001/api/BDController/CargarControlador');
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error en la solicitud");
        }

        console.log(result.message);
        alert(result.message);

    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
}

const insertarEmpleado = (idTipoEvento, Descripcion, idPostByUser, PostInIp, PostTime) => {
    fetch('https://localhost:5001/api/BDController/InsertarBitacora', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idTipoEvento = idTipoEvento;
            Descripcion = Descripcion;
            idPostByUser = idPostByUser;
            PostInIp = PostInIp;
            PostTime = PostTime;
        }),
    })
        .then(respuesta => {
            if (!respuesta.ok) {
                return respuesta.json().then(errorDetails => {
                    // Aquí logueas el código de error y el mensaje para diagnosticar el problema
                    console.log("Código de error:", errorDetails.codigoError);
                    console.log("Mensaje de error:", errorDetails.message);
                    throw new Error(`Error: ${errorDetails.message} - Código de error: ${errorDetails.codigoError}`);
                });
            }
            return respuesta.json();
        })
        .catch((error) => {
            // Este bloque captura y muestra cualquier error que ocurra durante la solicitud
            console.error("Error al intentar registrar el evento:", error);
        });
}
