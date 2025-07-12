import { encabezados } from "../../helpers/solicitudes";
import { editarClienteController } from "./editarClienteController.js";

export const editarControllerCat = async (a) => {
    // declaracion de variables
    const nombre_completo_razon_social = document.querySelector('#nombre_completo_razon_social')
    const id_tipo_identificacion = document.querySelector('#id_tipo_identificacion')
    const numero_identificacion = document.querySelector('#numero_identificacion')
    const correo = document.querySelector('#correo')
    const telefono = document.querySelector('#telefono')
    const direccion = document.querySelector('#direccion')
    const id_ciudad = document.querySelector('#id_ciudad')
    const estado = document.querySelector('#estado')

    // Solicitud a la API
    const request = await fetch(`http://localhost:3000/api/cliente/${a.id}`,{
        method: 'GET',
        headers: encabezados
    });
    const { data } = await request.json();

    //Llenando los campos
    nombre_completo_razon_social.value = data.nombre_completo_razon_social;
    id_tipo_identificacion.value = data.id_tipo_identificacion;
    numero_identificacion.value = data.numero_identificacion;
    correo.value = data.correo;
    telefono.value = data.telefono;
    direccion.value = data.direccion;
    id_ciudad.value = data.id_ciudad;
    estado.value = data.estado;
    
    editarClienteController(a)

}