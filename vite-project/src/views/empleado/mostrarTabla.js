// src/controllers/mostrarTabla.js

import eliminar_empleados_por_id from "../../casos_de_uso/Empleados/eliminarEmpleados.js";
import listarEmpleados from "../../casos_de_uso/Empleados/listarEmpleados.js";

export const ITEMS_PER_PAGE = 4;
export let currentPage = 1;
export let allEmpleados = [];

let currentNameFilter = null; // Variable global para persistir el filtro de nombre
let currentStateFilter = null; // Variable global para persistir el filtro de estado

export const forceReloadAllEmpleados = async () => {
  allEmpleados = []; // Vacía la caché de Empleados.
  currentPage = 1; // Resetea a la primera página.

  const tabla = document.querySelector("#tableEmpleados");
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
    if (allEmpleados.length === 0) {
      const response = await listarEmpleados();
      allEmpleados = response.data;
      if (allEmpleados.length > 0) {
        // --- NUEVO LOG: Estructura de un empleado ---
        console.log("[mostrarTabla] Ejemplo de un objeto empleado:", allEmpleados[0]);
        console.log("[mostrarTabla] Propiedad 'nombre_completo_razon_social' del primer empleado:", allEmpleados[0].nombre_completo_razon_social);
        console.log("[mostrarTabla] Propiedad 'estado' del primer empleado:", allEmpleados[0].estado); // <-- ¡VERIFICA ESTE LOG!
      }
    }

    // Al cargar la tabla inicialmente o si se recarga todo, resetea los filtros globales.
    currentNameFilter = null;
    currentStateFilter = null;
    await cargar_tabla_con_filtros(tabla, null, null); // Llama sin filtros iniciales, que usarán los nulos

  } catch (error) {
    console.error("[mostrarTabla] Error al cargar la tabla de empleados inicialmente (desde API):", error);
    const tBody = tabla.querySelector("tbody");
    const numCols = tabla.querySelectorAll('th').length;
    tBody.innerHTML = `<tr><td colspan="${numCols}" style="text-align: center; padding: 20px; color: red;">
                            Error al cargar los empleados. Inténtalo de nuevo más tarde.</td></tr>`;
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


  const tBody = tabla.querySelector("tbody");
  tBody.innerHTML = '';

  let clientsToFilter = [...allEmpleados];

  // --- Lógica de Aplicación de Filtros (Prioridad: Nombre > Estado) ---

  if (currentNameFilter && currentNameFilter.trim() !== '') {
    const lowerCaseNameFilter = currentNameFilter.toLowerCase();
    clientsToFilter = clientsToFilter.filter(empleado =>
      empleado.nombre_completo_razon_social &&
      typeof empleado.nombre_completo_razon_social === 'string' &&
      empleado.nombre_completo_razon_social.toLowerCase().includes(lowerCaseNameFilter)
    );
  } else if (currentStateFilter && currentStateFilter !== '') { // <-- CONDICIÓN MEJORADA: solo verifica que no sea vacío.
    const lowerCaseEstadoFilter = currentStateFilter.toLowerCase();

    clientsToFilter = clientsToFilter.filter(empleado => {

      return empleado.estado && // Verifica que la propiedad 'estado' exista
        typeof empleado.estado === 'string' && // Asegura que es un string
        empleado.estado.toLowerCase() === lowerCaseEstadoFilter; // Compara
    });
    console.log(`[cargar_tabla_con_filtros] Filtrado solo por estado ('${currentStateFilter}'): ${clientsToFilter.length} resultados.`);
  } else {
    console.log("[cargar_tabla_con_filtros] No se aplicó ningún filtro (nombre y/o estado vacíos o nulos). Mostrando todos los empleados.");
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const clientsToDisplay = clientsToFilter.slice(startIndex, endIndex);

  console.log(`[cargar_tabla_con_filtros] empleados a mostrar en esta página (${currentPage}): ${clientsToDisplay.length}`);

  if (clientsToDisplay.length === 0) {
    const numCols = tabla.querySelectorAll('th').length;
    // Corregido: insertRow() para crear la fila y luego insertCell()
    const noResultsRow = tBody.insertRow();
    const noResultsCell = noResultsRow.insertCell(0);
    noResultsCell.colSpan = numCols;
    noResultsCell.textContent = "No se encontraron empleados con los filtros aplicados.";
    noResultsCell.style.textAlign = "center";
    noResultsCell.style.padding = "20px";
    noResultsCell.style.color = "#888";
  } else {
    clientsToDisplay.forEach(empleado => {
      crearFila(empleado, tabla);
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
    tr.classList.add('empleado-inactivo');
  }

  const div = document.createElement("div");
  const btnEliminar = document.createElement("a");
  const btnEditar = document.createElement("a");

  btnEditar.setAttribute("data-id", id_persona);
  btnEditar.setAttribute("href", `#editarEmpleado/${id_persona}`);

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
      // Usa null, null para que cargar_tabla_con_filtros use los filtros globales persistidos
      cargar_tabla_con_filtros(tabla, null, null);
    }
  });
  paginatorContainer.append(nextButton);
};


export const agregarEventosBotones = async () => {
  const tabla = document.querySelector("#tableEmpleados");

  if (!tabla) {
    console.error("Tabla de empleados no encontrada para adjuntar eventos a botones.");
    return;
  }

  tabla.addEventListener('click', async (e) => {
    if (e.target.classList.contains('eliminar')) {
      const empleadosId = e.target.dataset.id;
      await eliminar_empleados_por_id(empleadosId);
      allEmpleados = [];
      setCurrentPage(1);
      await cargar_tabla(tabla);
    }
    if (e.target.classList.contains('editar')) {
      const empleadosId = e.target.dataset.id;
      console.log("Editar empleado con ID:", empleadosId);
      location.hash = `#editarEmpleado/${empleadosId}`;
    }
  });
};