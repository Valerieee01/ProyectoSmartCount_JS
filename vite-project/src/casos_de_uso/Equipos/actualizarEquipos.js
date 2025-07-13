import { encabezados } from "../../helpers/solicitudes";

const actualizar_equipos = (id, data) => {
  fetch(`http://localhost:3000/api/equipos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: encabezados
  })
    .then((response) => response.json())
    .then((json) => console.log(json));

}

export default actualizar_equipos;

