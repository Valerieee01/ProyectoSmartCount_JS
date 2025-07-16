// src/controllers/empleadoController.js

import {
    agregarEventosBotones,
    cargar_tabla,
    cargar_tabla_con_filtros,
    setCurrentPage
} from "./mostrarTabla.js";

export const empleadoController = async () => {
    const tabla = document.querySelector("#tableEmpleados");

    if (!tabla) {
        console.error("[empleadoController] Error: No se encontró el elemento HTML con ID 'tableEmpleados'.");
        return;
    }

    try {
        await cargar_tabla(tabla);
        await agregarEventosBotones();

        const nombreInput = document.querySelector("#nombre");
        const estadoSelect = document.querySelector("#estado");
        const buscarBtn = document.querySelector(".buscarTabla");

        if (buscarBtn) {
            buscarBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                const nombreBusqueda = nombreInput.value.trim();
                const estadoBusqueda = estadoSelect.value;

                await applyEmpleadosFilters(tabla, nombreBusqueda, estadoBusqueda);
            });
        }

        const crearEmpleadoBtn = document.querySelector('a[href="#crearEmpleado"]');

        crearEmpleadoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            location.hash = '#crearEmpleado';
        });


    } catch (error) {
        console.log(error);
        
        console.error("Error en empleadoController durante la inicialización:", error);
    }
};

const applyEmpleadosFilters = async (tabla, nombre, estado) => {

    setCurrentPage(1);

    await cargar_tabla_con_filtros(tabla, nombre, estado);
};