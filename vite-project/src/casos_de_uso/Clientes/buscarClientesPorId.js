import { encabezados } from "../../helpers/solicitudes";

const buscar_clientes_por_id = async (id) => {
  const solicitud = await fetch(`http://localhost:3000/api/clientes/${id}`, {
    headers: encabezados
  });
  const respuesta = await solicitud.json();
  return respuesta;
}

export default buscar_clientes_por_id;

