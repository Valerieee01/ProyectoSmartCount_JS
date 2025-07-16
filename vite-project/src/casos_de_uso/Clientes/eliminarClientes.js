import Swal from "sweetalert2";
import { refrescarAccessToken } from "../../helpers/solicitudesRefresh.js";
import { encabezados } from "../../helpers/solicitudes.js"

export const eliminar_clientes_por_id = async (id) => {
  const request = await fetch(`http://localhost:3000/api/clientes/${id}`, {
    method: 'DELETE',
    headers: encabezados

  });
  const response = await request.json();
  if (response.success) {
    Swal.fire({
      title: 'Muy bien!',
      text: response.message,
      icon: 'success',
      confirmButtonText: 'Cool'
    })
    location.hash = "#cliente";
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

export default eliminar_clientes_por_id;