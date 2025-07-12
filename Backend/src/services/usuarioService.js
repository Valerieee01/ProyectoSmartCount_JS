import Usuario from "../models/Usuario.js"; // Asegúrate de que esta ruta sea correcta

class UsuarioService {

  // Método para obtener todos los usuarios
  static async getUsuarios() {
    try {
      const usuariosInstance = new Usuario();
      const usuarios = await usuariosInstance.getAll(); // El modelo devuelve un array

      // Si no hay usuarios, no es un error 404, es un éxito con datos vacíos.
      if (usuarios.length === 0) {
        return {
          error: false,
          code: 200,
          message: "No hay usuarios registrados.",
          data: [], // Retorna un array vacío
        };
      }
      return {
        error: false,
        code: 200,
        message: "Usuarios obtenidos correctamente.",
        data: usuarios,
      };
    } catch (error) {
      console.error("Error en UsuarioService.getUsuarios:", error);
      return {
        error: true,
        code: 500,
        message: "Error interno del servidor al obtener los usuarios.",
      };
    }
  }

  // Método para obtener un usuario por su ID
  static async getUsuariosById(id_usuario) { // Parámetro corregido a id_usuario
    try {
      const usuariosInstance = new Usuario();
      const usuario = await usuariosInstance.getById(id_usuario); // El modelo devuelve null o un objeto

      // Si el modelo devuelve null, el usuario no fue encontrado.
      if (!usuario) {
        return {
          error: true,
          code: 404,
          message: "Usuario no encontrado.",
        };
      }
      return {
        error: false,
        code: 200,
        message: "Usuario obtenido correctamente.",
        data: usuario,
      };
    } catch (error) {
      console.error("Error en UsuarioService.getUsuariosById:", error);
      return {
        error: true,
        code: 500,
        message: "Error interno del servidor al obtener el usuario por ID.",
      };
    }
  }

  // Método para obtener el perfil de un usuario por su ID (usado para la vista "Mi Perfil")
  static async getProfileById(id_usuario) { // Parámetro corregido a id_usuario
    try {
      const usuariosInstance = new Usuario();
      const profile = await usuariosInstance.getProfileById(id_usuario); // El modelo devuelve null o un objeto

      // Si el modelo devuelve null, el perfil no fue encontrado.
      if (!profile) {
        return {
          error: true,
          code: 404,
          message: "Perfil de usuario no encontrado.",
        };
      }
      return {
        error: false,
        code: 200,
        message: "Perfil de usuario obtenido correctamente.",
        data: profile,
      };
    } catch (error) {
      console.error("Error en UsuarioService.getProfileById:", error);
      return {
        error: true,
        code: 500,
        message: "Error interno del servidor al obtener el perfil del usuario.",
      };
    }
  }

  // Método para buscar un usuario por su correo electrónico
  static async getUsuariosByEmail(email) {
    try {
      const usuariosInstance = new Usuario();
      const usuario = await usuariosInstance.findByEmail(email); // El modelo devuelve null o un objeto

      // Si el modelo devuelve null, el usuario no fue encontrado.
      if (!usuario) {
        return {
          error: true,
          code: 404,
          message: "Usuario no encontrado por correo electrónico.",
        };
      }
      return {
        error: false,
        code: 200,
        message: "Usuario obtenido correctamente por correo electrónico.",
        data: usuario,
      };
    } catch (error) {
      console.error("Error en UsuarioService.getUsuariosByEmail:", error);
      return {
        error: true,
        code: 500,
        message: "Error interno del servidor al buscar usuario por email.",
      };
    }
  }

