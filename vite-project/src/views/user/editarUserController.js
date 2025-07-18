import Swal from "sweetalert2";


import { encabezados } from "../../helpers/solicitudes";
import { error, success } from "../../helpers/alerts";

export const editarUserController = async (idUsuario) => {
    const form = document.querySelector('#userEditForm');

    const nombreCompleto = document.querySelector('#nombreCompleto');
    const correo = document.querySelector('#correo');
    const contrasena = document.querySelector('#contrasena');
    const contrasenaConfirm = document.querySelector('#confirmar_contrasena');
    const rol = document.querySelector('#id_rol');
    const estado = document.querySelector('#estado');
          

    const enviar = async (e) => {
        e.preventDefault();

        if (contrasena.value !== contrasenaConfirm.value) {
            Swal.fire({
                title: '¡ERROR!',
                text: "Las contraseñas deben ser iguales.",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        const data = {
            nombreCompleto: nombreCompleto.value,
            correo: correo.value,
            id_rol: id_rol.value,
            estado: estado.value,
        };

        // Solo enviar contraseña si se escribió
        if (contrasena.value.trim() !== "") {
            data.contrasena = contrasena.value;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/user/${idUsuario}`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: encabezados,
            });

            const result = await response.json();

            if (result.code === 200 && !result.error) {
                form.reset();
                success(result);
                location.hash = "#user/me";
            } else {
                console.error("Error en respuesta:", result);
                error(result);
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            error({ message: "Error de red o del servidor." });
        }
    };

    form.addEventListener('submit', enviar);
};
