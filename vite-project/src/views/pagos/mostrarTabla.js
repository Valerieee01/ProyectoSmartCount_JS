import eliminar_pagos_por_id from "../../casos_de_uso/Pagos/eliminarPagos.js";
import listarPagos from "../../casos_de_uso/Pagos/listarPagos.js";


// --- Variables para la paginación ---
const ITEMS_PER_PAGE = 3; // Define cuántos pagos mostrar por página
let currentPage = 1;      // Página actual, inicia en la primera
let allPagos = [];      // Almacenará todos los pagos obtenidos de la API


let currentNameFilter = null; // Variable global para persistir el filtro de nombre
let currentStatusFilter = null; // Variable global para persistir el filtro de estado

export const forceReloadAllPagos = async () => {
    allPagos = []; // Vacía la caché de pagos.
    currentPage = 1; // Resetea a la primera página.

    const tabla = document.querySelector("#tablePagos");
    if (tabla) {
        await cargar_tabla(tabla);
    } else {
        console.warn("[mostrarTabla] No se encontró la tabla de personas para recargar.");
    }
};

export const setCurrentPage = (newPage) => {
    currentPage = newPage;
};

export const cargar_tabla = async (tabla) => {
    try {
        if (allPagos.length === 0) {
            const response = await listarPagos();
            allPagos = response.data;
            if (allPagos.length > 0) {
                // --- NUEVO LOG: Estructura de un pago ---
                console.log("[mostrarTabla] Ejemplo de un objeto pago:", allPagos[0]);
                console.log("[mostrarTabla] Propiedad 'nombre_completo_razon_social' del primer pago:", allPagos[0].nombre_completo_razon_social);
                console.log("[mostrarTabla] Propiedad 'estado' del primer pago:", allPagos[0].estado); // <-- ¡VERIFICA ESTE LOG!
            }
        }

        // Al cargar la tabla inicialmente o si se recarga todo, resetea los filtros globales.
        currentNameFilter = null;
        currentStatusFilter = null;
        await cargar_tabla_con_filtros(tabla, null, null); // Llama sin filtros iniciales, que usarán los nulos

    } catch (error) {
        console.error("[mostrarTabla] Error al cargar la tabla de pagos inicialmente (desde API):", error);
        const tBody = tabla.querySelector("tbody");
        const numCols = tabla.querySelectorAll('th').length;
        tBody.innerHTML = `<tr><td colspan="${numCols}" style="text-align: center; padding: 20px; color: red;">
                            Error al cargar los pagos. Inténtalo de nuevo más tarde.</td></tr>`;
    }
};



