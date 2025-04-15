//Acciones en html
let empleadoSeleccionado = null;
let filaSeleccionada = null;
var usuario= JSON.parse(localStorage.getItem('usuario'));
console.log('usuario: ', usuario);
//Carga la tabla cuando se corre la pagina
document.addEventListener("DOMContentLoaded", function () {
    mostrarEmpleado();
    console.log("Script.js se ha cargado correctamente");
});

//Si le da a boton login cambia de pagina
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

//Si le da a boton insertar cambia de pagina
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


document.addEventListener('DOMContentLoaded', function () {
    try {
        const button = document.getElementById('filtro');
        button.addEventListener('click', function () {
            const inFiltro = document.getElementById("inFiltro").value.trim();
            const numRegex = /^\d+$/;
            const letraRegex = /^[a-zA-Z\s\-]+$/;

            if (inFiltro === "") {
                mostrarEmpleado();
            } else if (numRegex.test(inFiltro)) {
                filtrarEmpleado(inFiltro, 2);
            } else if (letraRegex.test(inFiltro)) {
                filtrarEmpleado(inFiltro, 1);
            } else {
                alert("El filtro por nombre tiene solo letras y el filtro por identificacion solo numeros");
                } 
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
                tdNoData.textContent = "La tabla esta vacia.";
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

function filtrarEmpleado(busqueda, tipo) {
    fetch('https://localhost:5001/api/BDController/FiltrarControlador', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inBusqueda: busqueda,
            inTipo: tipo
        })
    })
        .then(respuesta => {
            if (!respuesta.ok) throw new Error();
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
        document.getElementById("listarMovimientosBtn").disabled = false;
        document.getElementById("insertarMovimientoBtn").disabled = false;
    } else {
        document.getElementById("consultarBtn").disabled = true;
        document.getElementById("actualizarBtn").disabled = true;
        document.getElementById("eliminarBtn").disabled = true;
        document.getElementById("listarMovimientosBtn").disabled = true;
        document.getElementById("insertarMovimientoBtn").disabled = true;
    }
}




document.getElementById("consultarBtn").addEventListener("click", () => {
    if (empleadoSeleccionado) {
        localStorage.setItem('empleado', JSON.stringify(empleadoSeleccionado));
        window.location.href = 'ConsultarEmpleado.html';

    }
});

document.getElementById("actualizarBtn").addEventListener("click", () => {
    if (empleadoSeleccionado) {
        localStorage.setItem('empleado', JSON.stringify(empleadoSeleccionado));
        window.location.href = 'ActualizarEmpleado.html';
    }
});

document.getElementById("eliminarBtn").addEventListener("click", () => {
    if (empleadoSeleccionado) {
        if (confirm(`Seguro que deseas eliminar al empleado: ${empleadoSeleccionado.nombre} documento de identidad ${empleadoSeleccionado.valorDocumentoIdentidad.trim() }?`)) {
            deleteEmpleado(empleadoSeleccionado.id);
        } else {

            alert("Eliminacion cancelada.");
        }
        
    }
});

document.getElementById("listarMovimientosBtn").addEventListener("click", () => {
    if (empleadoSeleccionado) {
        alert(`Mostrando movimientos de: ${empleadoSeleccionado.nombre}`);
        localStorage.setItem('empleado', JSON.stringify(empleadoSeleccionado));
        window.location.href = 'ListarMovimientos.html';
    }
});

document.getElementById("insertarMovimientoBtn").addEventListener("click", () => {
    if (empleadoSeleccionado) {
        alert(`Mostrando movimientos de: ${empleadoSeleccionado.nombre}`);
        localStorage.setItem('empleado', JSON.stringify(empleadoSeleccionado));
        localStorage.setItem('usuario', JSON.stringify(usuario));
        window.location.href = 'InsertarMovimiento.html';
    }
});



// Llamar a stored procedures
const deleteEmpleado = (id) => {
        fetch('https://localhost:5001/api/BDController/DeleteControlador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(id)
        })
        .then(respuesta => {
            if (!respuesta.ok) {
                return respuesta.json().then(errorDetails => {
                    // Aqui logueas el codigo de error y el mensaje para diagnosticar el problema
                    console.log("Codigo de error:", errorDetails.codigoError);
                    console.log("Mensaje de error:", errorDetails.message);
                    throw new Error(`Error: ${errorDetails.message} - Codigo de error: ${errorDetails.codigoError}`);
                });
            }
            return respuesta.json();
        })
        .then(datos => {
            alert("Empleado eliminado exitosamente");
            mostrarEmpleado();
        })
        .catch((error) => {
            // Este bloque captura y muestra cualquier error que ocurra durante la solicitud
            console.error("Error al intentar eliminar el empleado:", error);
            alert(error.message);
        });
}


   