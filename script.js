// ============================================
// SISTEMA DE MATRÍCULA
// CTP ROSARIO DE NARANJO
// Desarrollado por Jeffry Fuentes
// ============================================


// Obtener matrículas guardadas
function obtenerMatriculas() {

    const datos = localStorage.getItem("matriculasCTP");

    if (!datos) {
        return [];
    }

    return JSON.parse(datos);
}


// Guardar matrículas
function guardarMatriculas(matriculas) {

    localStorage.setItem(
        "matriculasCTP",
        JSON.stringify(matriculas)
    );
}


// ============================================
// REGISTRAR MATRÍCULA
// ============================================

const formulario = document.getElementById(
    "formularioMatricula"
);

if (formulario) {

    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const nombre =
                document.getElementById("nombre").value.trim();

            const cedula =
                document.getElementById("cedula").value.trim();

            const fechaNacimiento =
                document.getElementById("fechaNacimiento").value;

            const especialidad =
                document.getElementById("especialidad").value;


            // Validar información
            if (
                !nombre ||
                !cedula ||
                !fechaNacimiento ||
                !especialidad
            ) {

                alert(
                    "Por favor complete todos los campos."
                );

                return;
            }


            let matriculas = obtenerMatriculas();


            // Evitar cédulas duplicadas
            const existe = matriculas.some(
                function (matricula) {

                    return matricula.cedula === cedula;

                }
            );


            if (existe) {

                alert(
                    "Ya existe una matrícula registrada con esta cédula."
                );

                return;
            }


            // Crear matrícula
            const nuevaMatricula = {

                id: Date.now(),

                nombre: nombre,

                cedula: cedula,

                fechaNacimiento: fechaNacimiento,

                especialidad: especialidad

            };


            matriculas.push(nuevaMatricula);


            guardarMatriculas(matriculas);


            alert(
                "¡Matrícula registrada correctamente!"
            );


            // Limpiar formulario
            formulario.reset();


            // Actualizar tabla
            mostrarMatriculas();


            // Ir a registros
            document
                .getElementById("registros")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );
}


// ============================================
// MOSTRAR MATRÍCULAS
// ============================================

function mostrarMatriculas() {

    const tabla =
        document.getElementById("tablaMatriculas");

    if (!tabla) {
        return;
    }


    const matriculas = obtenerMatriculas();


    tabla.innerHTML = "";


    if (matriculas.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center; padding:30px;">
                    No hay matrículas registradas.
                </td>
            </tr>
        `;

        return;
    }


    matriculas.forEach(
        function (matricula) {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>
                    ${escaparHTML(matricula.nombre)}
                </td>

                <td>
                    ${escaparHTML(matricula.cedula)}
                </td>

                <td>
                    ${formatearFecha(
                        matricula.fechaNacimiento
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        matricula.especialidad
                    )}
                </td>

                <td>

                    <button
                        class="boton-eliminar"
                        onclick="eliminarMatricula(${matricula.id})">

                        Eliminar

                    </button>

                </td>
            `;


            tabla.appendChild(fila);

        }
    );
}


// ============================================
// CONSULTAR MATRÍCULA
// ============================================

function consultarMatricula() {

    const campo =
        document.getElementById("cedulaConsulta");

    const resultado =
        document.getElementById("resultadoConsulta");


    const cedula =
        campo.value.trim();


    resultado.classList.remove(
        "oculto",
        "exito",
        "error"
    );


    if (!cedula) {

        resultado.classList.add("error");

        resultado.innerHTML = `

            <h3>⚠️ Falta información</h3>

            <p>
                Introduzca un número de cédula
                para realizar la búsqueda.
            </p>

        `;

        return;
    }


    const matriculas =
        obtenerMatriculas();


    const matricula =
        matriculas.find(
            function (registro) {

                return registro.cedula === cedula;

            }
        );


    if (!matricula) {

        resultado.classList.add("error");

        resultado.innerHTML = `

            <h3>❌ Matrícula no encontrada</h3>

            <p>
                No se encontró una matrícula registrada
                con la cédula:
                <strong>
                    ${escaparHTML(cedula)}
                </strong>
            </p>

        `;

        return;
    }


    resultado.classList.add("exito");


    resultado.innerHTML = `

        <h3>✅ Matrícula encontrada</h3>

        <p>
            <strong>Nombre:</strong>
            ${escaparHTML(matricula.nombre)}
        </p>

        <p>
            <strong>Cédula:</strong>
            ${escaparHTML(matricula.cedula)}
        </p>

        <p>
            <strong>Fecha de nacimiento:</strong>
            ${formatearFecha(
                matricula.fechaNacimiento
            )}
        </p>

        <p>
            <strong>Especialidad:</strong>
            ${escaparHTML(
                matricula.especialidad
            )}
        </p>

    `;
}


// ============================================
// ELIMINAR MATRÍCULA
// ============================================

function eliminarMatricula(id) {

    const confirmar =
        confirm(
            "¿Está seguro de que desea eliminar esta matrícula?"
        );


    if (!confirmar) {
        return;
    }


    let matriculas =
        obtenerMatriculas();


    matriculas =
        matriculas.filter(
            function (matricula) {

                return matricula.id !== id;

            }
        );


    guardarMatriculas(matriculas);


    mostrarMatriculas();


    alert(
        "La matrícula fue eliminada."
    );
}


// ============================================
// FORMATO DE FECHA
// ============================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "";
    }


    const partes =
        fecha.split("-");


    if (partes.length !== 3) {
        return fecha;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ============================================
// SEGURIDAD BÁSICA PARA MOSTRAR TEXTO
// ============================================

function escaparHTML(texto) {

    const elemento =
        document.createElement("div");

    elemento.textContent = texto;

    return elemento.innerHTML;
}


// ============================================
// DATOS DE DEMOSTRACIÓN
// ============================================

function crearDatosDemo() {

    const matriculas =
        obtenerMatriculas();


    // Solo crear ejemplos si no existen registros
    if (matriculas.length > 0) {
        return;
    }


    const datosDemo = [

        {
            id: 1001,
            nombre: "María Fernanda Rodríguez",
            cedula: "1-2345-6789",
            fechaNacimiento: "2009-05-14",
            especialidad: "Informática Empresarial"
        },

        {
            id: 1002,
            nombre: "Carlos Andrés Vargas",
            cedula: "2-3456-7890",
            fechaNacimiento: "2008-11-22",
            especialidad: "Contabilidad"
        }

    ];


    guardarMatriculas(datosDemo);
}


// ============================================
// INICIAR SISTEMA
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        crearDatosDemo();

        mostrarMatriculas();

    }
);
