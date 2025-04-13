//Acciones en html

//Carga la tabla cuando se corre la página
document.addEventListener("DOMContentLoaded", function () {
    mostrarPuesto();
    console.log("Script.js se ha cargado correctamente");
});


//Si le da a botón insertar revisa el contenido de los cuadros de texto
//document.addEventListener('DOMContentLoaded', function () {
//    try {
//        const button = document.getElementById('accionInsertar');
//        button.addEventListener('click', function () {
//        const nombre = document.getElementById('nombre').value.trim();
//        const salarioStr = document.getElementById('salario').value.trim();

//        //Validaciones de nombre
//        const nameRegex = /^[a-zA-Z\s\-]+$/;
//        if (nombre === "") {
//            alert("No puede dejar su nombre vacío");
//        } else if (!nameRegex.test(nombre)) {
//            alert("No puede ingresar caracteres especiales en su nombre");

//        //Validaciones de salario
//        } else if (!/^\d+(\.\d{1,2})?$/.test(salarioStr)) {
//            alert("Solo puede ingresar números y un punto decimal en su salario");
//        }
//        else if (salario === "") {
//            alert("No puede dejar el salario vacío");
//        } else {

//            const salario = parseFloat(salarioStr);
//            if (isNaN(salario)) {
//                alert("Solo puede ingresar números y un punto decimal en su salario");
//            } else {

//                //Llama función si los campos son correctos
//                    insertarEmpleado(nombre, salario);
//            }
//        }
//        });
//    }
//    catch {
//        return (null);
//        }
//});



// Llamar a stored procedures
//function insertarEmpleado(nombre, salario) {
//    fetch('https://localhost:5001/api/BDController/InsertarControlador', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json',
//        },
//        body: JSON.stringify({
//            Nombre: nombre,
//            Salario: salario
//        }),
//    })
//        .then(respuesta => {
//            //Si devuelve que el nombre está repetido activa una alerta
//            if (!respuesta.ok) {
//                throw new Error();
//            }
//            return respuesta.json();
//        })
//        .then(datos => {
//            //Si todo está bien da mensaje de éxito
//            alert("Empleado insertado exitosamente");
//        })
//        .catch(() => {
//            alert("Este empleado ya ha sido registrado");
//        });
//}


function mostrarPuesto() {
    fetch('https://localhost:5001/api/BDController/MostrarPuestoControlador')
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error();
            }
            return respuesta.json();
        })
        .then(datos => {
            const select = document.getElementById("puesto");
            select.innerHTML = "";

            if (datos.length === 0) {
                const opcion = document.createElement("option");
                opcion.textContent = "No hay puestos disponibles";
                opcion.disabled = true;
                opcion.selected = true;
                select.appendChild(opcion);
            } else {
                datos.forEach(puesto => {
                    const opcion = document.createElement("option");
                    opcion.value = puesto.id;
                    opcion.textContent = puesto.Nombre;
                    select.appendChild(opcion);
                });
            }
        })
        .catch(() => {
            console.log("No se muestra la tabla.");
        });
}
