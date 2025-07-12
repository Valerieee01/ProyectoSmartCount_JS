// src/controllers/personasController.js

import {
    agregarEventosBotones,
    cargar_tabla,
    cargar_tabla_con_filtros,
    setCurrentPage
} from "./mostrarTabla.js";

export const personasController = async () => {
    const tabla = document.querySelector("#tablePersonas");

    if (!tabla) {
        console.error("[personasController] Error: No se encontró el elemento HTML con ID 'tableClientes'.");
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
                console.log("[personasController] Botón 'Buscar' clickeado. Aplicando filtros...");

                const nombreBusqueda = nombreInput.value.trim();
                const estadoBusqueda = estadoSelect.value;

                // --- NUEVO LOG: Valores capturados del input y select ---
                console.log(`[personasController] Valor capturado del input Nombre: '${nombreBusqueda}'`);
                console.log(`[personasController] Valor capturado del select Estado: '${estadoBusqueda}'`);

                await applyClientFilters(tabla, nombreBusqueda, estadoBusqueda);
            });
        }

        const crearPeronateBtn = document.querySelector('a[href="#crearPersona"]');

        crearPeronateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("crear cliente clikeado")
            location.hash = '#crearPersona';
        });


    } catch (error) {
        console.error("Error en personasController durante la inicialización:", error);
    }
};

const applyClientFilters = async (tabla, nombre, estado) => {
    // --- NUEVO LOG: Valores que llegan a applyClientFilters ---
    console.log(`[applyClientFilters] Aplicando filtros - Nombre: '${nombre}', Estado: '${estado}'`);

    setCurrentPage(1);

    await cargar_tabla_con_filtros(tabla, nombre, estado);
};