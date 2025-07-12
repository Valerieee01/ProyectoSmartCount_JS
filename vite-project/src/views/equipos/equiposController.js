// src/controllers/equiposController.js

// Importa las funciones y variables necesarias desde el nuevo módulo 'mostrarTablaEquipos.js'.
import { 
    agregarEventosBotonesEquipos, 
    cargar_tabla_equipos, 
    cargar_tabla_con_filtros_equipos, 
    setCurrentPageEquipos // Función para controlar la página actual
} from "./mostrarTabla.js"; 

/**
 * Controlador principal para la vista de listado de equipos.
 * Se ejecuta cuando la ruta de equipos está activa (ej. #equipos).
 */
export const initEquiposController = async () => {
    const tabla = document.querySelector("#tableEquipos"); // Asegúrate que el ID coincida con tu HTML

    if (!tabla) {
        console.error("Error: No se encontró el elemento HTML con ID 'tableEquipos'.");
        return;
    }

    try {
        // Carga la tabla inicialmente con todos los equipos y la primera página.
        await cargar_tabla_equipos(tabla);
        
        // Agrega los event listeners a los botones de "Editar" y "Eliminar" en la tabla de equipos.
        await agregarEventosBotonesEquipos(tabla);

        // --- Lógica del Buscador ---
        // Obtener referencias a los elementos del buscador de equipos.
        const numeroEquipoInput = document.getElementById("numero_equipo_buscar");
        const placaInput = document.getElementById("placa_buscar");
        const buscarBtn = document.querySelector(".buscadorContenedor .buscarTabla"); // Selector más específico si hay varios botones 'buscarTabla'

        // Adjuntar un event listener al botón "Buscar".
        if (buscarBtn) {
            buscarBtn.addEventListener('click', async (e) => {
                e.preventDefault(); 
                console.log("[equiposController] Botón 'Buscar' clickeado. Aplicando filtros de equipos...");

                const numeroEquipoBusqueda = numeroEquipoInput.value.trim();
                const placaBusqueda = placaInput.value.trim();

                // Llamar a la función auxiliar para aplicar los filtros.
                await applyEquiposFilters(tabla, numeroEquipoBusqueda, placaBusqueda);
            });
        }
        
        // --- Lógica del botón "Crear Equipo" ---
        const crearEquipoBtn = document.querySelector('a[href="#crearEquipo"]');
        if (crearEquipoBtn) {
            crearEquipoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                location.hash = '#crearEquipo'; // Redirige a la ruta de creación de equipo
            });
        }

    } catch (error) {
        console.error("Error en equiposController durante la inicialización:", error);
    }
};

/**
 * Función auxiliar para aplicar los filtros a la tabla de equipos.
 * Esta función es llamada por el event listener del botón 'Buscar'.
 * @param {HTMLElement} tabla - El elemento HTML de la tabla de equipos.
 * @param {string} numeroEquipo - El texto de búsqueda por número de equipo.
 * @param {string} placa - El texto de búsqueda por placa.
 */
const applyEquiposFilters = async (tabla, numeroEquipo, placa) => {
    // Es CRUCIAL resetear la página actual a 1 cada vez que se aplican nuevos filtros.
    setCurrentPageEquipos(1); 

    // Llama a la función de 'mostrarTablaEquipos.js' que se encarga de aplicar los filtros 
    // sobre los datos ya cargados y renderizar la tabla con la paginación.
    await cargar_tabla_con_filtros_equipos(tabla, numeroEquipo, placa);
};