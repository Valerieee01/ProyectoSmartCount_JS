// src/controllers/clienteController.js

import {
    agregarEventosBotones,
    cargar_tabla,
    cargar_tabla_con_filtros,
    setCurrentPage
} from "./mostrarTabla.js";

export const clienteController = async () => {
    const tabla = document.querySelector("#tableClientes");

    if (!tabla) {
        console.error("[clienteController] Error: No se encontró el elemento HTML con ID 'tableClientes'.");
        return;
    }

    try {
        await cargar_tabla(tabla);
        await agregarEventosBotones();

        const nombreInput = document.getElementById("nombre");
        const estadoSelect = document.getElementById("estado");
        const buscarBtn = document.querySelector(".buscarTabla");

        if (buscarBtn) {
            buscarBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                const nombreBusqueda = nombreInput.value.trim();
                const estadoBusqueda = estadoSelect.value;

                await applyClientFilters(tabla, nombreBusqueda, estadoBusqueda);
            });
        }

        const crearClienteBtn = document.querySelector('a[href="#crearCliente"]');

        crearClienteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            location.hash = '#crearCliente';
        });


    } catch (error) {
        console.error("Error en clienteController durante la inicialización:", error);
    }
};

const applyClientFilters = async (tabla, nombre, estado) => {

    setCurrentPage(1);

    await cargar_tabla_con_filtros(tabla, nombre, estado);
};