import connection from "../utils/db.js"; // Importa la conexión a tu base de datos

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
   async getProfileById(id_usuario) {
    try {

      const [rows] = await connection.query(`
                SELECT 
    u.id_usuario, 
    u.nombreCompleto AS nombre_completo_razon_social, 
    u.correo, 
    u.estado, 
    u.id_rol, 
    r.nombre_rol
FROM usuarios u
LEFT JOIN roles r ON u.id_rol = r.id_rol;
            `, [id_usuario]);

      if (rows.length === 0) {
        return null;
      }

      // Mapea los nombres de las columnas a lo que tu frontend espera.
      // Si los campos comentados no están en tu DB/JOIN, el frontend deberá manejarlos como 'No disponible'.
      const profile = {
        id_usuario: rows[0].id_usuario,
        nombre_completo_razon_social: rows[0].nombre_completo_razon_social, // Ya es un alias
        correo: rows[0].correo,
        estado: rows[0].estado, // El estado del usuario
        id_rol: rows[0].id_rol,
        nombre_rol: rows[0].nombre_rol,


      };
      return profile;
    } catch (error) {
      console.error(`Error en el modelo (getProfileById) para ID ${id_usuario}:`, error);
      throw new Error("Error al obtener el perfil del usuario desde la base de datos.");
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

  // Actualizar un usuario por su ID
   async update(id_usuario, campos) {
    try {
      let query = "UPDATE usuarios SET ";
      let params = [];

      for (const [key, value] of Object.entries(campos)) {
        // Validación básica: Asegura que la clave sea un nombre de columna válido para evitar inyecciones.
        // En un sistema real, se usaría una lista blanca de campos permitidos.
        // Aquí, asumimos que 'campos' solo contiene claves válidas de la tabla 'usuarios'.
        query += `${key} = ?, `;
        params.push(value);
      }

      query = query.slice(0, -2); // Eliminar la última ', '
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