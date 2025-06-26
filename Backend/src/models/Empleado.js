import connection from "../utils/db.js";

class Empleado {
    
    async getAll() {
        try {
            const [rows] = await connection.query("SELECT * FROM empleados");
            return rows; 
        } catch (error) {
            throw new Error("Error al obtener las empleados");
        }
    }

    async getById() {
        try {
            const [rows] = await connection.query( "SELECT * FROM empleados WHERE id = ?",[id]);
            if (rows.length === 0) {
                return []; // Retorna un array vacío si no se encuentra la categoría
            }
        return [];
        } catch (error) {
                  throw new Error("Error al obtener la persona");
        }
    }

    // Método para crear una nueva categoría
  async create(id_persona) {
    try {
      const [result] = await connection.query(
        "INSERT INTO personas (id_empleado) VALUES (?)",
        [id_persona]
      );
      if (result.affectedRows === 0) {
        return null; // Retorna null si no se pudo crear la empleado
      }
      // Retorna la nueva persona creada
      return { id: result.insertId, id_persona };
    } catch (error) {
      throw new Error("Error al crear la empleado");
    }
  }

   async update(id, campos) {
    try {
      let query = "UPDATE empleados SET ";
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
      throw new Error("Error al actualizar la empleado");
    }
  }

   // Método para eliminar una Persona
  async delete(id_empleado) {
    // Procedemos con la eliminación si no está relacionada
    const [result] = await connection.query(
      "DELETE FROM empleado WHERE id_empleado = ?",
      [id_empleado]
    );

    if (result.affectedRows === 0) {
      return {
        error: true,
        mensaje: "No se pudo eliminar la empleado, ocurrio un error inesperado.",
      };
    }

    return {
      error: false,
      mensaje: "empleado eliminado exitosamente.",
    };
  }

}

export default Empleado;