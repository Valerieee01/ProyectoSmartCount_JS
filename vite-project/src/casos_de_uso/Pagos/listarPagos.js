import { encabezados } from "../../helpers/solicitudes";

const listarPagos = async () => {
  try {
    const envio = await fetch("http://localhost:3000/api/pagos", {
      headers: encabezados

    });
    const respuesta = await envio.json();
    return respuesta
  } catch (error) {
    console.error(error);
  }

}

export default listarPagos;