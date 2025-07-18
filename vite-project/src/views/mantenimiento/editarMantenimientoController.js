import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes.js";
import { error, success } from "../../helpers/alerts.js";
import { forceReloadAllMantenimientos } from "./mostrarTabla.js";

export const editarMantenimientoController = (a) => {

    const form = document.querySelector('#mantenimientoForm');
    const id_equipo_select = document.querySelector('#id_equipo')
    const id_empleado_select = document.querySelector('#id_empleado')
    const tipo_mantenimiento_select = document.querySelector('#tipo_mantenimiento')
    const fecha_mantenimiento_select = document.querySelector('#fecha_mantenimiento')
    const descripcion_trabajo = document.querySelector('#descripcion_trabajo')
    const observaciones = document.querySelector('#observaciones')


    // Declaración de métodos
    const enviar = async (e) => {
        e.preventDefault()
        const data = {
             id_equipo : id_equipo_select.value,
             id_empleado: id_empleado_select.value,
             tipo_mantenimiento: tipo_mantenimiento_select.value,
             fecha_mantenimiento: fecha_mantenimiento_select.value,
             descripcion_trabajo: descripcion_trabajo.value,
             observaciones: observaciones.value

        }
        const request = await fetch(`http://localhost:3000/api/mantenimientos/${a.id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: encabezados,
        });
        const response = await request.json();
        // --- Paso 4: Manejar la respuesta del servidor ---
        if (response.success) {
            form.reset();
            success(response);
            forceReloadAllMantenimientos();
            location.hash = "#mantenimiento";
        } else {
            console.error("Error de la API:", response);
            error(response);
        }
    }

    // Declaración de eventos
    form.addEventListener('submit', enviar)
}