// src/controllers/userController.js
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../api/userApi.js'; // Funciones de API
import { cleanLocalStorage } from '../helpers/auth.js'; // Para cerrar sesión después de eliminar cuenta
// Si tienes un sistema de notificaciones/alerts, impórtalo aquí
// import { showNotification } from '../utils/notifications.js'; 

/**
 * Inicializa la vista del perfil de usuario, carga los datos y adjunta eventos.
 */
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

    if (!userNameSpan) {
        console.error("Elementos del perfil de usuario no encontrados en el DOM.");
        return;
    }

    // 1. Cargar la información del usuario
    const loadUserProfile = async () => {
        try {
            // Asume que getUserProfile() obtiene el perfil del usuario autenticado (ej. /api/users/me)
            const userData = await getUserProfile(); 
            
            if (userData) {
                userNameSpan.textContent = userData.nombre_completo_razon_social || 'No disponible';
                userEmailSpan.textContent = userData.correo || 'No disponible';
                userTipoIdSpan.textContent = userData.tipo_identificacion_nombre || userData.id_tipo_identificacion || 'No disponible'; // Muestra el nombre si lo tienes, sino el ID
                userNumIdSpan.textContent = userData.numero_identificacion || 'No disponible';
                userPhoneSpan.textContent = userData.telefono || 'No disponible';
                // Puedes almacenar el ID del usuario si lo necesitas para editar/eliminar
                // editProfileBtn.dataset.userId = userData.id_usuario; // Asumiendo que el ID del usuario es 'id_usuario'
                // deleteAccountBtn.dataset.userId = userData.id_usuario;
            } else {
                profileMessageDiv.textContent = 'No se pudo cargar la información del usuario.';
                profileMessageDiv.className = 'message error';
            }
        } catch (error) {
            console.error("Error al cargar el perfil del usuario:", error);
            profileMessageDiv.textContent = `Error al cargar perfil: ${error.message}`;
            profileMessageDiv.className = 'message error';
        }
    };

    // 2. Adjuntar Event Listeners a los botones
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Asume que el ID del usuario puede ser recuperado del token o de la respuesta de getUserProfile
            // O si tu edición es para el usuario autenticado, no necesitas el ID en la ruta
            // location.hash = `#editarusuario/${editProfileBtn.dataset.userId || 'me'}`; 
            location.hash = `#editarusuario`; // Redirige a una vista/formulario de edición
            // Aquí puedes pasar el ID del usuario actual si es necesario para el formulario de edición
        });
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.")) {
                try {
                    // Asume que el ID del usuario puede ser recuperado del token o de la respuesta de getUserProfile
                    // Si tu API permite eliminar al usuario autenticado sin un ID explícito, mejor.
                    // await deleteUserProfile(deleteAccountBtn.dataset.userId || 'me'); 
                    await deleteUserProfile('me'); // O el ID real del usuario si lo obtuviste. Si backend necesita ID
                                                  // y no está en 'me', deberías pasarlo.

                    profileMessageDiv.textContent = 'Cuenta eliminada exitosamente. Redirigiendo...';
                    profileMessageDiv.className = 'message success';

                    // Limpiar la sesión del usuario (token, etc.)
                    cleanLocalStorage(); 
                    
                    // Redirigir a la página de inicio o login después de un breve retraso
                    setTimeout(() => {
                        location.hash = '#home'; // O '#login'
                        window.dispatchEvent(new Event('modificandoHeader')); // Para que el header se actualice
                    }, 2000); 

                } catch (error) {
                    console.error("Error al eliminar la cuenta:", error);
                    profileMessageDiv.textContent = `Error al eliminar cuenta: ${error.message}`;
                    profileMessageDiv.className = 'message error';
                }
            }
        });
    }

    // Cargar el perfil del usuario al inicializar la vista
    await loadUserProfile();
};