
import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes.js";
import { error, success } from "../../helpers/alerts.js";
import listarClientes from "../../casos_de_uso/Clientes/listarClientes.js";
import listarMantenimientos from "../../casos_de_uso/Mantenimientos/listarMantenimientos.js";
import { forceReloadAllPagos } from "./mostrarTabla.js";


export const initCrearPagosForm = async () => {

  const form = document.querySelector('#pagoForm');
  const id_cliente_select = document.querySelector('#id_cliente')
  const id_mantenimiento_select = document.querySelector('#id_mantenimiento')
  const valor_trabajo = document.querySelector('#valor_trabajo')
  const valor_pagado = document.querySelector('#valor_pagado')
  const fecha_facturacion = document.querySelector('#fecha_facturacion')
  const dias_plazo = document.querySelector('#dias_plazo')
  const estado_pago = document.querySelector('#estado_pago')
  const detalle = document.querySelector('#detalle')

  // 2. Validar que los elementos esenciales del formulario existen.
  if (!form || !id_cliente_select || !id_mantenimiento_select || !valor_trabajo || !valor_pagado) {
    console.error("[editarPagosController] Error: Elementos esenciales del formulario de pago no encontrados en el DOM.");
    error({ message: "No se pudo inicializar el formulario de edición. Faltan elementos HTML." });
    return;
  }

  if (id_cliente_select) {
    try {
      const response = await listarClientes();
      const clientes = response.data;

      if (clientes && clientes.length > 0) {
        clientes.forEach(cliente => {
          const option = document.createElement('option');
          option.value = cliente.id_persona;
          option.textContent = cliente.nombre_completo_razon_social;
          id_cliente_select.appendChild(option);
        });
      } else {
        console.log("[editarControllerManteenimiento] No se encontraron equipos para cargar en el select.");
      }
    } catch (error) {
      console.error("[editarControllerManteenimiento] Error al cargar equipos para el select:", error);
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "Error al cargar Mantenimientos";
      id_cliente_select.appendChild(option);
      id_cliente_select.disabled = true;
    }
  }

  if (id_mantenimiento_select) {
    try {
      const response = await listarMantenimientos();
      const mantenimientos = response.data;

      if (mantenimientos && mantenimientos.length > 0) {
        mantenimientos.forEach(manenimiento => {
          const option = document.createElement('option');
          option.value = manenimiento.id_mantenimiento;
          option.textContent = manenimiento.id_mantenimiento;
          id_mantenimiento_select.appendChild(option);
        });
      } else {
        console.log("[editarControllerManteenimiento] No se encontraron mantenimientos para cargar en el select.");
      }
    } catch (error) {
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "Error al cargar mantenimientos";
      id_mantenimiento_select.appendChild(option);
      id_mantenimiento_select.disabled = true;
    }
  }

  const enviar = async (e) => {
    e.preventDefault();

    const valorTrabajoNum = parseFloat(valor_trabajo.value);
    const valorPagadoNum = parseFloat(valor_pagado.value);
    const diasPlazoNum = parseInt(dias_plazo.value);

    // --- Validaciones de Frontend (antes de enviar al backend) ---
    // 1. Validar que los campos numéricos son realmente números
    if (isNaN(valorTrabajoNum) || valorTrabajoNum <= 0) {
      error({ title: 'Error de Validación', text: "El 'Valor del Trabajo' debe ser un número positivo." });
      Swal.fire({
        title: '¡ERROR!',
        text: "El 'Valor del Trabajo' debe ser un número positivo.",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    if (isNaN(valorPagadoNum) || valorPagadoNum < 0) {
      error({ title: 'Error de Validación', text: "El 'Valor Pagado' debe ser un número no negativo." });
      Swal.fire({
        title: '¡ERROR!',
        text: "El 'Valor Pagado' debe ser un número no negativo.",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    if (isNaN(diasPlazoNum) || diasPlazoNum < 0) {
      error({ title: 'Error de Validación', text: "Los 'Días de Plazo' deben ser un número no negativo." });
      Swal.fire({
        title: '¡ERROR!',
        text: "Los 'Días de Plazo' deben ser un número no negativo.",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // 2. Validar la condición específica: valor pagado no supera valor trabajo
    if (valorPagadoNum > valorTrabajoNum) {
      Swal.fire({
        title: '¡ERROR!',
        text: "El valor pagado no puede superar el valor del trabajo.",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return; // Detiene el envío si la validación falla
    }
    const data = {
      id_cliente: parseInt(id_cliente_select.value),
      id_mantenimiento: parseInt(id_mantenimiento_select.value),
      valor_trabajo: valorTrabajoNum,
      valor_pagado: valorPagadoNum,
      fecha_facturacion: fecha_facturacion.value,
      dias_plazo: diasPlazoNum,
      estado_pago: estado_pago.value,
      detalle: detalle.value

    }
    console.log(data);

    try {
      const request = await fetch('http://localhost:3000/api/pagos', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: encabezados
      });
      const response = await request.json();

      // --- Paso 4: Manejar la respuesta del servidor ---
      if (response.success) {
        form.reset();
        success(response);
        forceReloadAllPagos();
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