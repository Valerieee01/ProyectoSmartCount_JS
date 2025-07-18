
// Asegúrate de que esta ruta sea correcta para tu función de encabezados
import { encabezados } from "../../helpers/solicitudes.js"; 

// Define la URL base de tu backend para usuarios
const API_BASE_URL = 'http://localhost:3000/api/user'; // Asegúrate que esta URL sea la correcta para tu API de usuarios

// Función para obtener el perfil del usuario autenticado
export const getAuthenticatedUserProfile = async () => {
    try {
        const token = localStorage.getItem('accessToken'); // O 'token' si es el nombre que usas
        if (!token) {
            throw new Error('No autenticado. Token no encontrado.');
        }

        const response = await fetch(`${API_BASE_URL}/me`, { // Endpoint para obtener el perfil del usuario autenticado
            method: 'GET',
            headers: encabezados // Obtiene los encabezados, incluyendo el Authorization Bearer token
        });

        
        
        if (!response.ok) {
            const errorData = await response.json(); // Intenta leer el cuerpo del error
            throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener el perfil.`);
        }
        const data = await response.json();                
        return data.data; 
    } catch (error) {
        console.error("Error en getAuthenticatedUserProfile (frontend API):", error);
        throw error; // Propaga el error para que el controlador lo maneje
    }
};

// Función para actualizar el perfil del usuario autenticado
export const updateAuthenticatedUserProfile = async (userData) => { // Recibe los datos a actualizar
    try {
        const token = localStorage.getItem('accessToken'); 
        if (!token) {
            throw new Error('No autenticado. Token no encontrado.');
        }

        // Endpoint para actualizar el perfil del usuario autenticado (ej. PUT /api/user/me)
        const response = await fetch(`${API_BASE_URL}/me`, { 
            method: 'PUT', 
            headers: encabezados, // Incluye Content-Type y Authorization
            body: JSON.stringify(userData) // Envía los datos del usuario como JSON
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: No se pudo actualizar el perfil.`);
        }
        const data = await response.json();
        return data.data; // Devuelve los datos actualizados o un mensaje de éxito
    } catch (error) {
        console.error("Error en updateAuthenticatedUserProfile (frontend API):", error);
        throw error;
    }
};

// Función para eliminar la cuenta del usuario autenticado
export const deleteAuthenticatedUserProfile = async (idUser) => { // No necesita ID si el backend usa /me
    try {
        const token = localStorage.getItem('accessToken'); 
        if (!token) {
            throw new Error('No autenticado. Token no encontrado.');
        }

        // Endpoint para eliminar la cuenta del usuario autenticado (ej. DELETE /api/user/me)
        const response = await fetch(`${API_BASE_URL}/${idUser}`, { 
            method: 'DELETE',
            headers: encabezados // Incluye Content-Type y Authorization
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: No se pudo eliminar la cuenta.`);
        }
        const data = await response.json();
        return data; // Devuelve el mensaje de éxito o confirmación
    } catch (error) {
        console.error("Error en deleteAuthenticatedUserProfile (frontend API):", error);
        throw error;
    }
};