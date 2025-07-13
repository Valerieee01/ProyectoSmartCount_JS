import { encabezados } from "../../helpers/solicitudes";

export const eliminar_mantenimientos_por_id = async (id) => {
    fetch(`http://localhost:3000/api/mantenimientos/${id}`, {
      method: 'DELETE',
      headers: encabezados
    });
}

export default eliminar_mantenimientos_por_id;