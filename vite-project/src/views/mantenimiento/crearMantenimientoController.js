// src/controllers/crearClienteController.js

import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes.js";
import { cargar_tabla } from "./mostrarTabla.js";
import listarPersonas from "../../casos_de_uso/Personas/listarPersonas.js";
import { error, success } from "../../helpers/alerts.js";

export const initCrearMantenimientosForm = async () => {

    const form = document.querySelector('#mantenimientoForm');
    const id_equipo_select = document.querySelector('#id_equipo')
    const id_empleado_select = document.querySelector('#id_empleado')
    const tipo_mantenimiento_select = document.querySelector('#tipo_mantenimiento')
    const fecha_mantenimiento_select = document.querySelector('#fecha_mantenimiento')
    const descripcion_trabajo = document.querySelector('#descripcion_trabajo')
    const observaciones = document.querySelector('#observaciones')

    const enviar = async (e) => {
        e.preventDefault();
        const data = {
             id_equipo : id_equipo_select.value,
             id_empleado: id_empleado_select.value,
             tipo_mantenimiento: tipo_mantenimiento_select.value,
             fecha_mantenimiento: fecha_mantenimiento_select.value,
             descripcion_trabajo: descripcion_trabajo.value,
             observaciones: observaciones.value

        }

        try {
            const request = await fetch('http://localhost:3000/api/mantenimientos', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: encabezados
            });
            const response = await request.json();

            // --- Paso 4: Manejar la respuesta del servidor ---
            if (response.success) {
                form.reset();
                success(response);
                location.hash = "#mantenimiento";
            } else {
                console.error("Error de la API:", response);
                error(response);
            }
        } catch (error) {
            console.error("[initCreaEmpleadoeForm] Error al enviar el formulario (fetch):", error);
            Swal.fire({
                title: '¡Error!',
                text: `No se pudo conectar con el servidor: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    form.addEventListener('submit', enviar);
};