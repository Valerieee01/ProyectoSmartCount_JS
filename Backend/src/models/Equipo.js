import connection from "../utils/db.js";

class Equipo {
    
    async getAll() {
        try {
            const [rows] = await connection.query("SELECT * FROM equipos");
            return rows; 
        } catch (error) {
            throw new Error("Error al obtener los equipos");
        }
    }

    async getById(id) {
        try {
            const [rows] = await connection.query( "SELECT * FROM equipos WHERE id = ?",[id]);
            if (rows.length === 0) {
                return []; // Retorna un array vacío si no se encuentra el equipo
            }
        return [];
        } catch (error) {
                  throw new Error("Error al obtener el equipo");
        }
    }

    // Método para crear una nueva categoría
  async create(numero_equipo, placa, descripcion, id_cliente) {
    try {
      const [result] = await connection.query(
        "INSERT INTO equipos (numero_equipo, placa, descripcion, id_cliente) VALUES (?, ?, ?, ?)",
        [numero_equipo, placa, descripcion, id_cliente]
      );
      if (result.affectedRows === 0) {
        return null; // Retorna null si no se pudo crear la persona
      }
      // Retorna la nueva persona creada
      return { id: result.insertId, };
    } catch (error) {
      throw new Error("Error al crear el equipo");
    }
  }

   async update(id, campos) {
    try {
      let query = "UPDATE equipos SET ";
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
      throw new Error("Error al actualizar el equipo");
    }
  }

   // Método para eliminar una Equipo
  async delete(id_equipo) {
    // Procedemos con la eliminación si no está relacionada
    const [result] = await connection.query(
      "DELETE FROM equipos WHERE id_equipo = ?",
      [id_equipo]
    );

    if (result.affectedRows === 0) {
      return {
        error: true,
        mensaje: "No se pudo eliminar el equipo, ocurrio un error inesperado.",
      };
    }

    return {
      error: false,
      mensaje: "Equipo eliminado exitosamente.",
    };
  }

}

export default Equipo;