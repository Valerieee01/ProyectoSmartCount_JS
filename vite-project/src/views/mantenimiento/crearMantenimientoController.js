// src/controllers/crearClienteController.js

import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes.js";
import { forceReloadAllMantenimientos } from "./mostrarTabla.js";
import { error, success } from "../../helpers/alerts.js";
import listarEquipos from "../../casos_de_uso/Equipos/listarEquipos.js";
import listarEmpleados from "../../casos_de_uso/Empleados/listarEmpleados.js";

export const initCrearMantenimientosForm = async () => {

    const form = document.querySelector('#mantenimientoForm');
    const id_equipo_select = document.querySelector('#id_equipo')
    const id_empleado_select = document.querySelector('#id_empleado')
    const tipo_mantenimiento_select = document.querySelector('#tipo_mantenimiento')
    const fecha_mantenimiento_select = document.querySelector('#fecha_mantenimiento')
    const descripcion_trabajo = document.querySelector('#descripcion_trabajo')
    const observaciones = document.querySelector('#observaciones')

  if (id_equipo_select) {
    try {
      const response = await listarEquipos();
      const equipos = response.data;

      if (equipos && equipos.length > 0) {
        equipos.forEach(empleado => {
          const option = document.createElement('option');
          option.value = empleado.id_equipo;
          option.textContent = empleado.numero_equipo;
          id_equipo_select.appendChild(option);
        });
        console.log("[editarControllerManteenimiento] Select 'id_persona_existente' cargado con", equipos.length, "equipos.");
      } else {
        console.log("[editarControllerManteenimiento] No se encontraron equipos para cargar en el select.");
      }
    } catch (error) {
      console.error("[editarControllerManteenimiento] Error al cargar equipos para el select:", error);
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "Error al cargar Mantenimientos";
      id_equipo_select.appendChild(option);
      id_equipo_select.disabled = true;
    }
  }

  if (id_empleado_select) {
    try {
      const response = await listarEmpleados();
      const empleados = response.data;

      if (empleados && empleados.length > 0) {
        empleados.forEach(cliente => {
          const option = document.createElement('option');
          option.value = cliente.id_persona;
          option.textContent = cliente.nombre_completo_razon_social;
          id_empleado_select.appendChild(option);
        });
        console.log("[editarControllerManteenimiento] Select 'id_persona_existente' cargado con", empleados.length, "empleados.");
      } else {
        console.log("[editarControllerManteenimiento] No se encontraron empleados para cargar en el select.");
      }
    } catch (error) {
      console.error("[editarControllerManteenimiento] Error al cargar empleados para el select:", error);
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "Error al cargar Empleados";
      id_empleado_select.appendChild(option);
      id_empleado_select.disabled = true;
    }
  }

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
                forceReloadAllMantenimientos();
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