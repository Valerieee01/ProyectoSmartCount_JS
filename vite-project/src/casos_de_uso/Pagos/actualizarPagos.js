import { encabezados } from "../../helpers/solicitudes";

const actualizar_proveedores = (id, data) => {
  fetch(`http://localhost:3000/api/proveedores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: encabezados
  })
    .then((response) => response.json())
    .then((json) => console.log(json));

}

export default actualizar_proveedores;

