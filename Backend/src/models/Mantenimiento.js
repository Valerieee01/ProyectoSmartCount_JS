import connection from "../utils/db.js";

class Mantenimiento {
    
    async getAll() {
        try {
            const [rows] = await connection.query("SELECT * FROM mantenimientos");
            return rows; 
        } catch (error) {
            throw new Error("Error al obtener los mantenmientos");
        }
    }

    async getById() {
        try {
            const [rows] = await connection.query( "SELECT * FROM mantenimientos WHERE id = ?",[id]);
            if (rows.length === 0) {
                return []; // Retorna un array vacío si no se encuentra la mantenimiento
            }
        return [];
        } catch (error) {
                  throw new Error("Error al obtener la mantenimiento");
        }
    }

    // Método para crear una nueva categoría
  async create(id_equipo, descripcion_trabajo, id_empleado, tipo_mantenimiento, fecha_mantenimiento, observaciones) {
    try {
      const [result] = await connection.query(
        "INSERT INTO mantenimientos (id_equipo, descripcion_trabajo, id_empleado, tipo_mantenimiento, fecha_mantenimiento, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id_equipo, descripcion_trabajo, id_empleado, tipo_mantenimiento, fecha_mantenimiento, observaciones]
      );
      if (result.affectedRows === 0) {
        return null; // Retorna null si no se pudo crear la mantenimiento
      }
      // Retorna la nueva mantenimiento creada
      return { id: result.insertId, };
    } catch (error) {
      throw new Error("Error al crear el pago");
    }
  }

   async update(id, campos) {
    try {
      let query = "UPDATE mantenimientos SET ";
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
      throw new Error("Error al actualizar el mantenimiento");
    }
  }

   // Método para eliminar una Mantenimiento
  async delete(id_mantenimiento) {
    // Procedemos con la eliminación si no está relacionada
    const [result] = await connection.query(
      "DELETE FROM mantenimientos WHERE id_mantenimiento = ?",
      [id_mantenimiento]
    );

    if (result.affectedRows === 0) {
      return {
        error: true,
        mensaje: "No se pudo eliminar el mantenimiento, ocurrio un error inesperado.",
      };
    }

    return {
      error: false,
      mensaje: "Mantenimiento eliminado exitosamente.",
    };
  }

}

export default Mantenimiento;