import { encabezados } from "../../helpers/solicitudes";
import { editarUserController } from "./editarUserController.js";

const censorEmail = (email) => {
    if (!email || typeof email !== 'string' || email.indexOf('@') === -1) {
        return 'Email no válido';
    }

    const [localPart, domain] = email.split('@');
    let censoredLocalPart;

    if (localPart.length <= 4) {
        censoredLocalPart = localPart.substring(0, 1) + '*****'; // Ej: j***
    } else {
        censoredLocalPart = localPart.substring(0, 2) + '*****' + localPart.substring(localPart.length - 2); // Ej: ju***lo
    }

    return `${censoredLocalPart}@${domain}`;
};


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
    correo.value = data.data.correo;
    rol.value = (data.data).id_rol;
    estado.value = (data.data).estado;
    
    editarUserController((data.data).id_usuario)

}