// src/controllers/mostrarTabla.js

import eliminar_clientes_por_id from "../../casos_de_uso/Clientes/eliminarClientes.js";
import listarClientes from "../../casos_de_uso/Clientes/listarClientes.js";

export const ITEMS_PER_PAGE = 4;
export let currentPage = 1;
export let allClients = [];

let currentNameFilter = null; // Variable global para persistir el filtro de nombre
let currentStateFilter = null; // Variable global para persistir el filtro de estado

export const forceReloadAllClientes= async () => {
    console.log("[mostrarTabla] Forzando recarga de todas las desde el backend.");
    allClients = []; // Vacía la caché de clientes.
    currentPage = 1; // Resetea a la primera página.

    const tabla = document.querySelector("#tableClientes");
    if (tabla) {
        await cargar_tabla(tabla);
    } else {
        console.warn("[mostrarTabla] No se encontró la tabla de personas para recargar.");
    }
};


export const setCurrentPage = (newPage) => {
  currentPage = newPage;
  console.log(`[mostrarTabla] Página actual establecida a: ${currentPage}`);
};

export const cargar_tabla = async (tabla) => {
  try {
    if (allClients.length === 0) {
      const response = await listarClientes();
      allClients = response.data;
      console.log("[mostrarTabla] Datos iniciales de todos los clientes cargados (allClients):", allClients);
      if (allClients.length > 0) {
        // --- NUEVO LOG: Estructura de un cliente ---
        console.log("[mostrarTabla] Ejemplo de un objeto cliente:", allClients[0]);
        console.log("[mostrarTabla] Propiedad 'nombre_completo_razon_social' del primer cliente:", allClients[0].nombre_completo_razon_social);
        console.log("[mostrarTabla] Propiedad 'estado' del primer cliente:", allClients[0].estado); // <-- ¡VERIFICA ESTE LOG!
      }
    }

    // Al cargar la tabla inicialmente o si se recarga todo, resetea los filtros globales.
    currentNameFilter = null;
    currentStateFilter = null;
    await cargar_tabla_con_filtros(tabla, null, null); // Llama sin filtros iniciales, que usarán los nulos

  } catch (error) {
    console.error("[mostrarTabla] Error al cargar la tabla de clientes inicialmente (desde API):", error);
    const tBody = tabla.querySelector("tbody");
    const numCols = tabla.querySelectorAll('th').length;
    tBody.innerHTML = `<tr><td colspan="${numCols}" style="text-align: center; padding: 20px; color: red;">
                            Error al cargar los clientes. Inténtalo de nuevo más tarde.</td></tr>`;
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

  let clientsToFilter = [...allClients];

  // --- Lógica de Aplicación de Filtros (Prioridad: Nombre > Estado) ---

  if (currentNameFilter && currentNameFilter.trim() !== '') {
    const lowerCaseNameFilter = currentNameFilter.toLowerCase();
    clientsToFilter = clientsToFilter.filter(cliente =>
      cliente.nombre_completo_razon_social &&
      typeof cliente.nombre_completo_razon_social === 'string' &&
      cliente.nombre_completo_razon_social.toLowerCase().includes(lowerCaseNameFilter)
    );
    console.log(`[cargar_tabla_con_filtros] Filtrado solo por nombre ('${currentNameFilter}'): ${clientsToFilter.length} resultados.`);
  } else if (currentStateFilter && currentStateFilter !== '') { // <-- CONDICIÓN MEJORADA: solo verifica que no sea vacío.
    // También captura la opción por defecto ("Seleccione Estado...") si no se cambia.
    const lowerCaseEstadoFilter = currentStateFilter.toLowerCase();

    clientsToFilter = clientsToFilter.filter(cliente => {
      // --- NUEVO LOG: Comparación de estado para cada cliente ---
      console.log(`[cargar_tabla_con_filtros] Cliente ID: ${cliente.id_persona || 'N/A'}, Estado en datos: '${cliente.estado}', Comparando con filtro: '${lowerCaseEstadoFilter}'`);

      return cliente.estado && // Verifica que la propiedad 'estado' exista
        typeof cliente.estado === 'string' && // Asegura que es un string
        cliente.estado.toLowerCase() === lowerCaseEstadoFilter; // Compara
    });
    console.log(`[cargar_tabla_con_filtros] Filtrado solo por estado ('${currentStateFilter}'): ${clientsToFilter.length} resultados.`);
  } else {
    console.log("[cargar_tabla_con_filtros] No se aplicó ningún filtro (nombre y/o estado vacíos o nulos). Mostrando todos los clientes.");
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const clientsToDisplay = clientsToFilter.slice(startIndex, endIndex);

  console.log(`[cargar_tabla_con_filtros] Clientes a mostrar en esta página (${currentPage}): ${clientsToDisplay.length}`);

  if (clientsToDisplay.length === 0) {
    const numCols = tabla.querySelectorAll('th').length;
    // Corregido: insertRow() para crear la fila y luego insertCell()
    const noResultsRow = tBody.insertRow();
    const noResultsCell = noResultsRow.insertCell(0);
    noResultsCell.colSpan = numCols;
    noResultsCell.textContent = "No se encontraron clientes con los filtros aplicados.";
    noResultsCell.style.textAlign = "center";
    noResultsCell.style.padding = "20px";
    noResultsCell.style.color = "#888";
  } else {
    clientsToDisplay.forEach(cliente => {
      crearFila(cliente, tabla);
    });
  }

  renderPaginator(tabla, clientsToFilter.length);
};


export const crearFila = ({ id_persona, nombre_completo_razon_social, id_tipo_identificacion, numero_identificacion, correo, telefono, estado }, tabla) => {
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
    tr.classList.add('cliente-inactivo');
  }

  const div = document.createElement("div");
  const btnEliminar = document.createElement("a");
  const btnEditar = document.createElement("a");

  btnEditar.setAttribute("data-id", id_persona);
  btnEditar.setAttribute("href", `#editarcliente/${id_persona}`);

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


const renderPaginator = (tabla, totalFilteredClients) => {
  const totalPages = Math.ceil(totalFilteredClients / ITEMS_PER_PAGE);
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
  console.log(`[Paginador] Renderizado. Total de clientes filtrados: ${totalFilteredClients}, Páginas: ${totalPages}, Página actual: ${currentPage}`);
};


export const agregarEventosBotones = async () => {
  const tabla = document.querySelector("#tableClientes");

  if (!tabla) {
    console.error("Tabla de clientes no encontrada para adjuntar eventos a botones.");
    return;
  }

  tabla.addEventListener('click', async (e) => {
    if (e.target.classList.contains('eliminar')) {
      const clienteId = e.target.dataset.id;

      try {
        await eliminar_clientes_por_id(clienteId);

        allClients = [];
        setCurrentPage(1);
        await cargar_tabla(tabla);

      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        alert("Error al eliminar cliente. Inténtalo de nuevo.");
      }

    }
    if (e.target.classList.contains('editar')) {
      const clienteId = e.target.dataset.id;
      console.log("Editar cliente con ID:", clienteId);
      location.hash = `#editarEquipos/${clienteId}`;
    }
  });
};