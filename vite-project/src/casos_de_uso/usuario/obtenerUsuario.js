import { encabezados } from "../../helpers/solicitudes";

export const getAuthenticatedUserProfile = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No autenticado');

    const response = await fetch(`http://localhost:3000/api/user/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            headers: encabezados
        }
    });

    if (!response.ok) throw new Error('Error al obtener el perfil');
    const data = await response.json();
    return data.data;
};


// PUT /api/user/me
export const updateAuthenticatedUserProfile = async (userData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No autenticado');

    try {
        const response = await UsuarioService.updateUsuario(req.user.id_usuario, campos);
        if (response.error) {
            return ResponseProvider.error(res, response.message, response.code);
        }
        return ResponseProvider.success(res, response.data, response.message, response.code);
    } catch (error) {
        console.error("Error en updateAuthenticatedUser:", error);
        return ResponseProvider.error(res, "Error al actualizar perfil.", 500);
    }
};

// DELETE /api/user/me
export const deleteAuthenticatedUserProfile = async () => {


    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No autenticado');

    try {
        const response = await UsuarioService.deleteUsuario(req.user.id_usuario);
        if (response.error) {
            return ResponseProvider.error(res, response.message, response.code);
        }
        return ResponseProvider.success(res, response.data, response.message, response.code);
    } catch (error) {
        console.error("Error en deleteAuthenticatedUser:", error);
        return ResponseProvider.error(res, "Error al eliminar cuenta.", 500);
    }
};
