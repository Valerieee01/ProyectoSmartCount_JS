// src/controllers/userController.js

import {
    updateAuthenticatedUserProfile,
    deleteAuthenticatedUserProfile,
    getAuthenticatedUserProfile
} from '../../casos_de_uso/usuario/obtenerUsuario.js'; // Asegúrate de que esta ruta sea correcta para tu archivo API

import { cleanLocalStorage } from '../../helpers/auth.js';

export const initUserProfile = async () => {
    console.log("Inicializando vista de perfil de usuario...");

    const userNameSpan = document.querySelector('#userName');
    const userEmailSpan = document.querySelector('#userEmail');
    const userPasswordSpan = document.querySelector('#userPassword');
    const userRolSpan = document.querySelector('#userRol');
    const userEstadoSpan = document.querySelector('#userEstado');
    const profileMessageDiv = document.querySelector('#profileMessage');
    const deleteAccountBtn = document.querySelector('#deleteAccountBtn');
    const editProfileBtn = document.querySelector('#editProfileBtn');

    if (!userNameSpan || !deleteAccountBtn || !editProfileBtn) {
        console.error("Error: Algunos elementos esenciales del perfil de usuario no se encontraron en el DOM.");
        return;
    }


    if (!userNameSpan || !deleteAccountBtn || !editProfileBtn) {
        console.error("Error: Algunos elementos esenciales del perfil de usuario no se encontraron en el DOM.");
        return;
    }

    const loadUserProfile = async () => {
        try {
            const userData = await getAuthenticatedUserProfile();
            console.log(userData);


            if (userData) {
                userNameSpan.textContent = (userData.data).nombreCompleto || userData.nombreCompleto || 'No disponible';
                userEmailSpan.textContent = (userData.data).correo || 'No disponible';
                userPasswordSpan.textContent = (userData.data).contrasena || 'No disponible';
                userRolSpan.textContent = (userData.data).id_rol || 'No disponible';
                userEstadoSpan.textContent = (userData.data).estado || 'No disponible';

                if (userData?.data?.id_usuario) {
                    editProfileBtn.dataset.userId = (userData.data).id_usuario;
                    deleteAccountBtn.dataset.userId = (userData.data).id_usuario;
                }
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
        // Si el ID se necesita para la ruta de edición, asegúrate de que esté en el dataset
        const userId = e.target.dataset.userId;
        console.log(userId);
        location.hash = `#editarUser/me`;

    });

    deleteAccountBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const userId = e.target.dataset.userId;


            await deleteAuthenticatedUserProfile(userId);

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

    });

    await loadUserProfile();
};