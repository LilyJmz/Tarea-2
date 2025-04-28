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
            let idU;
            let cuenta;
            let esUsuario;

            datos.forEach(usuario => {
                if (usuario.username === username) {
                    idU = usuario.id;
                }
            }); 
            

            datos.forEach(usuario => {
                if (usuario.username === username && usuario.password === password) {
                    loginExitoso = true;
                    localStorage.setItem('usuario', JSON.stringify(usuario));
                    bienvenido = usuario.username;
                    idU = usuario.id;
                    const contar = await contarLoginsFallidos(username, password, "25.55.61.33");
                    cuenta = contar.conteo;
                    esUsuario = contar.fueUsuario;
                }
            }); 
            

            

            if (loginExitoso) {
                const resultado = await verificarDeshabilitado(bienvenido);
                if (resultado.deshabilitado) {
                    console.log("El usuario está temporalmente deshabilitado");
                    // Mostrar mensaje al usuario
                    alert("Tu cuenta está temporalmente deshabilitada por demasiados intentos fallidos. Intenta nuevamente más tarde.");
                } else {
                    insertarBitacora(1, "", parseInt(idU), "25.55.61.33", new Date())
                    alert("¡Login exitoso! Bienvenido " + bienvenido);
                    document.getElementById('hacerLogin').disabled = false;
                    window.location.href = 'VistaUsuario.html';
                }
            } else {
                let numError = 50002;
                if (esUsuario) {
                    numError = 50001;
                    insertarBitacora(2, `Intento ${cuenta} en los últimos 20 minutos numero de error ${numError}`, 7, "25.55.61.33", new Date())
                }
                insertarBitacora(2, `Intento ${cuenta} en los últimos 20 minutos numero de error ${numError}`, parseInt(idU) , "25.55.61.33", new Date())
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
const contarLoginsFallidos = async (username, password, ipAddress) => {
    try {
        const response = await fetch('https://localhost:5001/api/BDController/ContarLoginsFallidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Username: username,
                Password: password,
                IPAddress: ipAddress
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la API:", errorData.message);
            throw new Error(errorData.message || "Error al verificar logins fallidos");
        }

        const data = await response.json();

        return {
            conteo: data.conteo,       
            fueUsuario: data.fueUsuario 
        };

    } catch (error) {
        console.error("Error en la solicitud:", error);
        
        return {
            conteo: 0,
            fueUsuario: 0
        };
    }
};

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
