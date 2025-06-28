import connection from "../utils/db.js";

class Persona {
    
    async getAll() {
        try {
            const [rows] = await connection.query("SELECT * FROM personas");
            return rows; 
        } catch (error) {
            throw new Error("Error al obtener las categorías");
        }
    }

    async getById() {
        try {
            const [rows] = await connection.query( "SELECT * FROM personas WHERE id = ?",[id]);
            if (rows.length === 0) {
                return []; // Retorna un array vacío si no se encuentra la persona
            }
        return [];
        } catch (error) {
                  throw new Error("Error al obtener la persona");
        }
    }

    // Método para crear una nueva categoría
  async create(nombre_completo_razon_social, id_tipo_identificacion, numero_identificacion, correo, telefono, direccion, id_ciudad, estado, id_usuario) {
    try {
      const [result] = await connection.query(
        "INSERT INTO personas (nombre_completo_razon_social, id_tipo_identificacion, numero_identificacion, correo, telefono, direccion, id_ciudad, estado, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [nombre_completo_razon_social, id_tipo_identificacion, numero_identificacion, correo, telefono, direccion, id_ciudad, estado, id_usuario]
      );
      if (result.affectedRows === 0) {
        return null; // Retorna null si no se pudo crear la persona
      }
      // Retorna la nueva persona creada
      return { id: result.insertId, nombre_completo_razon_social, id_tipo_identificacion, numero_identificacion, correo, telefono, direccion, id_ciudad, estado};
    } catch (error) {
      throw new Error("Error al crear la persona");
    }
  }

   async update(id, campos) {
    try {
      let query = "UPDATE personas SET ";
      let params = [];

      // Construimos dinámicamente la consulta de actualización solo con los campos proporcionados
      for (const [key, value] of Object.entries(campos)) {
        query += `${key} = ?, `;
        params.push(value);
      }

      // Eliminamos la última coma y espacio de la consulta
      query = query.slice(0, -2);

      // Añadimos la condición WHERE para seleccionar el producto por su ID
      query += " WHERE id = ?";
      params.push(id);
      const [result] = await connection.query(query, params);
      return result.affectedRows > 0 ? { id, ...campos } : null;
    } catch (error) {
      throw new Error("Error al actualizar la persona");
    }
  }

   // Método para eliminar una Persona
  async delete(personaId) {
    // Procedemos con la eliminación si no está relacionada
    const [result] = await connection.query(
      "DELETE FROM persona WHERE personaId = ?",
      [personaId]
    );

    if (result.affectedRows === 0) {
      return {
        error: true,
        mensaje: "No se pudo eliminar la categoría, ocurrio un error inesperado.",
      };
    }

    return {
      error: false,
      mensaje: "Persona eliminada exitosamente.",
    };
  }

}

export default Persona;