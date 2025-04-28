
var empleado = JSON.parse(localStorage.getItem('empleado'));
console.log('empleado: ', empleado);
var usuario = JSON.parse(localStorage.getItem('usuario'));
console.log('usuario: ', usuario);
let NombreMovimiento;

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("idEmpleado").innerHTML = empleado.id;
    document.getElementById("nombre").innerHTML = empleado.nombre;
    document.getElementById("saldoVacaciones").innerHTML = empleado.saldoVacaciones;

    mostrarMovimientos();
    console.log("Script.js se ha cargado correctamente");
});

//Si le da a botón insertar revisa el contenido de los cuadros de texto
document.addEventListener('DOMContentLoaded', function () {
    try {
        const button = document.getElementById('accionInsertarMovimiento');
        button.addEventListener('click', function () {
            document.getElementById('accionInsertarMovimiento').disabled = true;
            document.getElementById('regresarInsertarMovVista').disabled = true;
            var movimiento = document.getElementById('movimiento').value.trim();
            const monto = document.getElementById('monto').value.trim();

            const montoRegex = /^\d+(\.\d{1,2})?$/;

            if (monto === "") {
                alert("No puede dejar su monto vacío");
            } else if (!nameRegex.test(nombre)) {
                alert("No puede ingresar caracteres especiales en su monto");

            } else if (movimiento === "") {
                alert("Debe ingresar un puesto");
            } else {
                const fechaMovimiento = new Date().toISOString().split('T')[0];
                const tiempoMovimiento = new Date().toTimeString();

                insertarMovimiento(empleado.nombre, movimiento.id, fechaMovimiento, monto, empleado.saldoVacaciones, usuario.username, "25.55.61.33", tiempoMovimiento);
                document.getElementById('accionInsertarMovimiento').disabled = false;
                document.getElementById('regresarInsertarMovVista').disabled = false;

            }
        });
    }
    catch {
        return (null);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    try {
        const button = document.getElementById('regresarInsertarMovVista');
        button.addEventListener('click', function () {
            window.location.href = 'VistaUsuario.html';
        });
    }
    catch {
        return (null);
    }
});


const insertarMovimiento = (empleadoId, idMovimiento, fechaMovimiento, monto, nuevoSaldo, usuario, ip, hora) => {
    fetch('https://localhost:5001/api/BDController/InsertarMovimiento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            IdEmpleado: empleadoId,
            IdTipoMovimiento: idMovimiento,
            Fecha: fechaMovimiento,
            Monto: monto,
            NuevoSaldo: nuevoSaldo,
            IdPostByUser: usuario,
            PostInIP: ip,
            PostTime: hora
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
            insertarBitacora(14, `${empleado.docId} ${empleado.nombre}  ${nuevoSaldo} ${NombreMovimiento} ${monto}`, parseInt(usuario.id), "25.55.61.33", new Date())
            alert("Movimiento insertado exitosamente");
        })
        .catch((error) => {
            insertarBitacora(13, `Intento de insertar movimiento ${empleado.docId} ${empleado.nombre}  ${nuevoSaldo} ${NombreMovimiento} ${monto}`, parseInt(usuario.id), "25.55.61.33", new Date())
            // Este bloque captura y muestra cualquier error que ocurra durante la solicitud
            console.error("Error al intentar registrar el movimiento:", error);
        });
}


function mostrarMovimientos() {
    fetch('https://localhost:5001/api/BDController/MostrarTiposMovimientosControlador')
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('Error en la solicitud de movientos: ' + respuesta.statusText);
            }
            return respuesta.json();
        })
        .then(datos => {
            const select = document.getElementById("movimiento");
            select.innerHTML = "";  // Clear existing options
            console.log(datos);

            if (datos.length === 0) {
                const opcion = document.createElement("option");
                opcion.textContent = "No hay movimientos disponibles";
                opcion.disabled = true;
                opcion.selected = true;
                select.appendChild(opcion);
            } else {
                datos.forEach(movimiento => {
                    const opcion = document.createElement("option");
                    opcion.value = movimiento;
                    opcion.textContent = movimiento.nombre;
                    NombreMovimiento = movimiento.nombre;
                    select.appendChild(opcion);
                });
            }
        })
        .catch(error => {
            console.log("Error al mostrar la lista de movimiento:", error);
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

