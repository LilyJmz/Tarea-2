var empleado = JSON.parse(localStorage.getItem('empleado'));
console.log('empleado: ', empleado);
var usuario = JSON.parse(localStorage.getItem('usuario'));
console.log('usuario: ', usuario);
function listarMovimiento() {
    fetch('https://localhost:5001/api/BDController/(AnnadirStoredProcedure)', empleado.id)
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
                    tdDocumento.textContent = movimiento.nombre;
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

document.getElementById("insertarMovimientoBtn").addEventListener("click", () => {
    if (empleado) {
        alert(`Mostrando movimientos de: ${empleado.nombre}`);
        localStorage.setItem('empleado', empleado);
        localStorage.setItem('usuario', usuario);
        window.location.href = 'InsertarMovimiento.html';
    }
});