  // Método para crear un nuevo usuario
  // Asegúrate de que los parámetros recibidos aquí coincidan con los que espera el modelo.
  static async createUsuario(nombreCompleto, correo, id_rol, contrasena) {
    try {
      const usuariosInstance = new Usuario();
      const newUsuario = await usuariosInstance.create(nombreCompleto, correo, id_rol, contrasena); // El modelo devuelve {id_usuario} o lanza un error

      // Si el modelo devuelve null (ej. por alguna validación interna antes de DB),
      // o si hay un error específico que el modelo lanza (como correo duplicado).
      if (newUsuario === null) {
        return {
          error: true,
          code: 400, // Bad Request
          message: "No se pudo crear el usuario. Verifique los datos proporcionados.",
        };
      }
      return {
        error: false,
        code: 201, // 201 Created
        message: "Usuario creado correctamente.",
        data: newUsuario, // Contiene el id_usuario
      };
    } catch (error) {
      console.error("Error en UsuarioService.createUsuario:", error);
      // Si el error viene de un correo duplicado (lanzado por el modelo), captúralo aquí.
      if (error.message.includes("correo electrónico ya está registrado")) {
        return {
          error: true,
          code: 409, // Conflict
          message: error.message,
        };
      }
      return {
        error: true,
        code: 500,
        message: "Error interno del servidor al crear el usuario.",
      };
    }
  }

  // Método para actualizar un usuario
  static async updateUsuario(id_usuario, campos) { // Parámetros corregidos a id_usuario
    try {
      const usuariosInstance = new Usuario();
      // Primero, verifica si el usuario existe.
      const usuarioExistente = await usuariosInstance.getById(id_usuario);

      if (!usuarioExistente) {
        return {
          error: true,
          code: 404,
          message: "Usuario no encontrado para actualizar.",
        };
      }
      // Luego, intenta actualizar.
      const updatedUsuario = await usuariosInstance.update(id_usuario, campos); // El modelo devuelve {id_usuario, ...campos} o null

      // Si el modelo devuelve null, significa que no se pudo actualizar (ej. no hubo cambios, o datos inválidos).
      if (updatedUsuario === null) {
        return {
          error: true,
          code: 400, // Bad Request
          message: "No se pudo actualizar el usuario. Verifique los datos o inténtelo de nuevo.",
        };
      }
      return {
        error: false,
        code: 200,
        message: "Usuario actualizado correctamente.",
        data: updatedUsuario,
      };
    } catch (error) {
      console.error("Error en UsuarioService.updateUsuario:", error);
      // Manejo específico para error de duplicado de correo al actualizar.
      if (error.message.includes("correo electrónico ya está registrado")) {
        return {
          error: true,
          code: 409, // Conflict
          message: error.message,
        };
      }
      return {
        error: true,
        code: 500,
        message: "Error interno del servidor al actualizar el usuario.",
      };
    }
  }

  // Método para eliminar un usuario
  static async deleteUsuario(id_usuario) { // Parámetro corregido a id_usuario
    try {
      const usuariosInstance = new Usuario();
      // Primero, verifica si el usuario existe.
      const usuarioExistente = await usuariosInstance.getById(id_usuario);

      if (!usuarioExistente) {
        return {
          error: true,
          code: 404,
          message: "Usuario no encontrado para eliminar.",
        };
      }

      // Luego, procede a eliminar. El modelo devuelve { error: true/false, mensaje: "..." }
      const resultadoEliminacion = await usuariosInstance.delete(id_usuario);

      // Si el modelo indica un error en la eliminación.
      if (resultadoEliminacion.error) {
        return {
          error: true,
          code: 400, // O el código que el modelo haya determinado para su error
          message: resultadoEliminacion.mensaje,
        };
      }
      return {
        error: false,
        code: 200,
        message: "Usuario eliminado correctamente.",
        data: { id_usuario: id_usuario, mensaje: resultadoEliminacion.mensaje }, // Puedes devolver el ID eliminado
      };
    } catch (error) {
      console.error("Error en UsuarioService.deleteUsuario:", error);
      return {
        error: true,
        code: 500,
        message: "Error interno del servidor al eliminar el usuario.",
      };
    }
  }
}

export default UsuarioService;