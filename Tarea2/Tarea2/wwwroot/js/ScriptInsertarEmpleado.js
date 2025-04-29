//Acciones en html
var usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario) {
    console.log("Usuario no encontrado");
    // Puedes redirigir o manejar el error adecuadamente
} else {
    console.log(usuario);
}

//Carga la tabla cuando se corre la página
document.addEventListener("DOMContentLoaded", function () {
    mostrarPuesto();
    console.log("Script.js se ha cargado correctamente");
});


//Si le da a botón insertar revisa el contenido de los cuadros de texto
document.addEventListener('DOMContentLoaded', function () {
    try {
        const button = document.getElementById('accionInsertar');
        button.addEventListener('click', function () {
            document.getElementById('accionInsertar').disabled = true;
            document.getElementById('regresarInsertarVista').disabled = true;
            const nombre = document.getElementById('nombre').value.trim();
            const docId = document.getElementById('docId').value.trim();
            const puesto = document.getElementById('puesto').value.trim();

            const nameRegex = /^[a-zA-Z\s\-]+$/;
            const docRegex = /^\d{7,9}$/;

            if (nombre === "") {
                alert("No puede dejar su nombre vacío");
            } else if (!nameRegex.test(nombre)) {
                alert("No puede ingresar caracteres especiales en su nombre");
            } else if (docId === "") {
                alert("No puede dejar su documento de identificación vacío");
            } else if (!docRegex.test(docId)) {
                alert("Solo puede agregar números en su documento de identificación");
            } else if (puesto === "") {
                alert("Debe ingresar un puesto");
            } else {
                const fechaContratacion = new Date().toISOString().split('T')[0];
                insertarEmpleado(puesto, docId, nombre, fechaContratacion, 0, true);
                document.getElementById('accionInsertar').disabled = false;
                document.getElementById('regresarInsertarVista').disabled = false;
            }
        });
    }
    catch {
        return (null);
        }
});

//Si le da click a regresar vuelve a la página inicial
document.addEventListener('DOMContentLoaded', function () {
    try {
        const button = document.getElementById('regresarInsertarVista');
        button.addEventListener('click', function () {
            window.location.href = 'VistaUsuario.html';
        });
    }
    catch {
        return (null);
    }
});


// Llamar a stored procedures
const insertarEmpleado = (puesto, docId, nombre, fechaContratacion, saldoVacaciones, esActivo) => {
    fetch('https://localhost:5001/api/BDController/InsertarControlador', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Puesto: puesto,
            ValorDocumentoIdentidad: docId,
            Nombre: nombre,
            FechaContratacion: fechaContratacion,
            SaldoVacaciones: saldoVacaciones,
            EsActivo: esActivo
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
        .then(datos => {
            insertarBitacora(6, `${puesto} ${docId.trim()}  ${nombre} `, parseInt(usuario.id), "25.55.61.33", new Date())
            alert("Empleado insertado exitosamente");
        })
        .catch((error) => {
            // Este bloque captura y muestra cualquier error que ocurra durante la solicitud
            console.error("Error al intentar registrar el empleado:", error);
            insertarBitacora(5, `Empleado con ValorDocumentoIdentidad ya existe en inserción ${puesto} ${docId.trim()}  ${nombre}`, parseInt(usuario.id), "25.55.61.33", new Date())
            insertarBitacora(5, `Empleado con mismo nombre ya existe en inserción ${puesto} ${docId.trim()}  ${nombre}`, parseInt(usuario.id), "25.55.61.33", new Date())
            alert("Ya existe un empleado con este documento de identidad o nombre");
            //await manejarError(50004);
            //await manejarError(50005);
             });
}


function mostrarPuesto() {
    fetch('https://localhost:5001/api/BDController/MostrarPuestoControlador')
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('Error en la solicitud de puestos: ' + respuesta.statusText);
            }
            return respuesta.json();
        })
        .then(datos => {
            const select = document.getElementById("puesto");
            select.innerHTML = "";  // Clear existing options
            console.log(datos);

            if (datos.length === 0) {
                const opcion = document.createElement("option");
                opcion.textContent = "No hay puestos disponibles";
                opcion.disabled = true;
                opcion.selected = true;
                select.appendChild(opcion);
            } else {
                datos.forEach(puesto => {
                    const opcion = document.createElement("option");
                    opcion.value = puesto.nombre;  
                        opcion.textContent = puesto.nombre;
                    select.appendChild(opcion);
                });
            }
        })
        .catch(error => {
            console.log("Error al mostrar la lista de puestos:", error);
        });
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

const manejarError = async (codigoError) => {
    try {
        const response = await fetch('https://localhost:5001/api/BDController/ManejarError', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                CodigoError: codigoError
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al manejar error:", errorData.message);
            alert("Ocurrió un error al procesar el código de error");
            return {
                descripcion: "Error desconocido",
                codigoError: 50005
            };
        }

        const data = await response.json();

        // Mostrar la descripción 
        if (data.descripcion) {
            alert(data.descripcion);
        }

        return {
            descripcion: data.descripcion,
            codigoError: data.codigoError || 0
        };

    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error de conexión al intentar manejar el error");
        return {
            descripcion: "Error de conexión",
            codigoError: 50005
        };
    }
};

