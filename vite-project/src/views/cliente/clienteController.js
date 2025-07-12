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
                console.log("[clienteController] Botón 'Buscar' clickeado. Aplicando filtros...");

                const nombreBusqueda = nombreInput.value.trim();
                const estadoBusqueda = estadoSelect.value;

                // --- NUEVO LOG: Valores capturados del input y select ---
                console.log(`[clienteController] Valor capturado del input Nombre: '${nombreBusqueda}'`);
                console.log(`[clienteController] Valor capturado del select Estado: '${estadoBusqueda}'`);

                await applyClientFilters(tabla, nombreBusqueda, estadoBusqueda);
            });
        }

        const crearClienteBtn = document.querySelector('a[href="#crearCliente"]');

        crearClienteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("crear cliente clikeado")
            location.hash = '#crearCliente';
        });


    } catch (error) {
        console.error("Error en clienteController durante la inicialización:", error);
    }
};

const applyClientFilters = async (tabla, nombre, estado) => {
    // --- NUEVO LOG: Valores que llegan a applyClientFilters ---
    console.log(`[applyClientFilters] Aplicando filtros - Nombre: '${nombre}', Estado: '${estado}'`);

    setCurrentPage(1);

    await cargar_tabla_con_filtros(tabla, nombre, estado);
};