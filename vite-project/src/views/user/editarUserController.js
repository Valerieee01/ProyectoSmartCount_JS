import Swal from "sweetalert2";


import { encabezados } from "../../helpers/solicitudes";
import { error, success } from "../../helpers/alerts";

export const editarUserController = async (idUsuario) => {
    const form = document.querySelector('#userEditForm');

    const nombreCompleto = document.querySelector('#nombreCompleto');
    const correo = document.querySelector('#correo');
    const contrasena_input= document.querySelector('#contrasena');
    const contrasenaConfirm_input = document.querySelector('#confirmar_contrasena');
    const id_rol = document.querySelector('#id_rol');
    const estado = document.querySelector('#estado');
          

    const enviar = async (e) => {
        e.preventDefault();

        const newPassword = contrasena_input.value.trim();
        const confirmPassword = contrasenaConfirm_input.value.trim();

        if (newPassword !== "" || confirmPassword !== "") { // Si el usuario intentó cambiar la contraseña
            if (newPassword !== confirmPassword) {
                Swal.fire({
                    title: '¡ERROR!',
                    text: "Las contraseñas no coinciden.",
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return; // Detiene el envío
            }
            
            if (newPassword.length < 6) { // Validación de longitud mínima (debe coincidir con el backend)
                Swal.fire({
                    title: '¡ERROR!',
                    text: "La nueva contraseña debe tener al menos 6 caracteres.",
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return; // Detiene el envío
            }

            // Regex para al menos un número
            const hasNumber = /[0-9]/.test(newPassword);
            // Regex para al menos un carácter especial
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(newPassword);

            if (!hasNumber) {
                Swal.fire({
                    title: '¡ERROR!',
                    text: "La contraseña debe contener al menos un número.",
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return; // Detiene el envío
            }
            if (!hasSpecialChar) {
                Swal.fire({
                    title: '¡ERROR!',
                    text: "La contraseña debe contener al menos un carácter especial (ej. !@#$%^&*).",
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return; // Detiene el envío
            }
        }
  
        const data = {
            nombreCompleto: nombreCompleto.value,
            correo: correo.value,
            id_rol: parseInt(id_rol.value),
            estado: estado.value,
        };

        // Solo enviar contraseña si se escribió
        if (contrasena_input.value.trim() !== "") {
            data.contrasena = newPassword;
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
                await success(result);
                location.hash = "#user/me";
            } else {
                console.error("Error en respuesta:", result);
                await error(result);
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            error({ message: "Error de red o del servidor." });
        }
    };

    form.addEventListener('submit', enviar);
};
