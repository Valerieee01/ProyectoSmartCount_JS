import { encabezados } from "../../helpers/solicitudes";
import { editarUserController } from "./editarUserController.js";

export const editarControllerUser = async () => {
    // declaracion de variables
    const nombreCompleto = document.querySelector('#nombreCompleto')
    const correo = document.querySelector('#correo')
    const contrasena = document.querySelector('#contrasena')
    const contrasenaConfirm = document.querySelector('#confirmar_contrasena')
    const rol = document.querySelector('#id_rol')
    const estado = document.querySelector('#estado')

    // Solicitud a la API
    const request = await fetch(`http://localhost:3000/api/user/me`,{
        method: 'GET',
        headers: encabezados
    });
    const { data } = await request.json();

    console.log(data);
    
    //Llenando los campos
    nombreCompleto.value = (data.data).nombreCompleto;
    correo.value = (data.data).correo;
    contrasena.value = (data.data).contrasena;
    contrasenaConfirm.value = (data.data).contrasena;
    rol.value = (data.data).id_rol;
    estado.value = (data.data).estado;
    
    editarUserController((data.data).id_usuario)

}