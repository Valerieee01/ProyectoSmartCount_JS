// src/controllers/empleadoController.js

import {
    agregarEventosBotones,
    cargar_tabla,
    cargar_tabla_con_filtros,
    setCurrentPage
} from "./mostrarTabla.js";

export const mantenimientoController = async () => {
    const tabla = document.querySelector("#tableMantenimientos");

    if (!tabla) {
        console.error("[mantenimientoController] Error: No se encontró el elemento HTML con ID 'tableMantenimientos'.");
        return;
    }

    try {
        await cargar_tabla(tabla);
        await agregarEventosBotones();

        const numeroEquipoInput = document.querySelector("#numero_equipo_buscar"); 
        const tipoMantenimientoSelect = document.querySelector("#tipo_mantenimiento_buscar"); 

        const buscarBtn = document.querySelector(".buscarTabla");

        if (buscarBtn) {
            buscarBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                const nombreBusqueda = numeroEquipoInput.value.trim();
                const estadoBusqueda = tipoMantenimientoSelect.value;

                await applyMantenimientosFilters(tabla, nombreBusqueda, estadoBusqueda);
            });
        }

        const crearMantenimientodoBtn = document.querySelector('a[href="#crearMantenimiento"]');

        crearMantenimientodoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            location.hash = '#crearMantenimiento';
        });


    } catch (error) {
        console.log(error);

        console.error("Error en empleadoController durante la inicialización:", error);
    }
};

const applyMantenimientosFilters = async (tabla, nombre, estado) => {

    setCurrentPage(1);

    await cargar_tabla_con_filtros(tabla, nombre, estado);
};