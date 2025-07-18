import listarEmpleados from "../../casos_de_uso/Empleados/listarEmpleados.js";
import listarEquipos from "../../casos_de_uso/Equipos/listarEquipos.js";
import { encabezados } from "../../helpers/solicitudes";
import { editarMantenimientoController } from "./editarMantenimientoController.js";

export const editarControllerMnto = async (a) => {

    // declaracion de variables
    const form = document.querySelector('#mantenimientoForm');
    const id_equipo_select = document.querySelector('#id_equipo')
    const id_empleado_select = document.querySelector('#id_empleado')
    const tipo_mantenimiento_select = document.querySelector('#tipo_mantenimiento')
    const fecha_mantenimiento = document.querySelector('#fecha_mantenimiento')
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
      option.textContent = "Error al cargar Empleados";
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

  
  // Solicitud a la API
  const request = await fetch(`http://localhost:3000/api/mantenimientos/${a.id}`, {
      method: 'GET',
      headers: encabezados
    });
    const { data } = await request.json();

    // --- ¡CORRECCIÓN CLAVE PARA LA FECHA! ---
           if (data.fecha_mantenimiento) {
            const dateObj = new Date(data.fecha_mantenimiento);
            
            // --- LOGS DE DEPURACIÓN DE OBJETO FECHA ---
            console.log("[cargarDatosMantenimientoParaEdicion] Objeto Date creado:", dateObj);
            console.log("[cargarDatosMantenimientoParaEdicion] Es una fecha válida?", !isNaN(dateObj.getTime())); // Verifica si es "Invalid Date"

            if (!isNaN(dateObj.getTime())) { // Solo formatea si es una fecha válida
                const formattedDate = dateObj.toISOString().split('T')[0];
                fecha_mantenimiento.value = formattedDate;
                console.log("[cargarDatosMantenimientoParaEdicion] Fecha formateada para input:", formattedDate);
            } else {
                console.warn("[cargarDatosMantenimientoParaEdicion] Fecha recibida no es válida para formatear:", mantenimientoData.fecha_mantenimiento);
                fecha_mantenimiento.value = ''; // Limpiar el input si la fecha no es válida
            }
        } else {
            fecha_mantenimiento.value = '';
            console.log("[cargarDatosMantenimientoParaEdicion] fecha_mantenimiento es nula o indefinida.");
        }

    //Llenando los campos
    id_equipo_select.value = data.id_equipo;
    id_empleado_select.value = data.id_empleado;
    tipo_mantenimiento_select.value = data.tipo_mantenimiento;
    fecha_mantenimiento.value = data.fecha_mantenimiento;
    descripcion_trabajo.value = data.descripcion_trabajo;
    observaciones.value = data.observaciones;

    editarMantenimientoController(a)

}