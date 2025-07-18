// src/controllers/proveedoresController.js

import {
    agregarEventosBotones,
    cargar_tabla,
    cargar_tabla_con_filtros,
    setCurrentPage
} from "./mostrarTabla.js";

export const proveedoresController = async () => {
    const tabla = document.querySelector("#tableProveedores");

    if (!tabla) {
        console.error("[proveedoresController] Error: No se encontró el elemento HTML con ID 'tableEmpleados'.");
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
                console.log("[proveedoresController] Botón 'Buscar' clickeado. Aplicando filtros...");

                const nombreBusqueda = nombreInput.value.trim();
                const estadoBusqueda = estadoSelect.value;

                // --- NUEVO LOG: Valores capturados del input y select ---
                console.log(`[proveedoresController] Valor capturado del input Nombre: '${nombreBusqueda}'`);
                console.log(`[proveedoresController] Valor capturado del select Estado: '${estadoBusqueda}'`);

                await applyProveedoresFilters(tabla, nombreBusqueda, estadoBusqueda);
            });
        }

        const crearEmpleadoBtn = document.querySelector('a[href="#crearProveedores"]');

        crearEmpleadoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            location.hash = '#crearProveedores';
        });


    } catch (error) {        
        console.error("Error en proveedoresController durante la inicialización:", error);
    }
};

const applyProveedoresFilters = async (tabla, nombre, estado) => {
    // --- NUEVO LOG: Valores que llegan a applyProveedoresFilters ---
    console.log(`[applyProveedoresFilters] Aplicando filtros - Nombre: '${nombre}', Estado: '${estado}'`);

    setCurrentPage(1);

    await cargar_tabla_con_filtros(tabla, nombre, estado);
};