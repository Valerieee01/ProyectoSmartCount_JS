import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes";
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
    const request = await fetch(`http://localhost:3000/api/personas/${a.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: encabezados,
    });
    const response = await request.json();
    if (response.success) {
      form.reset()
      Swal.fire({
        title: 'Muy bien!',
        text: response.message,
        icon: 'success',
        confirmButtonText: 'Cool'
      })
      location.hash = "#Equipos";
    } else {
      console.log(response);
      Swal.fire({
        title: 'Error!',
        text: response.message,
        icon: 'error',
        confirmButtonText: 'Cool'
      })

    }
  }

  // Declaración de eventos
  form.addEventListener('submit', enviar)
}