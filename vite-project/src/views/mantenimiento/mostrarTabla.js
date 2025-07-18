import eliminar_mantenimientos_por_id from "../../casos_de_uso/Mantenimientos/eliminarMatenimientos.js";
import listarMantenimientos from "../../casos_de_uso/Mantenimientos/listarMantenimientos.js";


// --- Variables para la paginación ---
const ITEMS_PER_PAGE = 4; // Define cuántos equipos mostrar por página
let currentPage = 1;      // Página actual, inicia en la primera
let allMantenimientos = [];      // Almacenará todos los equipos obtenidos de la API

export const cargar_tabla = async (tabla) => {
    try {
        // Solo lista los equipos una vez y los guarda
        if (allMantenimientos.length === 0) { // Si aún no se han cargado, cárgalos
            const response = await listarMantenimientos();
            allMantenimientos = response.data; // Asume que los datos están en 'response.data'
            console.log("Todos los equipos cargados:", allMantenimientos);
        }

        const tBody = tabla.querySelector("tbody");
        tBody.innerHTML = ''; // Limpia el cuerpo de la tabla

        // Calcular qué equipos mostrar en la página actual
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const equiposToDisplay = allMantenimientos.slice(startIndex, endIndex);

        equiposToDisplay.forEach(equipo => {
            crearFila(equipo, tabla);
        });

        // Crear y actualizar los controles del paginador
        renderPaginator(tabla);

    } catch (error) {
        console.error("Error al cargar la tabla de equipos:", error);
    }
};

export const crearFila = ({id_mantenimiento, id_equipo, descripcion_trabajo, id_empleado ,tipo_mantenimiento, fecha_mantenimiento, observaciones}, tabla) => {
    // ... (Tu código actual de crearFila, sin cambios)
    const tBody = tabla.querySelector("tbody");
    const tr = tBody.insertRow(); // insertRow() sin argumento inserta al final, que es lo común en tablas
    const tdnUmEquipo = tr.insertCell(0);
    const tdDescripcioTrabajo = tr.insertCell(1);
    const tdEmpleado = tr.insertCell(2);
    const tdTipoManto = tr.insertCell(3);
    const tdFechaManto = tr.insertCell(4);
    const tdObservaciones = tr.insertCell(5);
    const tdBotonera = tr.insertCell(6);

    // Agregar el contenido a las celdas
    tdnUmEquipo.textContent = id_equipo;
    // Aquí es importante que id_tipo_identificacion muestre el nombre del tipo, no el ID
    // Si id_tipo_identificacion es solo un ID numérico, necesitarías mapearlo a un nombre.
    // Por ahora, lo dejo como está:
    tdDescripcioTrabajo.textContent = descripcion_trabajo; 
    tdEmpleado.textContent = id_empleado;
    tdTipoManto.textContent = tipo_mantenimiento;
    tdFechaManto.textContent = fecha_mantenimiento; 
    tdObservaciones.textContent = observaciones;
    
    const div = document.createElement("div");
    const btnEliminar = document.createElement("a");
    const btnEditar = document.createElement("a");
 
    btnEditar.setAttribute("data-id", id_mantenimiento);
    btnEditar.setAttribute("href", `#editarMantenimiento/${id_mantenimiento}`); // Cambiado a #editarcliente si es de equipos

    btnEliminar.setAttribute("data-id", id_mantenimiento);
 
    btnEditar.textContent = "Editar";
    btnEliminar.textContent = "Eliminar";
 
    div.classList.add("botonera");
    btnEditar.classList.add("btn", "btn--small", "editar"); // Corregido 'samall' a 'small'
    btnEliminar.classList.add("btn", "btn--small", "btn--danger", "eliminar"); // Corregido 'samall' a 'small'
    div.append(btnEditar, btnEliminar);
    tdBotonera.append(div);
 
    tr.setAttribute("id", `client_${id_mantenimiento}`); // Cambiado a client_${id} para ser específico
};

// --- Función para renderizar el paginador ---
const renderPaginator = (tabla) => {
    const totalPages = Math.ceil(allMantenimientos.length / ITEMS_PER_PAGE);
    const paginatorContainer = document.querySelector("#paginator"); // Asegúrate de tener este div en tu HTML

    if (!paginatorContainer) {
        console.error("Contenedor del paginador (#paginator) no encontrado.");
        return;
    }

    paginatorContainer.innerHTML = ''; // Limpia el paginador existente

    // Botón Anterior
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.classList.add('paginator-btn');
    if (currentPage === 1) {
        prevButton.disabled = true;
    }
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            cargar_tabla(tabla); // Recarga la tabla con la nueva página
        }
    });
    paginatorContainer.append(prevButton);

    // Botones de número de página
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('paginator-btn');
        if (i === currentPage) {
            pageButton.classList.add('active'); // Clase para la página actual
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            cargar_tabla(tabla); // Recarga la tabla con la nueva página
        });
        paginatorContainer.append(pageButton);
    }

    // Botón Siguiente
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.classList.add('paginator-btn');
    if (currentPage === totalPages) {
        nextButton.disabled = true;
    }
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            cargar_tabla(tabla); // Recarga la tabla con la nueva página
        }
    });
    paginatorContainer.append(nextButton);
};


export const agregarEventosBotones = async () => {
    const tabla = document.querySelector("#tableMantenimientos");
    tabla.addEventListener('click', async (e) => {
       
                await eliminar_equipos_por_id(e.target.dataset.id);
                allClients = []; // Vacía la lista de equipos para forzar una recarga completa
                currentPage = 1; // Vuelve a la primera página después de eliminar
                await cargar_tabla(tabla); 
    
        // Puedes añadir aquí la lógica para el botón de editar
        if (e.target.classList.contains('editar')) {
            // El href ya maneja la navegación, pero si necesitas JS adicional:
             const mantenimientoId = e.target.dataset.id;
             console.log("Editar Mantenimiento con ID:", mantenimientoId);
             location.hash = `#editarMantenimiento/${mantenimientoId}`; // Ya se maneja con el href
        }
    });
};