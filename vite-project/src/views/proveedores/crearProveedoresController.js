// src/controllers/crearClienteController.js

import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes.js";
import { cargar_tabla, forceReloadAllProveedores } from "./mostrarTabla.js";
import listarPersonas from "../../casos_de_uso/Personas/listarPersonas.js";
import { error, success } from "../../helpers/alerts.js";

export const initCrearProveedoresForm = async () => {

    const form = document.querySelector('#proveedoresForm');
    const selectPersonaExistente = document.getElementById('id_persona_existente');

    if (!form) {
        console.error("[initCreaProveedoresForm] Error: Formulario '#proveedoresForm' no encontrado en el DOM.");
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
                console.log("[initCreaProveedoresForm] Select 'id_persona_existente' cargado con", personas.length, "personas.");
            } else {
                console.log("[initCreaProveedoresForm] No se encontraron personas para cargar en el select.");
            }
        } catch (error) {
            console.error("[initCreaProveedoresForm] Error al cargar personas para el select:", error);
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Error al cargar personas";
            selectPersonaExistente.appendChild(option);
            selectPersonaExistente.disabled = true;
        }
    }

    const enviar = async (e) => {
        e.preventDefault();

          const data = {
            id_proveedor: selectPersonaExistente.value
        }


        try {
            const request = await fetch('http://localhost:3000/api/proveedores', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: encabezados
            });
            const response = await request.json();

            // --- Paso 4: Manejar la respuesta del servidor ---
            if (response.success) {
                form.reset();
                success(response);
                forceReloadAllProveedores()
                location.hash = "#proveedores";
            } else {
                console.error("Error de la API:", response);
                error(response);
            }
        } catch (error) {
            console.error("[initCreaProveedoresForm] Error al enviar el formulario (fetch):", error);
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