// src/controllers/mostrarTabla.js

import eliminar_proveedores_por_id from "../../casos_de_uso/Proveedores/eliminarProveedores.js"; 
import listarProveedores from "../../casos_de_uso/Proveedores/listarProveedores.js"; 

export const ITEMS_PER_PAGE = 4; 
export let currentPage = 1;       
export let allProveedores = [];       

let currentNameFilter = null; // Variable global para persistir el filtro de nombre
let currentStateFilter = null; // Variable global para persistir el filtro de estado


export const setCurrentPage = (newPage) => {
    currentPage = newPage;
    console.log(`[mostrarTabla] Página actual establecida a: ${currentPage}`);
};

export const cargar_tabla = async (tabla) => {
    try {
        if (allProveedores.length === 0) { 
            const response = await listarProveedores(); 
            allProveedores = response.data; 
            console.log("[mostrarTabla] Datos iniciales de todos los proveedores cargados (allProveedores):", allProveedores);
            if (allProveedores.length > 0) {
                // --- NUEVO LOG: Estructura de un empleado ---
                console.log("[mostrarTabla] Ejemplo de un objeto empleado:", allProveedores[0]);
                console.log("[mostrarTabla] Propiedad 'nombre_completo_razon_social' del primer empleado:", allProveedores[0].nombre_completo_razon_social);
                console.log("[mostrarTabla] Propiedad 'estado' del primer empleado:", allProveedores[0].estado); // <-- ¡VERIFICA ESTE LOG!
            }
        }

        // Al cargar la tabla inicialmente o si se recarga todo, resetea los filtros globales.
        currentNameFilter = null;
        currentStateFilter = null;
        await cargar_tabla_con_filtros(tabla, null, null); // Llama sin filtros iniciales, que usarán los nulos

    } catch (error) {
        console.error("[mostrarTabla] Error al cargar la tabla de proveedores inicialmente (desde API):", error);
        const tBody = tabla.querySelector("tbody");
        const numCols = tabla.querySelectorAll('th').length;
        tBody.innerHTML = `<tr><td colspan="${numCols}" style="text-align: center; padding: 20px; color: red;">
                            Error al cargar los proveedores. Inténtalo de nuevo más tarde.</td></tr>`;
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
        currentStateFilter = estadoFilter;
    }
    console.log(`[cargar_tabla_con_filtros] Filtros activos globales: Nombre='${currentNameFilter}', Estado='${currentStateFilter}'`);


    const tBody = tabla.querySelector("tbody");
    tBody.innerHTML = ''; 

    let proveedoresToFilter = [...allProveedores]; 

    // --- Lógica de Aplicación de Filtros (Prioridad: Nombre > Estado) ---
    
    if (currentNameFilter && currentNameFilter.trim() !== '') {
        const lowerCaseNameFilter = currentNameFilter.toLowerCase();
        proveedoresToFilter = proveedoresToFilter.filter(proveedores =>
            proveedores.nombre_completo_razon_social && 
            typeof proveedores.nombre_completo_razon_social === 'string' &&
            proveedores.nombre_completo_razon_social.toLowerCase().includes(lowerCaseNameFilter)
        );
        console.log(`[cargar_tabla_con_filtros] Filtrado solo por nombre ('${currentNameFilter}'): ${proveedoresToFilter.length} resultados.`);
    } else if (currentStateFilter && currentStateFilter !== '') { // <-- CONDICIÓN MEJORADA: solo verifica que no sea vacío.
        // También captura la opción por defecto ("Seleccione Estado...") si no se cambia.
        const lowerCaseEstadoFilter = currentStateFilter.toLowerCase();
        
        proveedoresToFilter = proveedoresToFilter.filter(proveedores => {
            // --- NUEVO LOG: Comparación de estado para cada proveedores ---
            console.log(`[cargar_tabla_con_filtros] proveedores ID: ${proveedores.id_persona || 'N/A'}, Estado en datos: '${proveedores.estado}', Comparando con filtro: '${lowerCaseEstadoFilter}'`);
            
            return proveedores.estado && // Verifica que la propiedad 'estado' exista
                   typeof proveedores.estado === 'string' && // Asegura que es un string
                   proveedores.estado.toLowerCase() === lowerCaseEstadoFilter; // Compara
        });
        console.log(`[cargar_tabla_con_filtros] Filtrado solo por estado ('${currentStateFilter}'): ${proveedoresToFilter.length} resultados.`);
    } else {
        console.log("[cargar_tabla_con_filtros] No se aplicó ningún filtro (nombre y/o estado vacíos o nulos). Mostrando todos los proveedores.");
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const clientsToDisplay = proveedoresToFilter.slice(startIndex, endIndex);

    console.log(`[cargar_tabla_con_filtros] proveedores a mostrar en esta página (${currentPage}): ${clientsToDisplay.length}`);

    if (clientsToDisplay.length === 0) {
        const numCols = tabla.querySelectorAll('th').length;
        // Corregido: insertRow() para crear la fila y luego insertCell()
        const noResultsRow = tBody.insertRow(); 
        const noResultsCell = noResultsRow.insertCell(0);
        noResultsCell.colSpan = numCols; 
        noResultsCell.textContent = "No se encontraron proveedores con los filtros aplicados.";
        noResultsCell.style.textAlign = "center";
        noResultsCell.style.padding = "20px";
        noResultsCell.style.color = "#888";
    } else {
        clientsToDisplay.forEach(proveedor => {
            crearFila(proveedor, tabla);
        });
    }

    renderPaginator(tabla, proveedoresToFilter.length); 
};


export const crearFila = ({id_persona, nombre_completo_razon_social, id_tipo_identificacion, numero_identificacion, correo, telefono, estado }, tabla) => {
    const tBody = tabla.querySelector("tbody");
    const tr = tBody.insertRow(); 
    const tdNombre = tr.insertCell(0); 
    const tdTipoId = tr.insertCell(1);
    const tdNumId = tr.insertCell(2);
    const tdCorreo = tr.insertCell(3);
    const tdTelefono = tr.insertCell(4);
    const tdEstado = tr.insertCell(5);
    const tdBotonera = tr.insertCell(6); 

    tdNombre.textContent = nombre_completo_razon_social;
    tdTipoId.textContent = id_tipo_identificacion; 
    tdNumId.textContent = numero_identificacion;
    tdCorreo.textContent = correo;
    tdTelefono.textContent = telefono;
    tdEstado.textContent = estado;
    
    // Solo aplica la clase si el estado es 'inactivo' y existe la propiedad
    if (estado && typeof estado === 'string' && estado.toLowerCase() === 'inactivo') { 
        tr.classList.add('proveedor-inactivo'); 
    }

    const div = document.createElement("div");
    const btnEliminar = document.createElement("a");
    const btnEditar = document.createElement("a");
 
    btnEditar.setAttribute("data-id", id_persona);
    btnEditar.setAttribute("href", `#editarProveedores/${id_persona}`); 

    btnEliminar.setAttribute("data-id", id_persona);
 
    btnEditar.textContent = "Editar";
    btnEliminar.textContent = "Eliminar";
 
    div.classList.add("botonera");
    btnEditar.classList.add("btn", "btn--small", "editar");
    btnEliminar.classList.add("btn", "btn--small", "btn--danger", "eliminar");
    div.append(btnEditar, btnEliminar);
    tdBotonera.append(div);
 
    tr.setAttribute("id", `client_${id_persona}`);
};


const renderPaginator = (tabla, totalFilteredProvedores) => {
    const totalPages = Math.ceil(totalFilteredProvedores / ITEMS_PER_PAGE);
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
            console.log(`[Paginador] Clic en Anterior. Nueva página: ${currentPage}`);
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
            console.log(`[Paginador] Clic en página ${i}. Nueva página: ${currentPage}`);
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
    console.log(`[Paginador] Renderizado. Total de proveedores filtrados: ${totalFilteredProvedores}, Páginas: ${totalPages}, Página actual: ${currentPage}`);
};


export const agregarEventosBotones = async () => {
    const tabla = document.querySelector("#tableProveedores");
    
    if (!tabla) {
        console.error("Tabla de proveedores no encontrada para adjuntar eventos a botones.");
        return;
    }

    tabla.addEventListener('click', async (e) => {
        if (e.target.classList.contains('eliminar')) {
            const proveedorId = e.target.dataset.id; 
            if (confirm(`¿Estás seguro de eliminar el proveedor con ID ${proveedorId}?`)) {
                try {
                    console.log(`[mostrarTabla] Iniciando eliminación de proveedor con ID: ${proveedorId}`);
                    await eliminar_proveedores_por_id(proveedorId); 
                    
                    allProveedores = []; 
                    setCurrentPage(1); 
                    
                    console.log(`[mostrarTabla] proveedor ${proveedorId} eliminado. Forzando recarga de datos.`);
                    // Llama con null, null para que se usen los filtros persistidos
                    await cargar_tabla(tabla); 
                    
                    alert("proveedor eliminado exitosamente.");
                } catch (error) {
                    console.error("Error al eliminar proveedor:", error);
                    alert("Error al eliminar proveedor. Inténtalo de nuevo.");
                }
            }
        }
        if (e.target.classList.contains('editar')) {
            const proveedorId = e.target.dataset.id;
            console.log("Editar proveedor con ID:", proveedorId);
            location.hash = `#editarProveedor/${proveedorId}`; 
        }
    });
};