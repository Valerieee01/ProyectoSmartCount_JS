import { agregarEventosBotones, cargar_tabla } from "./mostrarTabla";

export const proveedoresController = async () => {
     const tabla = document.querySelector("#tableProveedores");
            
            if (!tabla) {
                console.error("No se encontró la tabla");
                return;
            }
        
            try {
                await cargar_tabla(tabla);
                await agregarEventosBotones();
            } catch (error) {
                console.error("Error en proveedoresController:", error);
            }
}