// src/controllers/mostrarTablaEquipos.js

// Importa las funciones de tu API para interactuar con los datos de equipos.
// Asume que tienes un caso de uso para listar y eliminar equipos.
import eliminar_equipos_por_id from "../../casos_de_uso/Equipos/eliminarEquipos.js";
import listarEquipos from "../../casos_de_uso/Equipos/listarEquipos.js"; // Debe obtener equipos, incluyendo nombre del cliente si es posible

// --- Variables Globales para Paginación y Filtrado de Equipos ---
// Estas variables se exportan para que otros módulos (como equiposController.js) puedan acceder a ellas.
export const ITEMS_PER_PAGE_EQUIPOS = 4;
export let currentPageEquipos = 1;
export let allEquipos = [];              // Almacena TODOS los equipos obtenidos de la API

// Variables para persistir los filtros activos
let currentNumeroEquipoFilter = null;
let currentPlacaFilter = null;

/**
 * Función para establecer la página actual de equipos.
 * Exportada para permitir que otros módulos la cambien de forma segura.
 * @param {number} newPage - El nuevo número de página a establecer.
 */
export const setCurrentPageEquipos = (newPage) => {
  currentPageEquipos = newPage;
  console.log(`[mostrarTablaEquipos] Página actual establecida a: ${currentPageEquipos}`);
};

/**
 * Función para forzar la recarga completa de todos los equipos desde el backend.
 * Se usa después de crear o eliminar un equipo para actualizar la tabla.
 */
export const forceReloadAllEquipos = async () => {
  console.log("[mostrarTablaEquipos] Forzando recarga de todos los equipos desde el backend.");
  allEquipos = []; // Vacía la caché de equipos.
  setCurrentPageEquipos(1); // Vuelve a la primera página.

  const tabla = document.querySelector("#tableEquipos");
  if (tabla) {
    // Llama a cargar_tabla_equipos, que detectará que allEquipos está vacío y hará el fetch.
    await cargar_tabla_equipos(tabla);
  } else {
    console.warn("[mostrarTablaEquipos] No se encontró la tabla de equipos para recargar.");
  }
};

/**
 * Función principal para cargar la tabla de equipos.
 * Se llama inicialmente cuando se renderiza la vista de equipos.
 * Obtiene todos los equipos del backend (si no los tiene ya).
 * @param {HTMLElement} tabla - El elemento HTML de la tabla de equipos.
 */
export const cargar_tabla_equipos = async (tabla) => {
  try {
    if (allEquipos.length === 0) {
      const response = await listarEquipos(); // Llama a tu API para obtener todos los equipos.
      console.log();

      allEquipos = response.data; // Asume que los datos están en 'response.data'.
      console.log("[mostrarTablaEquipos] Datos iniciales de todos los equipos cargados:", allEquipos);
      if (allEquipos.length > 0) {
        console.log("[mostrarTablaEquipos] Ejemplo de un objeto equipo:", allEquipos[0]);
        console.log("[mostrarTablaEquipos] Propiedad 'numero_equipo' del primer equipo:", allEquipos[0].numero_equipo);
      }
    }

    // Al cargar la tabla inicialmente o si se recarga todo, resetea los filtros globales.
    currentNumeroEquipoFilter = null;
    currentPlacaFilter = null;
    await cargar_tabla_con_filtros_equipos(tabla, null, null);

  } catch (error) {
    console.error("[mostrarTablaEquipos] Error al cargar la tabla de equipos inicialmente (desde API):", error);
    const tBody = tabla.querySelector("tbody");
    const numCols = tabla.querySelectorAll('th').length;
    tBody.innerHTML = `<tr><td colspan="${numCols}" style="text-align: center; padding: 20px; color: red;">
                            Error al cargar los equipos. Inténtalo de nuevo más tarde.</td></tr>`;
  }
};

/**
 * Función central para filtrar los equipos, paginarlos y renderizarlos en la tabla.
 * @param {HTMLElement} tabla - El elemento HTML de la tabla de equipos.
 * @param {string | null} numeroEquipoFilter - Filtro por número de equipo.
 * @param {string | null} placaFilter - Filtro por placa.
 */
