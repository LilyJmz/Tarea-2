//Acciones en html
let empleadoSeleccionado = null;
let filaSeleccionada = null;
//Carga la tabla cuando se corre la página
document.addEventListener("DOMContentLoaded", function () {
    mostrarEmpleado();
    console.log("Script.js se ha cargado correctamente");
});

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

//Si le da a botón insertar cambia de página
document.addEventListener('DOMContentLoaded', function () {
    try {
        const button = document.getElementById('irInsertarEmpleado');
        button.addEventListener('click', function () {
            window.location.href = 'InsertarEmpleado.html';
        });
    }
    catch {
        return (null);
    }
});

function mostrarEmpleado() {
    fetch('https://localhost:5001/api/BDController/MostrarControlador')
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
                tdNoData.textContent = "La tabla está vacía.";
                trInicio.appendChild(tdNoData);
                tbody.appendChild(trInicio);
            } else {
                console.log(datos);
                datos.forEach((empleado) => {
                    const trInicio = document.createElement("tr");

                    const tdNombre = document.createElement("td");
                    tdNombre.textContent = empleado.nombre;
                    tdNombre.style.cursor = "pointer";
                    tdNombre.style.color = "steelblue";
                    tdNombre.style.textDecoration = "underline";

                    tdNombre.addEventListener("click", () => {
                        const currentBackground = window.getComputedStyle(tdNombre).backgroundColor;

                        if (filaSeleccionada) {
                            filaSeleccionada.style.backgroundColor = "#ffffff"; 
                        }

                        if (currentBackground === "rgb(187, 190, 191)") {  
                            tdNombre.style.backgroundColor = "#ffffff"; 
                            empleadoSeleccionado = null;
                            filaSeleccionada = null; 
                        } else {
                            tdNombre.style.backgroundColor = "#bbbebf"; 
                            empleadoSeleccionado = empleado;
                            filaSeleccionada = tdNombre; 
                        }
                        actualizarBotones(); 
                    });
                    trInicio.appendChild(tdNombre);

                    const tdDocumento = document.createElement("td");
                    tdDocumento.textContent = empleado.valorDocumentoIdentidad;
                    trInicio.appendChild(tdDocumento);

                    const tdPuesto = document.createElement("td");
                    tdPuesto.textContent = empleado.puesto;
                    trInicio.appendChild(tdPuesto);

                    const tdFecha = document.createElement("td");
                    const fecha = new Date(empleado.fechaContratacion);
                    tdFecha.textContent = fecha.toISOString().split('T')[0];
                    trInicio.appendChild(tdFecha);

                    const tdSaldo = document.createElement("td");
                    tdSaldo.textContent = empleado.saldoVacaciones;
                    trInicio.appendChild(tdSaldo);

                    tbody.appendChild(trInicio);
                });
            }
        })
        .catch(error => {
            console.log("No se muestra la tabla.");
            console.error(error); 
        });
}

function actualizarBotones() {
    if (empleadoSeleccionado) {
        document.getElementById("consultarBtn").disabled = false;
        document.getElementById("actualizarBtn").disabled = false;
        document.getElementById("eliminarBtn").disabled = false;
        document.getElementById("movimientosBtn").disabled = false;
    } else {
        document.getElementById("consultarBtn").disabled = true;
        document.getElementById("actualizarBtn").disabled = true;
        document.getElementById("eliminarBtn").disabled = true;
        document.getElementById("movimientosBtn").disabled = true;
    }
}




document.getElementById("consultarBtn").addEventListener("click", () => {
    if (empleadoSeleccionado) {
        alert(`Consultando empleado: ${empleadoSeleccionado.nombre}`);
    }
});

document.getElementById("actualizarBtn").addEventListener("click", () => {
    if (empleadoSeleccionado) {
        alert(`Actualizando empleado: ${empleadoSeleccionado.nombre}`);
    }
});

document.getElementById("eliminarBtn").addEventListener("click", () => {
    if (empleadoSeleccionado) {
        alert(`Eliminando empleado: ${empleadoSeleccionado.nombre}`);
    }
});

document.getElementById("movimientosBtn").addEventListener("click", () => {
    if (empleadoSeleccionado) {
        alert(`Mostrando movimientos de: ${empleadoSeleccionado.nombre}`);
    }
});

   