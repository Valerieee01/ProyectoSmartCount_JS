// src/controllers/crearClienteController.js

import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes.js";
import { cargar_tabla_equipos, forceReloadAllEquipos } from "./mostrarTabla.js";
import listarClientes from "../../casos_de_uso/Clientes/listarClientes.js";
import { error, success } from "../../helpers/alerts.js";

export const initCrearEquipoForm = async () => {
  console.log("[initCrearEquipoForm] Inicializando envío de formulario para nuevo cliente...");

  const form = document.querySelector('#equipoForm');

  if (!form) {
    console.error("[initCrearEquipoForm] Error: Formulario '#equipoForm' no encontrado en el DOM.");
    return;
  }

  const numeroEquipo = document.querySelector("#numero_equipo");
  const placa = document.querySelector("#placa");
  const descripcion = document.querySelector("#descripcion");
  const selectPersonaExistente = document.querySelector("#id_cliente");

  if (selectPersonaExistente) {
    try {
      const response = await listarClientes();
      const clientes = response.data;

      if (clientes && clientes.length > 0) {
        clientes.forEach(cliente => {
          const option = document.createElement('option');
          option.value = cliente.id_persona;
          option.textContent = cliente.nombre_completo_razon_social;
          selectPersonaExistente.appendChild(option);
        });
        console.log("[initCreaEmpleadoeForm] Select 'id_persona_existente' cargado con", clientes.length, "clientes.");
      } else {
        console.log("[initCreaEmpleadoeForm] No se encontraron clientes para cargar en el select.");
      }
    } catch (error) {
      console.error("[initCreaEmpleadoeForm] Error al cargar clientes para el select:", error);
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "Error al cargar Empleados";
      selectPersonaExistente.appendChild(option);
      selectPersonaExistente.disabled = true;
    }
  }

  const enviar = async (e) => {
    e.preventDefault();
    console.log("[initCrearEquipoForm] Formulario de creación enviado.");
    const data = {
      numero_equipo: numeroEquipo.value,
      placa: placa.value,
      descripcion: descripcion.value,
      id_cliente: id_cliente.value
    }
    try {
      const request = await fetch('http://localhost:3000/api/equipos', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: encabezados
      });
      const response = await request.json();

      // --- Paso 4: Manejar la respuesta del servidor ---
      if (response.success) {
        form.reset();
        success(response);
        forceReloadAllEquipos()
        location.hash = "#equipos";
      } else {
        console.error("Error de la API:", response);
        error(response);
      }
    } catch (error) {
      console.log(error);

      console.error("[initCrearEquipoForm] Error al enviar el formulario (fetch):", error);
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