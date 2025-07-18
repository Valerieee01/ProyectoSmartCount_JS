import eliminar_mantenimientos_por_id from "../../casos_de_uso/Mantenimientos/eliminarMatenimientos.js";
import listarMantenimientos from "../../casos_de_uso/Mantenimientos/listarMantenimientos.js";


// --- Variables para la paginación ---
const ITEMS_PER_PAGE = 3; // Define cuántos mantenimientos mostrar por página
let currentPage = 1;      // Página actual, inicia en la primera
let allMantenimientos = [];      // Almacenará todos los mantenimientos obtenidos de la API

let currentEquipoFilter = null; // Variable global para persistir el filtro de número de equipo
let currentTipoMantenimientoFilter = null; // Variable global para persistir el filtro de tipo de mantenimiento


export const forceReloadAllMantenimientos = async () => {
    allMantenimientos = []; // Vacía la caché de mantenimientos.
    currentPage = 1; // Resetea a la primera página.

    const tabla = document.querySelector("#tableMantenimientos"); // Asegúrate que el ID sea #tableMantenimientos
    if (tabla) {
        await cargar_tabla(tabla);
    } else {
        console.warn("[mostrarTablaMantenimientos] No se encontró la tabla de mantenimientos para recargar.");
    }
};

export const setCurrentPage = (newPage) => {
    currentPage = newPage;
};

export const cargar_tabla = async (tabla) => {
    try {
        if (allMantenimientos.length === 0) {
            const response = await listarMantenimientos();
            allMantenimientos = response.data;
            if (allMantenimientos.length > 0) {
                // --- NUEVO LOG: Estructura de un mantenimiento ---
                console.log("[mostrarTablaMantenimientos] Ejemplo de un objeto mantenimiento:", allMantenimientos[0]);
                console.log("[mostrarTablaMantenimientos] Propiedad 'numero_equipo' del primer mantenimiento:", allMantenimientos[0].numero_equipo);
                console.log("[mostrarTablaMantenimientos] Propiedad 'tipo_mantenimiento' del primer mantenimiento:", allMantenimientos[0].tipo_mantenimiento); // <-- ¡VERIFICA ESTE LOG!
            }
        }

        // Al cargar la tabla inicialmente o si se recarga todo, resetea los filtros globales.
        currentEquipoFilter = null;
        currentTipoMantenimientoFilter = null;
        await cargar_tabla_con_filtros(tabla, null, null); // Llama sin filtros iniciales, que usarán los nulos

    } catch (error) {
        console.error("[mostrarTablaMantenimientos] Error al cargar la tabla de mantenimientos inicialmente (desde API):", error);
        const tBody = tabla.querySelector("tbody");
        const numCols = tabla.querySelectorAll('th').length;
        tBody.innerHTML = `<tr><td colspan="${numCols}" style="text-align: center; padding: 20px; color: red;">
                            Error al cargar los mantenimientos. Inténtalo de nuevo más tarde.</td></tr>`;
    }
};


