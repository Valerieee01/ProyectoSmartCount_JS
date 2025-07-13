import { encabezados } from "../../helpers/solicitudes";

const buscar_personas_por_id = async (id) => {
  const solicitud = await fetch(`http://localhost:3000/api/personas/${id}`, {
          headers: encabezados
    });
    const respuesta = await solicitud.json();
    return respuesta;
}

export default buscar_personas_por_id;
