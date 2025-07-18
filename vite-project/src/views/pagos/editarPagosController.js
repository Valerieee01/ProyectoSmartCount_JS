import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes.js"; // Asegúrate de que sea getEncabezados
import { error, success } from "../../helpers/alerts.js";
import { forceReloadAllPagos } from "./mostrarTabla.js";

/**
 * Inicializa el manejo del formulario de edición de pagos.
 * @param {object} a - Objeto que contiene el ID del pago (ej. { id: pagoId }).
 */
export const editarPagosController = (a) => { // 'a' debería contener el ID del pago: { id: pagoId }
    console.log(`[editarPagosController] Inicializando controlador de edición para pago ID: ${a.id}`);

    // 1. Obtener referencias a los elementos del DOM.
    const form = document.querySelector('#pagoForm');
    const id_cliente_select = document.querySelector('#id_cliente');
    const id_mantenimiento_select = document.querySelector('#id_mantenimiento');
    const valor_trabajo_input = document.querySelector('#valor_trabajo');
    const valor_pagado_input = document.querySelector('#valor_pagado');
    const fecha_facturacion_input = document.querySelector('#fecha_facturacion');
    const dias_plazo_input = document.querySelector('#dias_plazo');
    const estado_pago_select = document.querySelector('#estado_pago');
    const detalle_textarea = document.querySelector('#detalle');

    // 2. Validar que los elementos esenciales del formulario existen.
    if (!form || !id_cliente_select || !id_mantenimiento_select || !valor_trabajo_input || !fecha_facturacion_input) {
        console.error("[editarPagosController] Error: Elementos esenciales del formulario de pago no encontrados en el DOM.");
        error({ message: "No se pudo inicializar el formulario de edición. Faltan elementos HTML." });
        return;
    }

    // --- 3. Declaración del método 'enviar' para manejar el submit del formulario ---
    const enviar = async (e) => {
        e.preventDefault(); // Prevenir el envío por defecto del formulario.
        console.log(`[editarPagosController] Formulario de edición enviado para pago ID: ${a.id}`);

        // --- ¡CORRECCIÓN CLAVE! Parsear valores a números ANTES de la validación y envío ---
        const valorTrabajoNum = parseFloat(valor_trabajo_input.value);
        const valorPagadoNum = parseFloat(valor_pagado_input.value);
        const diasPlazoNum = parseInt(dias_plazo_input.value);

        // --- Validaciones de Frontend (antes de enviar al backend) ---
        // 1. Validar que los campos numéricos son realmente números
        if (isNaN(valorTrabajoNum) || valorTrabajoNum <= 0) {
            error({ title: 'Error de Validación', text: "El 'Valor del Trabajo' debe ser un número positivo." });
            Swal.fire({
                title: '¡ERROR!',
                text: "El 'Valor del Trabajo' debe ser un número positivo.",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }
        if (isNaN(valorPagadoNum) || valorPagadoNum < 0) {
            error({ title: 'Error de Validación', text: "El 'Valor Pagado' debe ser un número no negativo." });
             Swal.fire({
                title: '¡ERROR!',
                text: "El 'Valor Pagado' debe ser un número no negativo.",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }
        if (isNaN(diasPlazoNum) || diasPlazoNum < 0) {
            error({ title: 'Error de Validación', text: "Los 'Días de Plazo' deben ser un número no negativo." });
              Swal.fire({
                title: '¡ERROR!',
                text: "Los 'Días de Plazo' deben ser un número no negativo.",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        // 2. Validar la condición específica: valor pagado no supera valor trabajo
        if (valorPagadoNum > valorTrabajoNum) {
            Swal.fire({
                title: '¡ERROR!',
                text: "El valor pagado no puede superar el valor del trabajo.",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return; // Detiene el envío si la validación falla
        }

        // 3. Construir el objeto de datos a enviar
        const data = {
            id_cliente: parseInt(id_cliente_select.value), // Asegura que sea número
            id_mantenimiento: parseInt(id_mantenimiento_select.value), // Asegura que sea número
            valor_trabajo: valorTrabajoNum, // Usar el valor parseado
            valor_pagado: valorPagadoNum,   // Usar el valor parseado
            fecha_facturacion: fecha_facturacion_input.value, // Formato YYYY-MM-DD
            dias_plazo: diasPlazoNum,       // Usar el valor parseado
            estado_pago: estado_pago_select.value,
            detalle: detalle_textarea.value
        };


        try {
            // 4. Realizar la petición PATCH a la API
            const request = await fetch(`http://localhost:3000/api/pagos/${a.id}`, {
                method: 'PATCH', // Usamos PATCH para actualización parcial
                body: JSON.stringify(data),
                headers: encabezados, // Asegúrate de que getEncabezados() devuelve Content-Type y Authorization
            });
            const response = await request.json();

            // 5. Manejar la respuesta del servidor
            if (response.success) {
                form.reset(); // Opcional: limpiar el formulario después de editar
                success(response);

                // Forzar recarga de la tabla de pagos después de una edición exitosa
                await forceReloadAllPagos();

                location.hash = "#pagos"; // Redirige a la vista de la tabla de pagos
            } else {
                console.error("[editarPagosController] Error de la API:", response);
                error(response);
            }
        } catch (error) {
            console.error("[editarPagosController] Error al enviar el formulario (fetch):", error);
            error({ title: 'Error de Conexión', text: `No se pudo conectar con el servidor: ${error.message}` });
        }
    };

    // --- 4. Adjuntar el event listener al formulario ---
    // Esto asegura que 'enviar' se llama SOLO cuando el formulario se envía.
    form.addEventListener('submit', enviar);
};