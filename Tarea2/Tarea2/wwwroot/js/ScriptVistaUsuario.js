

//Acciones en html

//Carga la tabla cuando se corre la página
document.addEventListener("DOMContentLoaded", function () { 
    mostrarEmpleado();
    console.log("Script.js se ha cargado correctamente");
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
                        window.location.href = `CUDEmpleado.html?id=${empleado.id}`;
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
        .catch(() => {
            console.log("No se muestra la tabla.");
        });
}



   