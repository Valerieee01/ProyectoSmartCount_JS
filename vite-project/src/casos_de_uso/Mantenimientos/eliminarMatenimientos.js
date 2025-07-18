import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes";

export const eliminar_mantenimientos_por_id = async (id) => {
  const request = await fetch(`http://localhost:3000/api/mantenimientos/${id}`, {
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
    location.hash = "#equipos";
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

export default eliminar_mantenimientos_por_id;