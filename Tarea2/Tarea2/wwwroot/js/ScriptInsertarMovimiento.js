const empleado = JSON.parse(localStorage.getItem('empleado'));
const usuario = JSON.parse(localStorage.getItem('usuario'));
let tiposMovimiento = [];

document.addEventListener("DOMContentLoaded", function () {
    if (empleado) {
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
    }
    mostrarTiposMovimiento();
    setupButtons();
});

function setupButtons() {
    const insertBtn = document.getElementById('accionInsertarMovimiento');
    if (insertBtn) {
        insertBtn.addEventListener('click', validarYInsertarMovimiento);
    }

    const backBtn = document.getElementById('regresarInsertarMovVista');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'VistaUsuario.html';
        });
    }
}

function validarYInsertarMovimiento() {
    const movimientoSelect = document.getElementById('movimiento');
    const montoInput = document.getElementById('monto');
    const tipoSeleccionado = movimientoSelect.value;

    // Validaciones básicas
    if (!tipoSeleccionado) {
        alert("Debe seleccionar un tipo de movimiento");
        return;
    }

    const monto = parseFloat(montoInput.value);
    if (isNaN(monto) || monto <= 0) {
        alert("Ingrese un monto válido (número mayor que 0)");
        return;
    }

    // Obtener tipo de movimiento seleccionado
    const tipoMov = tiposMovimiento.find(t => t.id == tipoSeleccionado);
    if (!tipoMov) {
        alert("Tipo de movimiento no válido");
        return;
    }

    // Calcular nuevo saldo según el tipo de acción (booleano)
    let nuevoSaldo = empleado.saldoVacaciones;
    if (tipoMov.tipoAccion === true) { // SUMA
        nuevoSaldo += monto;
    } else if (tipoMov.tipoAccion === false) { // RESTA
        nuevoSaldo -= monto;

        // Validar que el saldo no sea negativo
        if (nuevoSaldo < 0) {
            alert("No hay suficiente saldo disponible para este movimiento");
            return;
        }
    } else {
        alert("Tipo de acción no definido correctamente");
        return;
    }

    document.getElementById('accionInsertarMovimiento').disabled = true;
    document.getElementById('regresarInsertarMovVista').disabled = true;

    const now = new Date();

    const movimientoData = {
        IdEmpleado: empleado.id,
        IdTipoMovimiento: tipoMov.id,
        Fecha: now.toISOString().split('T')[0], // Formato YYYY-MM-DD
        Monto: monto,
        NuevoSaldo: nuevoSaldo,
        IdPostByUser: usuario.id,
        PostInIp: "25.55.61.33",
        PostTime: now.toISOString() // DateTime completo
    };

    insertarMovimiento(movimientoData, tipoMov.nombre);
}

function insertarMovimiento(movimientoData, nombreMovimiento) {
    fetch('https://localhost:5001/api/BDController/InsertarMovimiento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimientoData) // Enviamos el objeto directamente
    })
        .then(async respuesta => {
            if (!respuesta.ok) {
                const errorData = await respuesta.json();
                throw new Error(errorData.message || "Error al insertar movimiento");
            }
            return respuesta.json();
        })
        .then(data => {
            empleado.saldoVacaciones = movimientoData.NuevoSaldo;
            document.getElementById("saldoVacaciones").textContent = movimientoData.NuevoSaldo + " días";

            insertarBitacora(14, `${empleado.id} ${empleado.nombre} ${movimientoData.NuevoSaldo} ${nombreMovimiento} ${movimientoData.Monto}`,
                usuario.id, "25.55.61.33", new Date());

            alert("Movimiento insertado exitosamente");
            document.getElementById('monto').value = '';
        })
        .catch(error => {
            console.error("Error:", error);
            insertarBitacora(13, `Intento de insertar movimiento ${empleado.id} ${empleado.nombre} ${movimientoData.NuevoSaldo} ${nombreMovimiento} ${movimientoData.Monto}`,
                usuario.id, "25.55.61.33", new Date());
            alert("Error al insertar movimiento: " + error.message);
        })
        .finally(() => {
            document.getElementById('accionInsertarMovimiento').disabled = false;
            document.getElementById('regresarInsertarMovVista').disabled = false;
        });
}

function mostrarTiposMovimiento() {
    fetch('https://localhost:5001/api/BDController/MostrarTiposMovimientosControlador')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar tipos');
            return response.json();
        })
        .then(data => {
            tiposMovimiento = data;
            const select = document.getElementById("movimiento");
            select.innerHTML = '<option value="" selected disabled>Seleccione...</option>';

            data.forEach(tipo => {
                const option = document.createElement("option");
                option.value = tipo.id; // Usar id como valor
                option.textContent = tipo.nombre;
                // Opcional: mostrar icono según tipoAccion
                option.textContent += tipo.tipoAccion ? " (+) " : " (-) ";
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error al cargar tipos de movimiento");
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
        .catch(error => console.error("Error al registrar en bitácora:", error));
};

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

