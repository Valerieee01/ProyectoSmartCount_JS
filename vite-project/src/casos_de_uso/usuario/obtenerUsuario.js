export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem('token'); // Asume que guardas el token JWT aquí
        if (!token) {
            throw new Error('No hay token de autenticación.');
        }

        const response = await fetch(`${API_BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envía el token en el header de autorización
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'No se pudo obtener el perfil del usuario.');
        }

        const data = await response.json();
        return data.data; // Asume que la respuesta está formateada con { success: true, data: userObject }
    } catch (error) {
        console.error("Error en getUserProfile:", error);
        throw error;
    }
};
