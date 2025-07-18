import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes";

export const eliminar_pagos_por_id = async (id) => {
    console.log(id);
    
   
    const request = await fetch(`http://localhost:3000/api/pagos/${id}`, {
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
        location.hash = "#pagos";
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

export default eliminar_pagos_por_id;