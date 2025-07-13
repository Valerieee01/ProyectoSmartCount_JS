// src/controllers/crearClienteController.js

import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes.js";
import { cargar_tabla } from "./mostrarTabla.js";

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
  const id_cliente = document.querySelector("#id_cliente");

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
        headers: {
          'Content-Type': 'application/json',
          encabezados
        },
      });
      const response = await request.json();

      if (response.success) {
        form.reset();
        Swal.fire({
          title: '¡Muy bien!',
          text: response.message || 'Empleado creado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        await cargar_tabla();
        location.hash = "#equipos";
      } else {
        console.error("[initCrearEquipoForm] Error de la API:", response);
        Swal.fire({
          title: '¡Error!',
          text: response.message || 'Ocurrió un error al crear el Empleado.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    } catch (error) {
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