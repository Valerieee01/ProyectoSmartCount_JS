// src/controllers/initCrearPagosForm.js

import Swal from "sweetalert2";
import listarClientes from "../../casos_de_uso/Clientes/listarClientes.js";
import listarMantenimientos from "../../casos_de_uso/Mantenimientos/listarMantenimientos.js";
import { forceReloadAllPagos } from "./mostrarTabla.js"; // Asegúrate de que esta ruta sea correcta
import { encabezados } from "../../helpers/solicitudes.js";
import { error, success } from "../../helpers/alerts.js";

/**
 * Inicializa el manejo del formulario de creación de pagos.
 */
export const initCrearPagosForm = async () => {
    console.log("[CrearPagos] Inicializando formulario de creación de pagos...");

    // 1. Obtener referencias a los elementos del DOM.
    const form = document.querySelector('#pagoForm');
    const id_cliente_select = document.querySelector('#id_cliente');
    const id_mantenimiento_select = document.querySelector('#id_mantenimiento');
    const valor_trabajo_input = document.querySelector('#valor_trabajo'); // Renombrado a _input
    const valor_pagado_input = document.querySelector('#valor_pagado');   // Renombrado a _input
    const fecha_facturacion_input = document.querySelector('#fecha_facturacion'); // Renombrado a _input
    const dias_plazo_input = document.querySelector('#dias_plazo');       // Renombrado a _input
    const estado_pago_select = document.querySelector('#estado_pago');    // Renombrado a _select
    const detalle_textarea = document.querySelector('#detalle');          // Renombrado a _textarea

    // 2. Validar que los elementos esenciales del formulario existen.
    if (!form || !id_cliente_select || !id_mantenimiento_select || !valor_trabajo_input || !fecha_facturacion_input) {
        console.error("[CrearPagos] Error: Elementos esenciales del formulario de pago no encontrados en el DOM.");
        error({ message: "No se pudo inicializar el formulario de creación. Faltan elementos HTML." });
        return;
    }

    // 3. Cargar opciones para los selects (Clientes y Mantenimientos) en paralelo.
    // Esto asegura que los selects estén llenos antes de que el usuario interactúe.
    try {
        await Promise.all([
            cargarOpcionesClientes(id_cliente_select),
            cargarOpcionesMantenimientos(id_mantenimiento_select)
        ]);
    } catch (err) {
        console.error("[CrearPagos] Error al cargar opciones de selects:", err);
        error({ message: "Error al cargar las listas de clientes o mantenimientos." });
        // Deshabilitar el formulario si no se pueden cargar las opciones críticas
        form.querySelector('button[type="submit"]').disabled = true;
    }


    // 4. Declaración del método 'enviar' para manejar el submit del formulario.
    const enviar = async (e) => {
        e.preventDefault(); // Prevenir el envío por defecto del formulario.
        console.log("[CrearPagos] Formulario de creación enviado.");

        // --- Paso 1: Obtener y parsear valores de los campos ---
        const valorTrabajoNum = parseFloat(valor_trabajo_input.value);
        const valorPagadoNum = parseFloat(valor_pagado_input.value);
        const diasPlazoNum = parseInt(dias_plazo_input.value);

        // --- Paso 2: Validaciones de Frontend (antes de enviar al backend) ---
        // Validar que los selects requeridos tengan una opción seleccionada (no la vacía)
        if (id_cliente_select.value === "" || id_mantenimiento_select.value === "") {
            Swal.fire({
                    title: '¡ERROR!',
                    text: "Por favor, seleccione un cliente y un mantenimiento.",
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
            return; // Detiene el envío
        }

        // Validar que los campos numéricos son realmente números y válidos
        if (isNaN(valorTrabajoNum) || valorTrabajoNum <= 0) {
             Swal.fire({
                    title: '¡ERROR!',
                    text: "El 'Valor del Trabajo' debe ser un número positivo.",
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
            return;
        }
        if (isNaN(valorPagadoNum) || valorPagadoNum < 0) {
            Swal.fire({
                    title: '¡ERROR!',
                    text: "El 'Valor Pagado' debe ser un número no negativo.",
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
            return;
        }
        if (isNaN(diasPlazoNum) || diasPlazoNum < 0) {
             Swal.fire({
                    title: '¡ERROR!',
                    text: "Los 'Días de Plazo' deben ser un número no negativo.",
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
            return;
        }

        // Validar la condición específica: valor pagado no supera valor trabajo
        if (valorPagadoNum > valorTrabajoNum) {
            Swal.fire({
                title: '¡ERROR!',
                text: "El valor pagado no puede superar el valor del trabajo.",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return; // Detiene el envío si la validación falla
        }

        // --- Paso 3: Construir el objeto de datos a enviar ---
        const data = {
            id_cliente: parseInt(id_cliente_select.value),
            id_mantenimiento: parseInt(id_mantenimiento_select.value),
            valor_trabajo: valorTrabajoNum,
            valor_pagado: valorPagadoNum,
            fecha_facturacion: fecha_facturacion_input.value, 
            dias_plazo: diasPlazoNum,
            estado_pago: estado_pago_select.value,
            detalle: detalle_textarea.value 
        };

        // Log de depuración: ver los datos finales antes del fetch
        console.log("[CrearPagos] Datos a enviar para crear pago:", data);

        try {
            // --- Paso 4: Realizar la petición POST a la API ---
            const request = await fetch('http://localhost:3000/api/pagos', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: encabezados // Asegúrate de que encabezados() devuelva Content-Type y Authorization
            });
            const response = await request.json();

            // --- Paso 5: Manejar la respuesta del servidor ---
            if (response.success) {
                form.reset(); // Limpia el formulario
                success(response); // Muestra alerta de éxito
                
                // Forzar recarga de la tabla de pagos después de una creación exitosa
                await forceReloadAllPagos(); // <-- ¡Asegúrate de que esta función exista y sea await!
                
                location.hash = "#pagos"; // Redirige a la vista de la tabla de pagos
            } else {
                console.error("[CrearPagos] Error de la API:", response);
                error(response); // Muestra alerta de error de la API
            }
        } catch (error) {
            console.error("[CrearPagos] Error al enviar el formulario (fetch):", error);
        }
    };

    // 5. Adjuntar el event listener al formulario.
    form.addEventListener('submit', enviar);
};

/**
 * Carga las opciones para el select de Clientes.
 * @param {HTMLElement} selectElement - El elemento select para clientes.
 */
const cargarOpcionesClientes = async (selectElement) => {
    try {
        const response = await listarClientes(); 
        const clientes = response.data;

        if (clientes && clientes.length > 0) {
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id_persona; 
                option.textContent = cliente.nombre_completo_razon_social; 
                selectElement.appendChild(option);
            });
            console.log("[CrearPagos] Select de Clientes cargado con", clientes.length, "clientes.");
        } else {
            console.log("[CrearPagos] No se encontraron clientes para cargar en el select.");
        }
    } catch (error) {
        console.error("[CrearPagos] Error al cargar opciones de clientes:", error);
        error({ message: "Error al cargar la lista de clientes." });
        selectElement.disabled = true;
    }
};

/**
 * Carga las opciones para el select de Mantenimientos.
 * @param {HTMLElement} selectElement - El elemento select para mantenimientos.
 */
const cargarOpcionesMantenimientos = async (selectElement) => {
    try {
        const response = await listarMantenimientos(); 
        const mantenimientos = response.data;

        if (mantenimientos && mantenimientos.length > 0) {
            mantenimientos.forEach(mantenimiento => {
                const option = document.createElement('option');
                option.value = mantenimiento.id_mantenimiento;
                // Muestra una descripción del mantenimiento o el ID del equipo asociado
                option.textContent = `Mantenimiento ID: ${mantenimiento.id_mantenimiento} - Equipo: ${mantenimiento.numero_equipo || 'N/A'}`; 
                selectElement.appendChild(option);
            });
            console.log("[CrearPagos] Select de Mantenimientos cargado con", mantenimientos.length, "mantenimientos.");
        } else {
            console.log("[CrearPagos] No se encontraron mantenimientos para cargar en el select.");
        }
    } catch (error) {
        console.error("[CrearPagos] Error al cargar opciones de mantenimientos:", error);
        error({ message: "Error al cargar la lista de mantenimientos." });
        selectElement.disabled = true;
    }
};