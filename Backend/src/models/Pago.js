import connection from "../utils/db.js";

class Pago {
    
    async getAll() {
        try {
            const [rows] = await connection.query("SELECT * FROM pagos");
            return rows; 
        } catch (error) {
            throw new Error("Error al obtener las categorías");
        }
    }

    async getById() {
        try {
            const [rows] = await connection.query( "SELECT * FROM pagos WHERE id = ?",[id]);
            if (rows.length === 0) {
                return []; // Retorna un array vacío si no se encuentra la persona
            }
        return [];
        } catch (error) {
                  throw new Error("Error al obtener la persona");
        }
    }

    // Método para crear una nueva categoría
  async create(id_cliente, id_mantenimento, detalle, valor_trabajo, valor_pagado, estado_pago, fecha_facturacion, dias_plazo) {
    try {
      const [result] = await connection.query(
        "INSERT INTO pagos (id_cliente, id_mantenimento, detalle, valor_trabajo, valor_pagado, estado_pago, fecha_facturacion, dias_plazo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id_cliente, id_mantenimento, detalle, valor_trabajo, valor_pagado, estado_pago, fecha_facturacion, dias_plazo]
      );
      if (result.affectedRows === 0) {
        return null; // Retorna null si no se pudo crear la persona
      }
      // Retorna la nueva persona creada
      return { id: result.insertId, };
    } catch (error) {
      throw new Error("Error al crear el pago");
    }
  }

   async update(id, campos) {
    try {
      let query = "UPDATE pagos SET ";
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
      throw new Error("Error al actualizar el pago");
    }
  }

   // Método para eliminar una Pago
  async delete(id) {
    // Procedemos con la eliminación si no está relacionada
    const [result] = await connection.query(
      "DELETE FROM pagos WHERE id_pago = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return {
        error: true,
        mensaje: "No se pudo eliminar el pago, ocurrio un error inesperado.",
      };
    }

    return {
      error: false,
      mensaje: "Pago eliminado exitosamente.",
    };
  }

}

export default Pago;