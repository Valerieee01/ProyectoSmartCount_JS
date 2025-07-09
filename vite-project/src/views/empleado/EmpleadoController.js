import { agregarEventosBotones, cargar_tabla } from "./mostrarTabla";

export const empleadoController = async () => {
    const tabla = document.querySelector("#tableEmpleados");
        
        if (!tabla) {
            console.error("No se encontró la tabla");
            return;
        }
    
        try {
            await cargar_tabla(tabla);
            await agregarEventosBotones();
        } catch (error) {
            console.error("Error en productoController:", error);
        }
}