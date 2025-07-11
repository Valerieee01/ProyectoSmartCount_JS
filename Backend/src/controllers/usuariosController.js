// src/controllers/usuariosController.js

import { ResponseProvider } from "../providers/ResponseProvider.js"; // Importa tu proveedor de respuestas
import UsuarioService from "../services/UsuarioService.js";     // Importa tu capa de servicio de usuarios

class UsuarioController {

    // Método para obtener todos los usuarios
    // Se usa, por ejemplo, para una vista de administración que lista todos los usuarios.
    static getAllUsuarios = async (req, res) => { 
        try {
            const response = await UsuarioService.getUsuarios(); // Llama al servicio para obtener todos los usuarios.
            
            // Si el servicio devuelve un error, usa ResponseProvider.error.
            if (response.error) { 
                return ResponseProvider.error(res, response.message, response.code);
            } 
            // Si es exitoso, usa ResponseProvider.success.
            return ResponseProvider.success(res, response.data, response.message, response.code);
        } catch (error) {
            // Captura cualquier error inesperado en el controlador.
            console.error("Error en UsuarioController.getAllUsuarios:", error);
            ResponseProvider.error(res, "Error interno en el servidor al obtener usuarios.", 500);
        }
    };

    // Método para obtener un usuario por su ID
    static getUsuariosById = async (req, res) => {
        const { id } = req.params; // Captura el ID del usuario desde los parámetros de la URL.
        try {
            const response = await UsuarioService.getUsuariosById(id); // Pasa el ID al servicio.
            if (response.error) {
                return ResponseProvider.error(res, response.message, response.code);
            }
            return ResponseProvider.success(res, response.data, response.message, response.code);
        } catch (error) {
            console.error("Error en UsuarioController.getUsuariosById:", error);
            ResponseProvider.error(res, "Error interno en el servidor al obtener el usuario por ID.", 500);
        }
    };

    // --- ¡NUEVO MÉTODO! ---
    // Método para obtener el perfil del usuario AUTENTICADO.
    // Este es el método clave para la vista "Mi Perfil" en el frontend.
    static getMe = async (req, res) => {
        // Asume que el middleware `verifyToken` ya ha adjuntado la información del usuario
        // autenticado a `req.user` (ej. `req.user.id_usuario`).
        if (!req.user || !req.user.id_usuario) {
            // Si no hay información de usuario en la request, significa que no está autenticado o el token es inválido.
            return ResponseProvider.error(res, "Usuario no autenticado o ID no disponible.", 401);
        }
        const id_usuario_autenticado = req.user.id_usuario; // Extrae el ID del usuario del token/sesión.

        try {
            // Llama al servicio para obtener el perfil completo del usuario autenticado.
            const response = await UsuarioService.getProfileById(id_usuario_autenticado);
            if (response.error) {
                return ResponseProvider.error(res, response.message, response.code);
            }
            return ResponseProvider.success(res, response.data, response.message, response.code);
        } catch (error) {
            console.error("Error en UsuarioController.getMe:", error);
            ResponseProvider.error(res, "Error interno en el servidor al obtener el perfil del usuario autenticado.", 500);
        }
    };


    // Método para buscar un usuario por su correo electrónico.
    // (Asegúrate de que la ruta en el router sea /email/:correo o similar).
    static getUsuariosByEmail = async (req, res) => {
        const { correo } = req.params; // Si el correo viene en params, o req.query.correo si es query param.
        console.log("Buscando usuario por correo:", correo); // Log para depuración.
        
        try {
            const response = await UsuarioService.getUsuariosByEmail(correo);
            if (response.error) {
                return ResponseProvider.error(res, response.message, response.code);
            }
            return ResponseProvider.success(res, response.data, response.message, response.code);
        } catch (error) {
            console.error("Error en UsuarioController.getUsuariosByEmail:", error);
            ResponseProvider.error(res, "Error interno en el servidor al buscar usuario por email.", 500);
        }
    };

    // Método para crear un nuevo usuario.
    // Los datos del nuevo usuario vienen en el cuerpo de la solicitud (req.body).
    static createUsuario = async (req, res) => {
        // Desestructurar los campos que se esperan del body.
        const { nombreCompleto, correo, id_rol, contrasena } = req.body; 
        try {
            // Llama al servicio para crear el usuario.
            // Asume que la 'contrasena' ya viene hasheada por un middleware de autenticación,
            // o que el servicio se encarga de hashearla antes de pasarla al modelo.
            const response = await UsuarioService.createUsuario(nombreCompleto, correo, id_rol, contrasena); 
            if (response.error) {
                return ResponseProvider.error(res, response.message, response.code);
            }
            return ResponseProvider.success(res, response.data, response.message, response.code);
        } catch (error) {
            console.error("Error en UsuarioController.createUsuario:", error);
            ResponseProvider.error(res, "Error interno en el servidor al crear el usuario.", 500);
        }
    };

    // Método para actualizar un usuario existente.
    static updateUsuario = async (req, res) => {
        const { id } = req.params; // ID del usuario a actualizar.
        const campos = req.body; // Campos a actualizar, pasados en el cuerpo de la solicitud.

        // NOTA: Si este endpoint es para que un usuario actualice *su propio* perfil,
        // Y la ruta es /api/user/me (con 'me' en params), necesitarías obtener el ID de req.user
        // y usarlo en lugar de 'id' de params, o añadir validación de autorización.
        // Ejemplo:
        // if (id === 'me' && req.user && req.user.id_usuario) {
        //     id = req.user.id_usuario; // Usar el ID del token
        // } else if (id !== req.user.id_usuario && req.user.id_rol !== ROL_ADMIN) {
        //     return ResponseProvider.error(res, "No tiene permisos para actualizar este usuario.", 403);
        // }

        try {
            const response = await UsuarioService.updateUsuario(id, campos);
            if (response.error) {
                return ResponseProvider.error(res, response.message, response.code);
            }
            return ResponseProvider.success(res, response.data, response.message, response.code);
        } catch (error) {
            console.error("Error en UsuarioController.updateUsuario:", error);
            ResponseProvider.error(res, "Error interno en el servidor al actualizar el usuario.", 500);
        }
    };

    // Método para eliminar un usuario.
    static deleteUsuario = async (req, res) => { // ¡Typo corregido! Antes era deleteUusuarios
        const { id } = req.params; // ID del usuario a eliminar.

        // NOTA: Similar al update, si este endpoint es para que un usuario elimine *su propia* cuenta,
        // Y la ruta es /api/user/me, necesitas obtener el ID de req.user y validar.
        // Ejemplo:
        // if (id === 'me' && req.user && req.user.id_usuario) {
        //     id = req.user.id_usuario;
        // } else if (id !== req.user.id_usuario && req.user.id_rol !== ROL_ADMIN) {
        //     return ResponseProvider.error(res, "No tiene permisos para eliminar este usuario.", 403);
        // }

        try {
            const response = await UsuarioService.deleteUsuario(id);
            if (response.error) {
                return ResponseProvider.error(res, response.message, response.code);
            }
            // Después de eliminar una cuenta, es buena práctica forzar el cierre de sesión del usuario.
            // Puedes enviar un header o un mensaje específico que el frontend interprete.
            return ResponseProvider.success(res, response.data, response.message, response.code);
        } catch (error) {
            console.error("Error en UsuarioController.deleteUsuario:", error);
            ResponseProvider.error(res, "Error interno en el servidor al eliminar el usuario.", 500);
        }
    };
}
export default UsuarioController;