// src/controllers/crearClienteController.js

import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes.js";
import { cargar_tabla, forceReloadAllEmpleados } from "./mostrarTabla.js";
import listarPersonas from "../../casos_de_uso/Personas/listarPersonas.js";
import { error, success } from "../../helpers/alerts.js";

export const initCrearEmpleadoForm = async () => {

    const form = document.querySelector('#empleadoForm');
    const selectPersonaExistente = document.getElementById('id_persona_existente');

    if (!form) {
        console.error("[initCreaEmpleadoeForm] Error: Formulario '#empleadoForm' no encontrado en el DOM.");
        return;
    }

    if (selectPersonaExistente) {
        try {
            const response = await listarPersonas();
            const personas = response.data;

            if (personas && personas.length > 0) {
                personas.forEach(persona => {
                    const option = document.createElement('option');
                    option.value = persona.id_persona;
                    option.textContent = persona.nombre_completo_razon_social;
                    selectPersonaExistente.appendChild(option);
                });
                console.log("[initCreaEmpleadoeForm] Select 'id_persona_existente' cargado con", personas.length, "personas.");
            } else {
                console.log("[initCreaEmpleadoeForm] No se encontraron personas para cargar en el select.");
            }
        } catch (error) {
            console.error("[initCreaEmpleadoeForm] Error al cargar personas para el select:", error);
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Error al cargar Empleados";
            selectPersonaExistente.appendChild(option);
            selectPersonaExistente.disabled = true;
        }
    }

    const enviar = async (e) => {
        e.preventDefault();
        const data = {
            id_empleado: selectPersonaExistente.value
        }

        try {
            const request = await fetch('http://localhost:3000/api/empleados', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: encabezados
            });
            const response = await request.json();

            // --- Paso 4: Manejar la respuesta del servidor ---
            if (response.success) {
                form.reset();
                success(response);
                forceReloadAllEmpleados()
                location.hash = "#empleado";
            } else {
                console.error("Error de la API:", response);
                error(response);
            }
        } catch (error) {
            console.error("[initCreaEmpleadoeForm] Error al enviar el formulario (fetch):", error);
            Swal.fire({
                title: '¡Error!',
                text: `No se pudo conectar con el servidor: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    form.addEventListener('submit', enviar);
};