export const deleteUserProfile = async (id) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No hay token de autenticación.');
        }

        const response = await fetch(`${API_BASE_URL}/${id}`, { // DELETE /api/users/:id
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'No se pudo eliminar la cuenta.');
        }

        const data = await response.json(); // La respuesta de eliminación puede ser solo un mensaje
        return data; // O el mensaje de éxito
    } catch (error) {
        console.error("Error en deleteUserProfile:", error);
        throw error;
    }
};