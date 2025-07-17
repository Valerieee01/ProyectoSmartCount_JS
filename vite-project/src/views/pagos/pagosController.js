// src/controllers/empleadoController.js

import {
    agregarEventosBotones,
    cargar_tabla,
    cargar_tabla_con_filtros,
    setCurrentPage
} from "./mostrarTabla.js";

export const pagosController = async () => {
    const tabla = document.querySelector("#tablePagos");

    if (!tabla) {
        console.error("[pagosController] Error: No se encontró el elemento HTML con ID 'tablePagos'.");
        return;
    }

    try {
        await cargar_tabla(tabla);
        await agregarEventosBotones();

        const nombreInput = document.querySelector("#nombreCliente");
        const estadoSelect = document.querySelector("#estadoPago");
        const buscarBtn = document.querySelector(".buscarTabla");

        if (buscarBtn) {
            buscarBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                const nombreBusqueda = nombreInput.value.trim();
                const estadoBusqueda = estadoSelect.value;

                await applyPagosFilters(tabla, nombreBusqueda, estadoBusqueda);
            });
        }

        const crearPagoBtn = document.querySelector('a[href="#crearPagos"]');

        crearPagoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            location.hash = '#crearPagos';
        });


    } catch (error) {
        console.log(error);
        
        console.error("Error en empleadoController durante la inicialización:", error);
    }
};

const applyPagosFilters = async (tabla, nombre, estado) => {

    setCurrentPage(1);

    await cargar_tabla_con_filtros(tabla, nombre, estado);
};