export const cargar_tabla_con_filtros_equipos = async (tabla, numeroEquipoFilter = null, placaFilter = null) => {
  // Almacenar/Actualizar los filtros globales.
  if (numeroEquipoFilter !== null) { currentNumeroEquipoFilter = numeroEquipoFilter; }
  if (placaFilter !== null) { currentPlacaFilter = placaFilter; }


  const tBody = tabla.querySelector("tbody");
  tBody.innerHTML = '';

  let equiposToFilter = [...allEquipos];

  // --- Lógica de Aplicación de Filtros (Prioridad: Número de Equipo > Placa) ---
  // Solo se aplicará un filtro a la vez.
  if (currentNumeroEquipoFilter && currentNumeroEquipoFilter.trim() !== '') {
    const lowerCaseNumeroEquipoFilter = currentNumeroEquipoFilter.toLowerCase();
    equiposToFilter = equiposToFilter.filter(equipo =>
      equipo.numero_equipo &&
      typeof equipo.numero_equipo === 'string' &&
      equipo.numero_equipo.toLowerCase().includes(lowerCaseNumeroEquipoFilter)
    );
    console.log(`[cargar_tabla_con_filtros_equipos] Filtrado por número de equipo ('${currentNumeroEquipoFilter}'): ${equiposToFilter.length} resultados.`);
  } else if (currentPlacaFilter && currentPlacaFilter.trim() !== '') {
    const lowerCasePlacaFilter = currentPlacaFilter.toLowerCase();
    equiposToFilter = equiposToFilter.filter(equipo =>
      equipo.placa &&
      typeof equipo.placa === 'string' &&
      equipo.placa.toLowerCase().includes(lowerCasePlacaFilter)
    );
    console.log(`[cargar_tabla_con_filtros_equipos] Filtrado por placa ('${currentPlacaFilter}'): ${equiposToFilter.length} resultados.`);
  } else {
    console.log("[cargar_tabla_con_filtros_equipos] No se aplicó ningún filtro. Mostrando todos los equipos.");
  }

  const startIndex = (currentPageEquipos - 1) * ITEMS_PER_PAGE_EQUIPOS;
  const endIndex = startIndex + ITEMS_PER_PAGE_EQUIPOS;
  const equiposToDisplay = equiposToFilter.slice(startIndex, endIndex);

  console.log(`[cargar_tabla_con_filtros_equipos] Equipos a mostrar en esta página (${currentPageEquipos}): ${equiposToDisplay.length}`);

  if (equiposToDisplay.length === 0) {
    const numCols = tabla.querySelectorAll('th').length;
    const noResultsRow = tBody.insertRow();
    const noResultsCell = noResultsRow.insertCell(0);
    noResultsCell.colSpan = numCols;
    noResultsCell.textContent = "No se encontraron equipos con los filtros aplicados.";
    noResultsCell.style.textAlign = "center";
    noResultsCell.style.padding = "20px";
    noResultsCell.style.color = "#888";
  } else {
    equiposToDisplay.forEach(equipo => {
      crearFilaEquipo(equipo, tabla);
    });
  }

  renderPaginatorEquipos(tabla, equiposToFilter.length);
};

/**
 * Crea y añade una fila de tabla (<tr>) con los datos de un equipo.
 * @param {object} equipo - Objeto con los datos del equipo.
 * @param {HTMLElement} tabla - El elemento HTML de la tabla.
 */
export const crearFilaEquipo = ({ id_equipo, numero_equipo, placa, descripcion, id_cliente, nombre_cliente, fecha_registro }, tabla) => {
  const tBody = tabla.querySelector("tbody");
  const tr = tBody.insertRow();
  const tdNumeroEquipo = tr.insertCell(0);
  const tdPlaca = tr.insertCell(1);
  const tdDescripcion = tr.insertCell(2);
  const tdCliente = tr.insertCell(3);
  const tdFechaRegistro = tr.insertCell(4);
  const tdBotonera = tr.insertCell(5);

  tdNumeroEquipo.textContent = numero_equipo;
  tdPlaca.textContent = placa;
  tdDescripcion.textContent = descripcion;
  // Muestra el nombre del cliente si viene de la unión, o el ID si solo tienes el ID.
  tdCliente.textContent = nombre_cliente || id_cliente;
  tdFechaRegistro.textContent = fecha_registro

  const div = document.createElement("div");
  const btnEliminar = document.createElement("a");
  const btnEditar = document.createElement("a");

  btnEditar.setAttribute("data-id", id_equipo);
  btnEditar.setAttribute("href", `#editarEquipo/${id_equipo}`); // Ruta para editar equipo

  btnEliminar.setAttribute("data-id", id_equipo);

  btnEditar.textContent = "Editar";
  btnEliminar.textContent = "Eliminar";

  div.classList.add("botonera");
  btnEditar.classList.add("btn", "btn--small", "editar");
  btnEliminar.classList.add("btn", "btn--small", "btn--danger", "eliminar");
  div.append(btnEditar, btnEliminar);
  tdBotonera.append(div);

  tr.setAttribute("id", `equipo_${id_equipo}`);
};

