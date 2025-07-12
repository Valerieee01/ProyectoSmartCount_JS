import Swal from "sweetalert2";
export const crearPersonaController = () => {
    // Declaración de variables
    // Declaración de variables
    const form = document.querySelector('form');
    const nombre_completo_razon_social = document.querySelector('#nombre_completo_razon_social')
    const id_tipo_identificacion = document.querySelector('#id_tipo_identificacion')
    const numero_identificacion = document.querySelector('#numero_identificacion')
    const correo = document.querySelector('#correo')
    const telefono = document.querySelector('#telefono')
    const direccion = document.querySelector('#direccion')
    const id_ciudad = document.querySelector('#id_ciudad')
    const estado = document.querySelector('#estado')

    const idTipoIdentificacion = parseInt()
    
     
    // Declaración de métodos
    const enviar = async (e) => {
        alert('Ejecutando controlador')
        e.preventDefault()
        const data = {
             nombre_completo_razon_social: nombre_completo_razon_social.value,
            id_tipo_identificacion: parseInt(id_tipo_identificacion.value), // <-- Convertir a número
            numero_identificacion: numero_identificacion.value,
            correo: correo.value,
            telefono: telefono.value,
            direccion: direccion.value,
            id_ciudad: parseInt(id_ciudad.value), // <-- Convertir a número
            estado: estado.value // Asegúrate que el select 'estado' devuelve 'activo' o 'inactivo'
    
        }
        console.log(data);
        
        const request = await fetch('http://localhost:3000/api/personas', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
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
            location.hash = "#cliente";
        } else {
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