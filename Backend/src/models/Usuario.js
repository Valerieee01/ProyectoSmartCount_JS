import connection from "../utils/db.js"; // Importa la conexión a tu base de datos
import bcrypt from 'bcryptjs';

class Usuario {

  // Método para obtener todos los usuarios
  // Este método es de instancia, no estático, por lo que se llama en una instancia de la clase.
  async getAll() {
    try {
      const [rows] = await connection.query("SELECT * FROM usuarios");
      return rows;
    } catch (error) {
      console.error("Error en el modelo (getAll):", error);
      throw new Error("Error al obtener los usuarios desde la base de datos.");
    }
  }

  // Método para obtener un usuario por su ID (id_usuario es la clave primaria)
  async getById(id_usuario) { // Recibe el ID del usuario
    try {
      const [rows] = await connection.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id_usuario]);
      if (rows.length === 0) {
        return null; // Retorna null si no se encuentra el usuario
      }
      return rows[0]; // Retorna el objeto usuario encontrado
    } catch (error) {
      console.error(`Error en el modelo (getById) para ID ${id_usuario}:`, error);
      throw new Error("Error al obtener el usuario por ID desde la base de datos.");
    }
  }

  // Método para obtener el perfil completo de un usuario por su ID.
  // Este método está diseñado para la vista de perfil en el frontend,
  // y puede incluir datos de tablas relacionadas si existen.
  // Método para obtener el perfil completo de un usuario por su ID.
   async getProfileById(id_usuario) {
  try {
    const [rows] = await connection.query(
      "SELECT id_usuario, nombreCompleto, correo, contrasena ,id_rol, estado FROM usuarios WHERE id_usuario = ?",
      [id_usuario]
    );

    return rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}


  // Buscar un usuario por su correo electrónico
  async findByEmail(email) {
    try {
      const [rows] = await connection.query("SELECT * FROM usuarios WHERE correo = ?", [email]);
      if (rows.length === 0) {
        return null; // Retorna null si no se encuentra por email
      }
      return rows[0];
    } catch (error) {
      console.error(`Error en el modelo (findByEmail) para correo ${email}:`, error);
      throw new Error("Error al buscar usuario por email desde la base de datos.");
    }
  }

  // Crear un nuevo usuario
  async create(nombreCompleto, correo, id_rol, contrasena) {
    try {
      const [result] = await connection.query(
        "INSERT INTO usuarios (nombreCompleto, correo, id_rol, contrasena) VALUES (?, ?, ?, ?)",
        [nombreCompleto, correo, id_rol, contrasena]
      );
      if (result.affectedRows === 0) {
        return null;
      }
      return { id_usuario: result.insertId };
    } catch (error) {
      console.error("Error en el modelo (create):", error);
      // Manejo específico para error de duplicado de correo
      if (error.code === 'ER_DUP_ENTRY' && error.message.includes('correo')) { // Verifica código y mensaje
        throw new Error("El correo electrónico ya está registrado.");
      }
      throw new Error("Error al crear el usuario en la base de datos.");
    }
  }

  // Método para actualizar un usuario por su ID
    async update(id_usuario, campos) {
        try {
            if (campos.contrasena) {
                const saltRounds = 10; 
                campos.contrasena = await bcrypt.hash(campos.contrasena, saltRounds);
                console.log(`[Usuario.update] Contraseña hasheada para usuario ID: ${id_usuario}`);
            }

            let query = "UPDATE usuarios SET ";
            let params = [];

            // Construir la consulta dinámicamente con los campos proporcionados
            for (const [key, value] of Object.entries(campos)) {
         
                query += `${key} = ?, `;
                params.push(value);
            }

            query = query.slice(0, -2); 
            query += " WHERE id_usuario = ?";
            params.push(id_usuario);

            const [result] = await connection.query(query, params);
            if (result.affectedRows === 0) {
                return null; // No se encontró el usuario o no hubo cambios
            }
            return { id_usuario, ...campos }; // Retorna el usuario actualizado con los campos que se intentaron modificar
        } catch (error) {
            console.error(`Error en el modelo (update) para ID ${id_usuario}:`, error);
            // Manejo específico para error de duplicado de correo al actualizar
            if (error.code === 'ER_DUP_ENTRY' && error.message.includes('correo')) {
                throw new Error("El correo electrónico ya está registrado.");
            }
            throw new Error("Error al actualizar el usuario en la base de datos.");
        }
    }
  // Actualizar el refresh token de un usuario
  async updateRefreshToken(id_usuario, refreshToken) {
    try {
      await connection.query("UPDATE usuarios SET refresh_token = ? WHERE id_usuario = ?", [
        refreshToken,
        id_usuario,
      ]);
      // El modelo simplemente confirma que la operación de DB se intentó sin error.
      return true;
    } catch (error) {
      console.error(`Error en el modelo (updateRefreshToken) para ID ${id_usuario}:`, error);
      throw new Error("Error al actualizar el refresh token en la base de datos.");
    }
  }

  // Eliminar un usuario por su ID
  async delete(id_usuario) {
    try {
      const [result] = await connection.query("DELETE FROM usuarios WHERE id_usuario = ?", [id_usuario]);
      if (result.affectedRows === 0) {
        return {
          error: true,
          mensaje: "No se pudo eliminar el usuario, el usuario no fue encontrado en la base de datos.",
        };
      }
      return {
        error: false,
        mensaje: "Usuario eliminado exitosamente de la base de datos.",
      };
    } catch (error) {
      console.error(`Error en el modelo (delete) para ID ${id_usuario}:`, error);
      throw new Error("Error al eliminar el usuario en la base de datos.");
    }
  }
}

export default Usuario; // Exportación por defecto