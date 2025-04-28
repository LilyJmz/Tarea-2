var empleado = JSON.parse(localStorage.getItem('empleado'));
console.log('empleado: ', empleado);
var usuario = JSON.parse(localStorage.getItem('usuario'));
console.log('usuario: ', usuario);

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("idEmpleado").innerHTML = empleado.id;
    document.getElementById("nombre").innerHTML = empleado.nombre;
    document.getElementById("saldoVacaciones").innerHTML = empleado.saldoVacaciones;

    listarMovimientos();
    console.log("Script.js se ha cargado correctamente");
});

function listarMovimiento() {
    fetch('https://localhost:5001/api/BDController/MostrarMovimientosControlador', empleado.id)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error();
            }
            return respuesta.json();
        })
        .then(datos => {
            const tbody = document.querySelector("#datosTabla");
            tbody.innerHTML = "";

            if (datos.length === 0) {
                const trInicio = document.createElement("tr");
                const tdNoData = document.createElement("td");
                tdNoData.colSpan = 5;
                tdNoData.textContent = "La tabla esta vacia.";
                trInicio.appendChild(tdNoData);
                tbody.appendChild(trInicio);
            } else {
                console.log(datos);
                datos.forEach((movimiento) => {
                    const trInicio = document.createElement("tr");

                    const tdFecha = document.createElement("td");
                    const fecha = new Date(movimiento.fecha);
                    tdFecha.textContent = fecha.toISOString().split('T')[0];
                    trInicio.appendChild(fecha)

                    const tdNombre = document.createElement("td");
                    tdDocumento.textContent = movimiento.id; //Añadir el nombre al storedProcedure comparando con tiposMovimientos
                    trInicio.appendChild(tdNombre);

                    const tdMonto = document.createElement("td");
                    tdPuesto.textContent = movimiento.monto;
                    trInicio.appendChild(tdMonto);

                    const tdNuevoSaldo = document.createElement("td");
                    tdNuevoSaldo.textContent = movimiento.nuevoSaldo;
                    trInicio.appendChild(tdNuevoSaldo);

                    const tdNombreUsuario = document.createElement("td");
                    tdSaldo.textContent = movimiento.nombreUsuario;
                    trInicio.appendChild(tdNombreUsuario);

                    const tdIP = document.createElement("td");
                    tdSaldo.textContent = movimiento.postInIP;
                    trInicio.appendChild(tdIP);

                    const tdFechaHora = document.createElement("td");
                    tdSaldo.textContent = movimiento.postTime;
                    trInicio.appendChild(tdFechaHora);

                    tbody.appendChild(trInicio);
                });
            }
        })
        .catch(error => {
            console.log("No se muestra la tabla.");
            console.error(error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    try {
        const button = document.getElementById('regresarMovimientosVista');
        button.addEventListener('click', function () {
            window.location.href = 'VistaUsuario.html';
        });
    }
    catch {
        return (null);
    }
});

document.getElementById("irInsertarMovimiento").addEventListener("click", () => {
    if (empleado) {
        localStorage.setItem('empleado', empleado);
        localStorage.setItem('usuario', usuario);
        window.location.href = 'InsertarMovimiento.html';
    }
});

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


