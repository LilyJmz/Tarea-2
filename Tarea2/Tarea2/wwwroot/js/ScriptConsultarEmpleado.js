var empleado = JSON.parse(localStorage.getItem('empleado'));
console.log('empleado: ', empleado);

const tbody = document.querySelector("#datosTabla");
tbody.innerHTML = "";
        const trUno = document.createElement("tr");
        const tdTUno = document.createElement("td");
        tdTUno.textContent = "Valor Documento Identidad";
        trUno.appendChild(tdTUno);
        const tdUno = document.createElement("td");
        tdUno.textContent = empleado.valorDocumentoIdentidad; 
        trUno.appendChild(tdUno);
        tbody.appendChild(trUno);

        const trDos = document.createElement("tr");
        const tdTDos = document.createElement("td");
        tdTDos.textContent = "Nombre";
        trDos.appendChild(tdTDos);
        const tdDos = document.createElement("td");
        tdDos.textContent = empleado.nombre;
        trDos.appendChild(tdDos);
        tbody.appendChild(trDos);

        const trTres = document.createElement("tr");
        const tdTTres = document.createElement("td");
        tdTTres.textContent = "Puesto";
        trTres.appendChild(tdTTres);
        const tdTres = document.createElement("td");
        tdTres.textContent = empleado.puesto;
        trTres.appendChild(tdTres);
        tbody.appendChild(trTres);

        const trCuatro = document.createElement("tr");
        const tdTCuatro = document.createElement("td");
        tdTCuatro.textContent = "Saldo Vacaciones";
        trCuatro.appendChild(tdTCuatro);
        const tdCuatro = document.createElement("td");
        tdCuatro.textContent = empleado.saldoVacaciones;
        trCuatro.appendChild(tdCuatro);
        tbody.appendChild(trCuatro);

//Si le da click a regresar vuelve a la página inicial
document.addEventListener('DOMContentLoaded', function () {
    try {
        const button = document.getElementById('regresarConsultarVista');
        button.addEventListener('click', function () {
            window.location.href = 'VistaUsuario.html';
        });
    }
    catch {
        return (null);
    }
});