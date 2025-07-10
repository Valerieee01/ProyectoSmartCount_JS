import eliminar_proveedores_por_id from "../../casos_de_uso/Proveedores/eliminarProveedores";
import listarProveedores from "../../casos_de_uso/Proveedores/listarProveedores";



// --- Variables para la paginación ---
const ITEMS_PER_PAGE = 5; // Define cuántos proveedores mostrar por página
let currentPage = 1;      // Página actual, inicia en la primera
let allProveedores = [];      // Almacenará todos los proveedores obtenidos de la API

export const cargar_tabla = async (tabla) => {
    try {
        // Solo lista los proveedores una vez y los guarda
        if (allProveedores.length === 0) { // Si aún no se han cargado, cárgalos
            const response = await listarProveedores();
            allProveedores = response.data; // Asume que los datos están en 'response.data'
            console.log("Todos los proveedores cargados:", allProveedores);
        }

        const tBody = tabla.querySelector("tbody");
        tBody.innerHTML = ''; // Limpia el cuerpo de la tabla

        // Calcular qué proveedores mostrar en la página actual
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const proveedorToDisplay = allProveedores.slice(startIndex, endIndex);

        proveedorToDisplay.forEach(proveedor => {
            crearFila(proveedor, tabla);
        });

        // Crear y actualizar los controles del paginador
        renderPaginator(tabla);

    } catch (error) {
        console.error("Error al cargar la tabla de proveedores:", error);
        // Podrías añadir un mensaje al usuario aquí
    }
};

export const crearFila = ({ id_persona, nombre_completo_razon_social, id_tipo_identificacion, numero_identificacion, correo, telefono }, tabla) => {
    // ... (Tu código actual de crearFila, sin cambios)
    const tBody = tabla.querySelector("tbody");
    const tr = tBody.insertRow(); // insertRow() sin argumento inserta al final, que es lo común en tablas
    const tdNobre = tr.insertCell(0);
    const tdTipoId = tr.insertCell(1);
    const tdNumId = tr.insertCell(2);
    const tdCorreo = tr.insertCell(3);
    const tdtelefono = tr.insertCell(4);
    const tdBotonera = tr.insertCell(5);

    // Agregar el contenido a las celdas
    tdNobre.textContent = nombre_completo_razon_social;
    // Aquí es importante que id_tipo_identificacion muestre el nombre del tipo, no el ID
    // Si id_tipo_identificacion es solo un ID numérico, necesitarías mapearlo a un nombre.
    // Por ahora, lo dejo como está:
    tdTipoId.textContent = id_tipo_identificacion;
    tdNumId.textContent = numero_identificacion;
    tdCorreo.textContent = correo;
    tdtelefono.textContent = telefono;

    const div = document.createElement("div");
    const btnEliminar = document.createElement("a");
    const btnEditar = document.createElement("a");

    btnEditar.setAttribute("data-id", id_persona);
    btnEditar.setAttribute("href", `#editarproveedor/${id_persona}`); // Cambiado a #editarproveedor si es de proveedores

    btnEliminar.setAttribute("data-id", id_persona);

    btnEditar.textContent = "Editar";
    btnEliminar.textContent = "Eliminar";

    div.classList.add("botonera");
    btnEditar.classList.add("btn", "btn--small", "editar"); // Corregido 'samall' a 'small'
    btnEliminar.classList.add("btn", "btn--small", "btn--danger", "eliminar"); // Corregido 'samall' a 'small'
    div.append(btnEditar, btnEliminar);
    tdBotonera.append(div);

    tr.setAttribute("id", `client_${id_persona}`); // Cambiado a client_${id} para ser específico
};

// --- Función para renderizar el paginador ---
const renderPaginator = (tabla) => {
    const totalPages = Math.ceil(allProveedores.length / ITEMS_PER_PAGE);
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
    const tabla = document.querySelector("#tableProveedores");
    tabla.addEventListener('click', async (e) => {
        if (e.target.classList.contains('eliminar')) {
            if (confirm("¿Estás seguro de eliminar este proveedor?")) {
                await eliminar_proveedores_por_id(e.target.dataset.id);
                // Si eliminas, debes recargar TODOS los proveedores para que el paginador sea preciso
                allProveedores = []; // Vacía la lista de proveedores para forzar una recarga completa
                currentPage = 1; // Vuelve a la primera página después de eliminar
                await cargar_tabla(tabla);
            }
        }
        // Puedes añadir aquí la lógica para el botón de editar
        if (e.target.classList.contains('editar')) {
            // El href ya maneja la navegación, pero si necesitas JS adicional:
            // const proveedorId = e.target.dataset.id;
            // console.log("Editar proveedor con ID:", proveedorId);
            // location.hash = `#editarproveedor/${proveedorId}`; // Ya se maneja con el href
        }
    });
};