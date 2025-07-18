
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


    if (id_cliente_select) {
        try {
            const response = await listarClientes();
            const clientes = response.data;

            if (clientes && clientes.length > 0) {
                clientes.forEach(cliente => {
                    const option = document.createElement('option');
                    option.value = cliente.id_persona;
                    option.textContent = cliente.nombre_completo_razon_social;
                    id_cliente_select.appendChild(option);
                });
            } else {
                console.log("[editarControllerManteenimiento] No se encontraron equipos para cargar en el select.");
            }
        } catch (error) {
            console.error("[editarControllerManteenimiento] Error al cargar equipos para el select:", error);
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Error al cargar Mantenimientos";
            id_cliente_select.appendChild(option);
            id_cliente_select.disabled = true;
        }
    }

    if (id_mantenimiento_select) {
        try {
            const response = await listarMantenimientos();
            const mantenimientos = response.data;

            if (mantenimientos && mantenimientos.length > 0) {
                mantenimientos.forEach(manenimiento => {
                    const option = document.createElement('option');
                    option.value = manenimiento.id_mantenimiento;
                    option.textContent = manenimiento.id_mantenimiento;
                    id_mantenimiento_select.appendChild(option);
                });
            } else {
                console.log("[editarControllerManteenimiento] No se encontraron mantenimientos para cargar en el select.");
            }
        } catch (error) {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Error al cargar mantenimientos";
            id_mantenimiento_select.appendChild(option);
            id_mantenimiento_select.disabled = true;
        }
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