
import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes.js";
import { error, success } from "../../helpers/alerts.js";
import listarClientes from "../../casos_de_uso/Clientes/listarClientes.js";
import listarMantenimientos from "../../casos_de_uso/Mantenimientos/listarMantenimientos.js";
import { editarPagosController } from "./editarPagosController.js";


export const initEditarPagosForm = async (a) => {

    const form = document.querySelector('#pagoForm');
    const id_cliente_select = document.querySelector('#id_cliente')
    const id_mantenimiento_select = document.querySelector('#id_mantenimiento')
    const valor_trabajo = document.querySelector('#valor_trabajo')
    const valor_pagado = document.querySelector('#valor_pagado')
    const fecha_facturacion = document.querySelector('#fecha_facturacion')
    const dias_plazo = document.querySelector('#dias_plazo')
    const estado_pago = document.querySelector('#estado_pago')
    const detalle = document.querySelector('#detalle')


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

    // Solicitud a la API
    const request = await fetch(`http://localhost:3000/api/pagos/${a.id}`, {
        method: 'GET',
        headers: encabezados
    });
    const { data } = await request.json();


    const dateObj = new Date(data.fecha_facturacion);
    const formattedDate = dateObj.toISOString().split('T')[0]; // Formato YYYY-MM-DD


    //Llenando los campos
    id_cliente_select.value = data.id_cliente;
    id_mantenimiento_select.value = data.id_mantenimiento;
    valor_trabajo.value = data.valor_trabajo;
    valor_pagado.value = data.valor_pagado;
    fecha_facturacion.value = formattedDate;
    dias_plazo.value = data.dias_plazo;
    estado_pago.value = data.estado_pago;
    detalle.value = data.detalle



    editarPagosController(a)
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