export const cargar_tabla_con_filtros = async (tabla, equipoFilter = null, tipoMantenimientoFilter = null) => { // Corregido nombre de parámetro
    // --- Almacenar/Actualizar los filtros globales ---
    // Si se pasan filtros nuevos, actualiza las variables globales.
    // Si se llama sin filtros (ej. desde el paginador), se usarán los valores globales existentes.
    if (equipoFilter !== null) {
        currentEquipoFilter = equipoFilter;
    }
    if (tipoMantenimientoFilter !== null) { // Corregido nombre de variable
        currentTipoMantenimientoFilter = tipoMantenimientoFilter; // Corregido nombre de variable
    }


    const tBody = tabla.querySelector("tbody");
    tBody.innerHTML = '';

    let mantenimientosToFilter = [...allMantenimientos];

    // --- Lógica de Aplicación de Filtros (Prioridad: Número de Equipo > Tipo de Mantenimiento) ---

    if (currentEquipoFilter && currentEquipoFilter.trim() !== '') {
        const lowerCaseEquipoFilter = currentEquipoFilter.toLowerCase(); // Renombrado para claridad
        mantenimientosToFilter = mantenimientosToFilter.filter(mantenimiento =>
            mantenimiento.numero_equipo &&
            typeof mantenimiento.numero_equipo === 'string' &&
            mantenimiento.numero_equipo.toLowerCase().includes(lowerCaseEquipoFilter)
        );
        console.log(`[cargar_tabla_con_filtros] Filtrado por número de equipo ('${currentEquipoFilter}'): ${mantenimientosToFilter.length} resultados.`);
    } else if (currentTipoMantenimientoFilter && currentTipoMantenimientoFilter !== '') { // Corregido nombre de variable
        const lowerCaseTipoMantenimientoFilter = currentTipoMantenimientoFilter.toLowerCase(); // Corregido nombre de variable

        mantenimientosToFilter = mantenimientosToFilter.filter(mantenimiento => {
            // --- ¡CORRECCIÓN CLAVE AQUÍ! 'tipo_mantenimiento' sin 'a' extra ---
            return mantenimiento.tipo_mantenimiento && // Verifica que la propiedad 'tipo_mantenimiento' exista
                typeof mantenimiento.tipo_mantenimiento === 'string' && // Asegura que es un string
                mantenimiento.tipo_mantenimiento.toLowerCase() === lowerCaseTipoMantenimientoFilter; // Compara
        });
        console.log(`[cargar_tabla_con_filtros] Filtrado solo por tipo de mantenimiento ('${currentTipoMantenimientoFilter}'): ${mantenimientosToFilter.length} resultados.`);
    } else {
        console.log("[cargar_tabla_con_filtros] No se aplicó ningún filtro (número de equipo y/o tipo de mantenimiento vacíos o nulos). Mostrando todos los mantenimientos.");
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const mantenimientosToDisplay = mantenimientosToFilter.slice(startIndex, endIndex);

    console.log(`[cargar_tabla_con_filtros] Mantenimientos a mostrar en esta página (${currentPage}): ${mantenimientosToDisplay.length}`);

    if (mantenimientosToDisplay.length === 0) {
        const numCols = tabla.querySelectorAll('th').length;
        const noResultsRow = tBody.insertRow();
        const noResultsCell = noResultsRow.insertCell(0);
        noResultsCell.colSpan = numCols;
        noResultsCell.textContent = "No se encontraron mantenimientos con los filtros aplicados.";
        noResultsCell.style.textAlign = "center";
        noResultsCell.style.padding = "20px";
        noResultsCell.style.color = "#888";
    } else {
        mantenimientosToDisplay.forEach(mantenimiento => {
            crearFila(mantenimiento, tabla);
        });
    }
    renderPaginator(tabla, mantenimientosToFilter.length);
};

export const crearFila = ({ id_mantenimiento, numero_equipo, descripcion_trabajo, nombre_completo_razon_social, tipo_mantenimiento, fecha_mantenimiento, observaciones }, tabla) => { // Corregido 'nombre_completo_razon_social' a 'nombre_completo_razon_social'
    const tBody = tabla.querySelector("tbody");
    const tr = tBody.insertRow();
    const tdNumEquipo = tr.insertCell(0); // Renombrado a tdNumEquipo
    const tdDescripcionTrabajo = tr.insertCell(1); // Renombrado a tdDescripcionTrabajo
    const tdEmpleado = tr.insertCell(2); // Renombrado a tdEmpleado
    const tdTipoManto = tr.insertCell(3);
    const tdFechaManto = tr.insertCell(4);
    const tdObservaciones = tr.insertCell(5);
    const tdBotonera = tr.insertCell(6);

    // Agregar el contenido a las celdas
    tdNumEquipo.textContent = numero_equipo;
    tdDescripcionTrabajo.textContent = descripcion_trabajo;
    tdEmpleado.textContent = nombre_completo_razon_social; // Usa el alias 'nombre_empleado' de la consulta SQL
    tdTipoManto.textContent = tipo_mantenimiento;

    // Formatear la fecha de mantenimiento
    if (fecha_mantenimiento) {
        const dateObj = new Date(fecha_mantenimiento);
        if (!isNaN(dateObj.getTime())) {
            tdFechaManto.textContent = dateObj.toLocaleDateString(); // Formato local de fecha
        } else {
            tdFechaManto.textContent = 'Fecha inválida';
        }
    } else {
        tdFechaManto.textContent = 'N/A';
    }

    tdObservaciones.textContent = observaciones;

    const div = document.createElement("div");
    const btnEliminar = document.createElement("a");
    const btnEditar = document.createElement("a");

    btnEditar.setAttribute("data-id", id_mantenimiento);
    btnEditar.setAttribute("href", `#editarMantenimiento/${id_mantenimiento}`);

    btnEliminar.setAttribute("data-id", id_mantenimiento);

    btnEditar.textContent = "Editar";
    btnEliminar.textContent = "Eliminar";

    div.classList.add("botonera");
    btnEditar.classList.add("btn", "btn--small", "editar");
    btnEliminar.classList.add("btn", "btn--small", "btn--danger", "eliminar");
    div.append(btnEditar, btnEliminar);
    tdBotonera.append(div);

    tr.setAttribute("id", `mantenimiento_${id_mantenimiento}`); // ID de fila específico para mantenimientos
};

// --- Función para renderizar el paginador (adaptada para mantenimientos) ---
const renderPaginator = (tabla, totalFilteredMantenimientos) => { // Corregido nombre de parámetro
    const totalPages = Math.ceil(totalFilteredMantenimientos / ITEMS_PER_PAGE);
    const paginatorContainer = document.querySelector("#paginator"); // Asegúrate que el ID sea #paginatorMantenimientos

    if (!paginatorContainer) {
        console.error("Contenedor del paginador (#paginatorMantenimientos) no encontrado.");
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
            cargar_tabla_con_filtros(tabla, null, null); // Usará los filtros globales persistidos
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
            cargar_tabla_con_filtros(tabla, null, null); // Usará los filtros globales persistidos
        });
        paginatorContainer.append(pageButton);
    }

    // --- ¡CORRECCIÓN CLAVE AQUÍ! Bloque para el botón "Siguiente" ---
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.classList.add('paginator-btn');
    // Deshabilita si estamos en la última página o si no hay ninguna página (tabla vacía).
    if (currentPage === totalPages || totalPages === 0) {
        nextButton.disabled = true;
    }
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            cargar_tabla_con_filtros(tabla, null, null);
        }
    });
    paginatorContainer.append(nextButton);
    // --- Fin de la corrección ---

    console.log(`[Paginador Mantenimientos] Renderizado. Total de mantenimientos filtrados: ${totalFilteredMantenimientos}, Páginas: ${totalPages}, Página actual: ${currentPage}`); // Renombrado log
};


export const agregarEventosBotones = async () => {
    const tabla = document.querySelector("#tableMantenimientos"); // Asegúrate que el ID sea #tableMantenimientos

    if (!tabla) {
        console.error("Tabla de Mantenimientos no encontrada para adjuntar eventos a botones.");
        return;
    }

    tabla.addEventListener('click', async (e) => {
        if (e.target.classList.contains('eliminar')) {
            const mantenimientoId = e.target.dataset.id; // Renombrado
            if (confirm(`¿Estás seguro de eliminar el Mantenimiento con ID ${mantenimientoId}?`)) { // Mensaje más específico
                await eliminar_mantenimientos_por_id(mantenimientoId); // Usar el ID correcto
                allMantenimientos = []; // Vacía la lista de mantenimientos
                setCurrentPage(1); // Vuelve a la primera página
                await cargar_tabla(tabla);
                alert("Mantenimiento eliminado exitosamente."); // Mensaje más específico
            }
        }
        // Lógica para el botón de editar
        if (e.target.classList.contains('editar')) {
            const mantenimientoId = e.target.dataset.id; // Renombrado
            console.log("Editar Mantenimiento con ID:", mantenimientoId);
            location.hash = `#editarMantenimiento/${mantenimientoId}`;
        }
    });
};