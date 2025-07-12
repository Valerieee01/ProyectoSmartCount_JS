// src/controllers/userController.js

import { 
    updateAuthenticatedUserProfile, 
    deleteAuthenticatedUserProfile, 
    getAuthenticatedUserProfile 
} from '../../casos_de_uso/usuario/obtenerUsuario.js';

import { cleanLocalStorage } from '../../helpers/auth.js';

export const initUserProfile = async () => {
    console.log("Inicializando vista de perfil de usuario...");

    const userNameSpan = document.querySelector('#userName');
    const userEmailSpan = document.querySelector('#userEmail');
    const userTipoIdSpan = document.querySelector('#userTipoId');
    const userNumIdSpan = document.querySelector('#userNumId');
    const userPhoneSpan = document.querySelector('#userPhone');
    const editProfileBtn = document.querySelector('#editProfileBtn');
    const deleteAccountBtn = document.querySelector('#deleteAccountBtn');
    const profileMessageDiv = document.querySelector('#profileMessage');

    if (!userNameSpan || !deleteAccountBtn || !editProfileBtn) {
        console.error("Error: Algunos elementos esenciales del perfil de usuario no se encontraron en el DOM.");
        return;
    }

    const loadUserProfile = async () => {
        try {
            const userData = await getAuthenticatedUserProfile();

            if (userData) {
                userNameSpan.textContent = userData.nombre_completo_razon_social || userData.nombreCompleto || 'No disponible';
                userEmailSpan.textContent = userData.correo || 'No disponible';
                userTipoIdSpan.textContent = userData.tipo_identificacion_nombre || userData.id_tipo_identificacion || 'No disponible';
                userNumIdSpan.textContent = userData.numero_identificacion || 'No disponible';
                userPhoneSpan.textContent = userData.telefono || 'No disponible';
            } else {
                profileMessageDiv.textContent = 'No se pudo cargar la información del usuario.';
                profileMessageDiv.className = 'message error';
            }
        } catch (error) {
            console.error("Error al cargar el perfil del usuario:", error);
            profileMessageDiv.textContent = `Error al cargar perfil: ${error.message}. Por favor, inicie sesión de nuevo.`;
            profileMessageDiv.className = 'message error';
        }
    };

    editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        location.hash = '#editarusuario';
    });

    deleteAccountBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        if (confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.")) {
            try {
                await deleteAuthenticatedUserProfile(); 

                profileMessageDiv.textContent = 'Cuenta eliminada exitosamente. Redirigiendo...';
                profileMessageDiv.className = 'message success';

                cleanLocalStorage();

                setTimeout(() => {
                    location.hash = '#home';
                    window.dispatchEvent(new Event('modificandoHeader'));
                }, 2000);
            } catch (error) {
                console.error("Error al eliminar la cuenta:", error);
                profileMessageDiv.textContent = `Error al eliminar cuenta: ${error.message}`;
                profileMessageDiv.className = 'message error';
            }
        }
    });

    await loadUserProfile();
};
