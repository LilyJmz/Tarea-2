var empleado = JSON.parse(localStorage.getItem('empleado'));
console.log('empleado: ', empleado);
var usuario = JSON.parse(localStorage.getItem('usuario'));
console.log('usuario: ', usuario);

document.addEventListener("DOMContentLoaded", function () {

    function mostrarDato(id, valor, etiqueta) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.innerHTML = `
                <div class="dato-empleado">
                    <span class="etiqueta">${etiqueta}:</span>
                    <span class="valor">${valor}</span>
                </div>
            `;
        }
    }

    // Mostrar los tres datos
    mostrarDato("idEmpleado", empleado.id, "ID Empleado");
    mostrarDato("nombre", empleado.nombre, "Nombre");
    mostrarDato("saldoVacaciones", empleado.saldoVacaciones + " días", "Saldo Vacaciones");

    listarMovimiento();
    console.log("Script.js se ha cargado correctamente");
});

function listarMovimiento() {
    // Obtener el empleado del localStorage (asumiendo que está almacenado ahí)

    if (!empleado || !empleado.id) {
        console.error("No se encontró información del empleado");
        return;
    }

    fetch('https://localhost:5001/api/BDController/MostrarMovimientosControlador', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            IdEmpleado: empleado.id  // Cambiado para coincidir con el parámetro del controlador
        })
    })
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return respuesta.json();
        })
        .then(datos => {
            const tbody = document.querySelector("#datosTabla");
            tbody.innerHTML = "";

            // Verificar si datos es un array o está dentro de una propiedad data
            const movimientos = Array.isArray(datos) ? datos : (datos.data || []);

            if (movimientos.length === 0) {
                const trInicio = document.createElement("tr");
                const tdNoData = document.createElement("td");
                tdNoData.colSpan = "7";  // Ajustado a 7 columnas
                tdNoData.textContent = "La tabla está vacía.";
                trInicio.appendChild(tdNoData);
                tbody.appendChild(trInicio);
            } else {
                movimientos.forEach((movimiento) => {
                    const trInicio = document.createElement("tr");

                    // Fecha del movimiento
                    const tdFecha = document.createElement("td");
                    tdFecha.textContent = new Date(movimiento.fecha).toLocaleDateString();
                    trInicio.appendChild(tdFecha);
                    const tdTipo = document.createElement("td");
                    const tipo = parseInt(String(movimiento.idTipoMovimiento).trim(), 10); // Asegura que sea string, limpia y convierte a número

                    switch (tipo) {
                        case 1:
                            tdTipo.textContent = "Cumplir mes";
                            break;
                        case 2:
                            tdTipo.textContent = "Bono vacacional";
                            break;
                        case 3:
                            tdTipo.textContent = "Reversion Debito";
                            break;
                        case 4:
                            tdTipo.textContent = "Disfrute de vacaciones";
                            break;
                        case 5:
                            tdTipo.textContent = "Venta de vacaciones";
                            break;
                        case 6:
                            tdTipo.textContent = "Reversion de Credito";
                            break;
                        default:
                            tdTipo.textContent = `Tipo no reconocido (${tipo})`; // Maneja casos no definidos
                            console.warn("Tipo de movimiento no reconocido:", tipo); // Depuración
                    }
                    trInicio.appendChild(tdTipo);
                    // Monto
                    const tdMonto = document.createElement("td");
                    tdMonto.textContent = movimiento.monto;
                    trInicio.appendChild(tdMonto);

                    // Nuevo saldo
                    const tdNuevoSaldo = document.createElement("td");
                    tdNuevoSaldo.textContent = movimiento.nuevoSaldo;
                    trInicio.appendChild(tdNuevoSaldo);

                    // Usuario que registró
                    const tdUsuario = document.createElement("td");
                    switch (movimiento.idPostByUser) {
                        case 1:
                            tdUsuario.textContent = "UsuarioScripts";
                            break;
                        case 2:
                            tdUsuario.textContent = "Arturo";
                            break;
                        case 3:
                            tdUsuario.textContent = "Alejandro";
                            break;
                        case 4:
                            tdUsuario.textContent = "Franco";
                            break;
                        case 5:
                            tdUsuario.textContent = "Daniel";
                            break;
                        case 6:
                            tdUsuario.textContent = "Alex";
                            break;
                        default:
                            tdUsuario.textContent = "Tipo desconocido";
                    }
                    trInicio.appendChild(tdUsuario);

                    // IP
                    const tdIP = document.createElement("td");
                    tdIP.textContent = movimiento.postInIp;
                    trInicio.appendChild(tdIP);

                    // Fecha de registro
                    const tdFechaRegistro = document.createElement("td");
                    tdFechaRegistro.textContent = new Date(movimiento.postTime).toLocaleString();
                    trInicio.appendChild(tdFechaRegistro);

                    tbody.appendChild(trInicio);
                });
            }
        })
        .catch(error => {
            console.error("Error al mostrar movimientos:", error);
            alert("Error al cargar los movimientos: " + error.message);
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





