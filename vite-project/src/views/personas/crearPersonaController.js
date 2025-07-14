// src/controllers/crearPersonaController.js

import { encabezados } from "../../helpers/solicitudes"; // Asegúrate de que esta ruta sea correcta
import { error, success } from "../../helpers/alerts"; // Asume que tienes estas funciones
import { forceReloadAllPeople } from "./mostrarTabla";

export const crearPersonaController = () => {
    // Obtener la referencia al formulario por su ID
    const form = document.querySelector('#personaForm');

    // --- ¡IMPORTANTE! Validar que el formulario existe antes de continuar ---
    if (!form) {
        console.error("Error: Formulario '#personaForm' no encontrado en el DOM.");
        // Considera mostrar un error en la UI si el formulario no está presente
        return;
    }

    // Obtener referencias a los campos del formulario.
    // Usar form.querySelector(...) asegura que solo buscas dentro del formulario correcto.
    const nombre_completo_razon_social = form.querySelector('#nombre_completo_razon_social');
    const id_tipo_identificacion_select = form.querySelector('#id_tipo_identificacion');
    const numero_identificacion = form.querySelector('#numero_identificacion');
    const correo = form.querySelector('#correo');
    const telefono = form.querySelector('#telefono');
    const direccion = form.querySelector('#direccion');
    const id_ciudad_select = form.querySelector('#id_ciudad');
    const estado_select = form.querySelector('#estado');

    const enviar = async (e) => {
        e.preventDefault(); // Previene la recarga de la página.

        // --- Paso 1: Validar los campos requeridos en el frontend ---
        // Esto previene que envíes datos nulos a tu backend.
        if (!nombre_completo_razon_social.value || nombre_completo_razon_social.value.trim() === '') {
            error({ message: "El nombre completo es obligatorio." });
            return;
        }
        if (id_tipo_identificacion_select.value === '') {
            error({ message: "El tipo de identificación es obligatorio." });
            return;
        }
        if (numero_identificacion.value.trim() === '') {
            error({ message: "El número de identificación es obligatorio." });
            return;
        }
        if (correo.value.trim() === '' || !correo.value.includes('@')) {
            error({ message: "El correo electrónico es obligatorio y debe ser válido." });
            return;
        }
        // ... (Añade validaciones para los demás campos requeridos si es necesario)
        if (id_ciudad_select.value === '') {
            error({ message: "La ciudad es obligatoria." });
            return;
        }

        // --- Paso 2: Construir el objeto de datos a enviar ---
        // Convertir los valores de los selects a números o asegurar que no sean nulos.
        const data = {
            nombre_completo_razon_social: nombre_completo_razon_social.value,
            id_tipo_identificacion: parseInt(id_tipo_identificacion_select.value),
            numero_identificacion: numero_identificacion.value,
            correo: correo.value,
            telefono: telefono.value,
            direccion: direccion.value,
            id_ciudad: parseInt(id_ciudad_select.value),
            estado: estado_select.value
        };

        // --- ¡Log de depuración crucial! ---
        console.log("Datos a enviar para crear persona:", data);

        try {
            // --- Paso 3: Realizar la petición fetch ---
            const request = await fetch('http://localhost:3000/api/personas', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: encabezados
            });

            const response = await request.json();

            // --- Paso 4: Manejar la respuesta del servidor ---
            if (response.success) {
                form.reset();
                success(response);
                forceReloadAllPeople()
                location.hash = "#personas";
            } else {
                console.error("Error de la API:", response);
                error(response);
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            error({ message: "No se pudo conectar al servidor o hubo un error inesperado." });
        }
    };

    // --- Paso 5: Adjuntar el event listener al formulario ---
    form.addEventListener('submit', enviar);
};