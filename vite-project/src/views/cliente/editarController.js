import { encabezados } from "../../helpers/solicitudes";
import { editarClienteController } from "./editarClienteController.js";

export const editarControllerCat = async (a) => {
    alert("entrando a editar cliente")
    // declaracion de variables
    const form = document.querySelector('#clientForm');
    const nombre_completo_razon_social = form.querySelector('#nombre_completo_razon_social')
    const id_tipo_identificacion = form.querySelector('#id_tipo_identificacion')
    const numero_identificacion = form.querySelector('#numero_identificacion')
    const correo = form.querySelector('#correo')
    const telefono = form.querySelector('#telefono')
    const direccion = form.querySelector('#direccion')
    const id_ciudad = form.querySelector('#id_ciudad')
    const estado = form.querySelector('#estado')

    // Solicitud a la API
    const request = await fetch(`http://localhost:3000/api/personas/${a.id}`, {
        method: 'GET',
        headers: encabezados
    });
    const { data } = await request.json();
    console.log(data);
    

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