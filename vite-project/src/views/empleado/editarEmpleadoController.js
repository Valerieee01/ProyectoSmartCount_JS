import Swal from "sweetalert2";
import { encabezados } from "../../helpers/solicitudes";
export const editarEmpleadoController =  (a) => {
    
    // Declaración de variables
      const nombre_completo_razon_social = document.querySelector('#nombre_completo_razon_social')
    const id_tipo_identificacion = document.querySelector('#id_tipo_identificacion')
    const numero_identificacion = document.querySelector('#numero_identificacion')
    const correo = document.querySelector('#correo')
    const telefono = document.querySelector('#telefono')
    const direccion = document.querySelector('#direccion')
    const id_ciudad = document.querySelector('#id_ciudad')
    const estado = document.querySelector('#estado')


    // Declaración de métodos
    const enviar = async (e) => {
        e.preventDefault()
        const data = {
            nombre_completo_razon_social: nombre_completo_razon_social.value,
            id_tipo_identificacion: id_tipo_identificacion.value,
            numero_identificacion: numero_identificacion.value,
            correo: correo.value,
            telefono: telefono.value,
            direccion: direccion.value,
            id_ciudad: id_ciudad.value,
            estado: estado.value
        }
        const request = await fetch(`http://localhost:3000/api/personas/${a.id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: encabezados,
        });
        const response = await request.json();
        if (response.success) {
            form.reset()
             Swal.fire({
                title: 'Muy bien!',
                text: response.message,
                icon: 'success',
                confirmButtonText: 'Cool'
            })
            location.hash = "#clientes";
        }else{
            console.log(response);   
            Swal.fire({
                title: 'Error!',
                text: response.message,
                icon: 'error',
                confirmButtonText: 'Cool'
            })
         
        }        
    }

    // Declaración de eventos
    form.addEventListener('submit', enviar)    
}