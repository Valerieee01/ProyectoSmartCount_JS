import { encabezados } from "../../helpers/solicitudes";

export const eliminar_pagos_por_id = async (id) => {
    fetch(`http://localhost:3000/api/pagos/${id}`, {
      method: 'DELETE',
          headers: encabezados

    });
}

export default eliminar_pagos_por_id;