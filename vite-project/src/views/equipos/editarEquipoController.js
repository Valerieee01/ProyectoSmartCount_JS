import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes";
import { error, success } from "../../helpers/alerts";
import { forceReloadAllEquipos } from "./mostrarTabla";
export const editarEquipoController = (a) => {

  // Declaración de variables
  const form = document.querySelector('#equipoForm');
  const numeroEquipo = document.querySelector("#numero_equipo");
  const placa = document.querySelector("#placa");
  const descripcion = document.querySelector("#descripcion");
  const id_cliente = document.querySelector("#id_cliente");


  // Declaración de métodos
  const enviar = async (e) => {
    e.preventDefault()
    const data = {
      numero_equipo: numeroEquipo.value,
      placa: placa.value,
      descripcion: descripcion.value,
      id_cliente: id_cliente.value
    }
    const request = await fetch(`http://localhost:3000/api/equipos/${a.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: encabezados,
    });
    const response = await request.json();
    // --- Paso 4: Manejar la respuesta del servidor ---
    if (response.success) {
      form.reset();
      const alert = await success(response);
      console.log(alert);
      forceReloadAllEquipos()
      location.hash = "#equipos";
    } else {
      console.error("Error de la API:", response);
      error(response);
    }
  }

  // Declaración de eventos
  form.addEventListener('submit', enviar)
}