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



async function mostrarUsuario(username, password) {
    try {
        const respuesta = await fetch('https://localhost:5001/api/BDController/MostrarUsuarioControlador');

        if (!respuesta.ok) {
            throw new Error("Error al obtener usuarios.");
        }

        const datos = await respuesta.json();

        let loginExitoso = false;
        let usuarioEncontrado = null;

        for (const usuario of datos) {
            if (usuario.username === username) {
                usuarioEncontrado = usuario;

                if (usuario.password === password) {
                    loginExitoso = true;
                }

                break; // Ya encontró el username, no sigue buscando
            }
        }

        // Si encontró el usuario, hacer el conteo de logins fallidos
        let cuenta = 0;
        let esUsuario = 0;
        if (usuarioEncontrado) {
            const contar = await contarLoginsFallidos(username, password, "25.55.61.33");
            cuenta = contar.conteo;
            esUsuario = contar.fueUsuario;
        }

        if (loginExitoso) {
            localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));

            const resultado = await verificarDeshabilitado(usuarioEncontrado.username);
            if (resultado.deshabilitado) {
                console.log("El usuario está temporalmente deshabilitado");
                alert("Tu cuenta está temporalmente deshabilitada por demasiados intentos fallidos. Intenta nuevamente más tarde.");
            } else {
                await insertarBitacora(1, "", parseInt(usuarioEncontrado.id), "25.55.61.33", new Date());
                alert("¡Login exitoso! Bienvenido " + usuarioEncontrado.username);
                document.getElementById('hacerLogin').disabled = false;
                window.location.href = 'VistaUsuario.html';
            }
        } else {
            // Login fallido
            if (usuarioEncontrado) {
                await insertarBitacora(2, `Intento ${cuenta} en los últimos 30 minutos, código de error 50002`, usuarioEncontrado.id, "25.55.61.33", new Date());
                alert("Contraseña incorrecta.");
            } else {
                await insertarBitacora(2, `Intento fallido en los últimos 30 minutos, código de error 50001`, 7, "25.55.61.33", new Date());
                alert("Usuario incorrecto.");
            }
            document.getElementById('hacerLogin').disabled = false;
        }

    } catch (error) {
        console.error("Error en login:", error);
        alert("Error al intentar iniciar sesión: " + error.message);
    }
}




async function CargarDatos() {
    try {
        const response = await fetch('https://localhost:5001/api/BDController/CargarControlador');
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error en la solicitud");
        }

        console.log(result.message);

    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
}

const insertarBitacora = (idTipoEvento, Descripcion, idPostByUser, PostInIp, PostTime) => {
    fetch('https://localhost:5001/api/BDController/InsertarBitacora', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idTipoEvento: idTipoEvento,
            Descripcion: Descripcion,
            idPostByUser: idPostByUser,
            PostInIp: PostInIp,
            PostTime: PostTime.toISOString().split('.')[0] + "Z"
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
async function contarLoginsFallidos(username, password, ipAddress) {
    try {
        const response = await fetch('https://localhost:5001/api/BDController/ContarLoginsFallidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Username: username,
                Password: password,
                IPAddress: ipAddress
            })
        });

        const data = await response.json();

        if (!response.ok || data.codigoError !== 0) {
            console.error('Error de la API:', data);
            throw new Error(JSON.stringify(data));
        }

        return data; // Devuelve el objeto { Conteo, FueUsuario, CodigoError }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
}



const verificarDeshabilitado = async (username) => {
    try {
        const response = await fetch('https://localhost:5001/api/BDController/VerificarDeshabilitado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Username: username
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al verificar estado:", errorData.message);
            return {
                deshabilitado: false,
                error: errorData.message || "Error desconocido"
            };
        }

        const data = await response.json();
        console.log(data);
        return {
            deshabilitado: data.deshabilitado,
            codigoError: data.codigoError || 0
        };

    } catch (error) {
        console.error("Error en la solicitud:", error);
        return {
            deshabilitado: false,
            error: error.message
        };
    }
};
