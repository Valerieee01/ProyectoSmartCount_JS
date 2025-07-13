import { encabezados } from "../../helpers/solicitudes";

const listarEmpleados = async () => {
    try {
      const envio = await fetch("http://localhost:3000/api/empleados", {
        headers: encabezados
        });
        const respuesta = await envio.json();
        return respuesta
      } catch (error) {
        console.error(error);
      }
    
}

export default listarEmpleados;