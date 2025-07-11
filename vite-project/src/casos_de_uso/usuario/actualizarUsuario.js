export const updateUserProfile = async (id, userData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación.');
        }

        const response = await fetch(`http://localhost:3000/api/user/${id}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        }); 

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'No se pudo actualizar el perfil.');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error en updateUserProfile:", error);
        throw error;
    }
};