/**
 * Renderiza y gestiona la lógica de los botones de paginación para equipos.
 * @param {HTMLElement} tabla - El elemento HTML de la tabla de equipos.
 * @param {number} totalFilteredEquipos - El número total de equipos después de aplicar los filtros.
 */
const renderPaginatorEquipos = (tabla, totalFilteredEquipos) => {
  const totalPages = Math.ceil(totalFilteredEquipos / ITEMS_PER_PAGE_EQUIPOS);
  const paginatorContainer = document.querySelector("#paginatorEquipos"); // ID del paginador de equipos

  if (!paginatorContainer) {
    console.error("Contenedor del paginador (#paginatorEquipos) no encontrado.");
    return;
  }

  paginatorContainer.innerHTML = '';

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Anterior';
  prevButton.classList.add('paginator-btn');
  if (currentPageEquipos === 1) {
    prevButton.disabled = true;
  }
  prevButton.addEventListener('click', () => {
    if (currentPageEquipos > 1) {
      currentPageEquipos--;
      console.log(`[Paginador Equipos] Clic en Anterior. Nueva página: ${currentPageEquipos}`);
      // Usa null, null para que cargar_tabla_con_filtros_equipos use los filtros globales persistidos
      cargar_tabla_con_filtros_equipos(tabla, null, null);
    }
  });
  paginatorContainer.append(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('paginator-btn');
    if (i === currentPageEquipos) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', () => {
      currentPageEquipos = i;
      console.log(`[Paginador Equipos] Clic en página ${i}. Nueva página: ${currentPageEquipos}`);
      cargar_tabla_con_filtros_equipos(tabla, null, null);
    });
    paginatorContainer.append(pageButton);
  }

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Siguiente';
  nextButton.classList.add('paginator-btn');
  if (currentPageEquipos === totalPages || totalPages === 0) {
    nextButton.disabled = true;
  }
  nextButton.addEventListener('click', () => {
    if (currentPageEquipos < totalPages) {
      currentPageEquipos++;
      console.log(`[Paginador Equipos] Clic en Siguiente. Nueva página: ${currentPageEquipos}`);
      cargar_tabla_con_filtros_equipos(tabla, null, null);
    }
  });
  paginatorContainer.append(nextButton);
  console.log(`[Paginador Equipos] Renderizado. Total de equipos filtrados: ${totalFilteredEquipos}, Páginas: ${totalPages}, Página actual: ${currentPageEquipos}`);
};

/**
 * Agrega event listeners a los botones de acción dentro de la tabla de equipos (Editar, Eliminar).
 */
export const agregarEventosBotonesEquipos = async (tabla) => {
  // La tabla se pasa como argumento, asegurando que el listener se adjunte al elemento correcto
  if (!tabla) {
    console.error("Tabla de equipos no encontrada para adjuntar eventos a botones.");
    return;
  }

  tabla.addEventListener('click', async (e) => {
    if (e.target.classList.contains('eliminar')) {
      const equipoId = e.target.dataset.id;

      console.log(`[mostrarTablaEquipos] Iniciando eliminación de equipo con ID: ${equipoId}`);
      await eliminar_equipos_por_id(equipoId);
      // Forzar recarga de todos los equipos después de la eliminación.
      await forceReloadAllEquipos();

    }
    if (e.target.classList.contains('editar')) {
      const equipoId = e.target.dataset.id;
      console.log("Editar equipo con ID:", equipoId);
      location.hash = `#editarEquipo/${equipoId}`;
    }
  });
};