export const cargar_tabla_con_filtros = async (tabla, nombreFilter = null, estadoFilter = null) => {
    // --- Almacenar/Actualizar los filtros globales ---
    // Si se pasan filtros nuevos, actualiza las variables globales.
    // Si se llama sin filtros (ej. desde el paginador), se usarán los valores globales existentes.
    if (nombreFilter !== null) {
        currentNameFilter = nombreFilter;
    }
    if (estadoFilter !== null) {
        currentStatusFilter = estadoFilter;
    }


    const tBody = tabla.querySelector("tbody");
    tBody.innerHTML = '';

    let pagosToFilter = [...allPagos];

    // --- Lógica de Aplicación de Filtros (Prioridad: Nombre > Estado) ---

    if (currentNameFilter && currentNameFilter.trim() !== '') {
        const lowerCaseNameFilter = currentNameFilter.toLowerCase();
        pagosToFilter = pagosToFilter.filter(pago =>
            pago.nombre_completo_razon_social &&
            typeof pago.nombre_completo_razon_social === 'string' &&
            pago.nombre_completo_razon_social.toLowerCase().includes(lowerCaseNameFilter)
        );
    } else if (currentStatusFilter && currentStatusFilter !== '') { // <-- CONDICIÓN MEJORADA: solo verifica que no sea vacío.
        // También captura la opción por defecto ("Seleccione Estado...") si no se cambia.
        const lowerCaseEstadoFilter = currentStatusFilter.toLowerCase();

        pagosToFilter = pagosToFilter.filter(pago => {

            return pago.estado_pago && // Verifica que la propiedad 'estado_pago' exista
                typeof pago.estado_pago === 'string' && // Asegura que es un string
                pago.estado_pago.toLowerCase() === lowerCaseEstadoFilter; // Compara
        });
        console.log(`[cargar_tabla_con_filtros] Filtrado solo por estado ('${currentStatusFilter}'): ${pagosToFilter.length} resultados.`);
    } else {
        console.log("[cargar_tabla_con_filtros] No se aplicó ningún filtro (nombre y/o estado vacíos o nulos). Mostrando todos los pagos.");
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pagosToDisplay = pagosToFilter.slice(startIndex, endIndex);

    console.log(`[cargar_tabla_con_filtros] pagos a mostrar en esta página (${currentPage}): ${pagosToDisplay.length}`);

    if (pagosToDisplay.length === 0) {
        const numCols = tabla.querySelectorAll('th').length;
        // Corregido: insertRow() para crear la fila y luego insertCell()
        const noResultsRow = tBody.insertRow();
        const noResultsCell = noResultsRow.insertCell(0);
        noResultsCell.colSpan = numCols;
        noResultsCell.textContent = "No se encontraron pagos con los filtros aplicados.";
        noResultsCell.style.textAlign = "center";
        noResultsCell.style.padding = "20px";
        noResultsCell.style.color = "#888";
    } else {
        pagosToDisplay.forEach(pago => {
            crearFila(pago, tabla);
        });
    }
    renderPaginator(tabla, pagosToFilter.length);
};


export const crearFila = ({ id_pago, nombre_completo_razon_social, id_mantenimiento, detalle, valor_trabajo, valor_pagado, valor_mora, estado_pago, dias_plazo, fecha_vencimiento }, tabla) => {
    // ... (Tu código actual de crearFila, sin cambios)
    const tBody = tabla.querySelector("tbody");
    const tr = tBody.insertRow(); // insertRow() sin argumento inserta al final, que es lo común en tablas
    const tdCliente = tr.insertCell(0);
    const tdMantenimiento = tr.insertCell(1);
    const tdDetalle = tr.insertCell(2);
    const tdVtrabajo = tr.insertCell(3);
    const tdVpagado = tr.insertCell(4);
    const tdVmora = tr.insertCell(5);
    const tdestadoPago = tr.insertCell(6);
    const tdDiasPlazo = tr.insertCell(7);
    const tdFechaVencimiento = tr.insertCell(8);
    const tdBotonera = tr.insertCell(9);

    // Agregar el contenido a las celdas
    tdCliente.textContent = nombre_completo_razon_social;
    // Aquí es importante que id_tipo_identificacion muestre el nombre del tipo, no el ID
    // Si id_tipo_identificacion es solo un ID numérico, necesitarías mapearlo a un nombre.
    // Por ahora, lo dejo como está:
    tdMantenimiento.textContent = id_mantenimiento;
    tdDetalle.textContent = detalle;
    tdVtrabajo.textContent = valor_trabajo;
    tdVpagado.textContent = valor_pagado;
    tdVmora.textContent = valor_mora;
    tdestadoPago.textContent = estado_pago;
    tdDiasPlazo.textContent = dias_plazo;
    tdFechaVencimiento.textContent = fecha_vencimiento;

    // Formatear la fecha de mantenimiento
    if (fecha_vencimiento) {
        const dateObj = new Date(fecha_vencimiento);
        if (!isNaN(dateObj.getTime())) {
            tdFechaVencimiento.textContent = dateObj.toLocaleDateString(); // Formato local de fecha
        } else {
            tdFechaVencimiento.textContent = 'Fecha inválida';
        }
    } else {
        tdFechaVencimiento.textContent = 'N/A';
    }


    const div = document.createElement("div");
    const btnEliminar = document.createElement("a");
    const btnEditar = document.createElement("a");

    btnEditar.setAttribute("data-id", id_pago);
    btnEditar.setAttribute("href", `#editarPagos/${id_pago}`); // Cambiado a #editarcliente si es de equipos

    btnEliminar.setAttribute("data-id", id_pago);

    btnEditar.textContent = "Editar";
    btnEliminar.textContent = "Eliminar";

    div.classList.add("botonera");
    btnEditar.classList.add("btn", "btn--small", "editar"); // Corregido 'samall' a 'small'
    btnEliminar.classList.add("btn", "btn--small", "btn--danger", "eliminar"); // Corregido 'samall' a 'small'
    div.append(btnEditar, btnEliminar);
    tdBotonera.append(div);

    tr.setAttribute("id", `pago_${id_pago}`);
};

const renderPaginator = (tabla, totalFilteredPagos) => {
    const totalPages = Math.ceil(totalFilteredPagos / ITEMS_PER_PAGE);
    const paginatorContainer = document.querySelector("#paginator");

    if (!paginatorContainer) {
        console.error("Contenedor del paginador (#paginator) no encontrado.");
        return;
    }

    paginatorContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.classList.add('paginator-btn');
    if (currentPage === 1) {
        prevButton.disabled = true;
    }
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            // Usa null, null para que cargar_tabla_con_filtros use los filtros globales persistidos
            cargar_tabla_con_filtros(tabla, null, null);
        }
    });
    paginatorContainer.append(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('paginator-btn');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            // Usa null, null para que cargar_tabla_con_filtros use los filtros globales persistidos
            cargar_tabla_con_filtros(tabla, null, null);
        });
        paginatorContainer.append(pageButton);
    }

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.classList.add('paginator-btn');
        if (currentPage === totalPages || totalPages === 0) {
            nextButton.disabled = true;
        }
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                console.log(`[Paginador] Clic en Siguiente. Nueva página: ${currentPage}`);
                // Usa null, null para que cargar_tabla_con_filtros use los filtros globales persistidos
                cargar_tabla_con_filtros(tabla, null, null);
            }
        });
        paginatorContainer.append(nextButton);
        console.log(`[Paginador] Renderizado. Total de pagos filtrados: ${totalFilteredPagos}, Páginas: ${totalPages}, Página actual: ${currentPage}`);
    
}
export const agregarEventosBotones = async () => {
    const tabla = document.querySelector("#tablePagos");

    if (!tabla) {
        console.error("Tabla de Pagos no encontrada para adjuntar eventos a botones.");
        return;
    }

    tabla.addEventListener('click', async (e) => {
        if (e.target.classList.contains('eliminar')) {
            const pagosId = e.target.dataset.id;
            console.log(pagosId);
            
            await eliminar_pagos_por_id(pagosId);
            allPagos = [];
            setCurrentPage(1);
            await cargar_tabla(tabla);
        }
        if (e.target.classList.contains('editar')) {
            const pagosId = e.target.dataset.id;
            console.log("Editar Pago con ID:", pagosId);
            location.hash = `#editarPagos/${pagosId}`;
        }
    });
};
