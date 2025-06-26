import connection from "../utils/db.js";

class Cliente {

  async getAll() {
    try {
      const [rows] = await connection.query("SELECT p.nombre_completo_razon_social, p.id_tipo_identificacion, p.numero_identificacion, p.correo, p.telefono FROM personas p JOIN clientes c ON c.id_cliente = p.id_persona ");
      return rows;
    } catch (error) {
      throw new Error("Error al obtener las clientes");
    }
  }

  async getById(id) {
    try {
      const [rows] = await connection.query("SELECT p.id_persona, p.nombre_completo_razon_social, p.id_tipo_identificacion, p.numero_identificacion, p.correo, p.telefono " +
        "FROM personas p JOIN clientes c ON c.id_cliente = p.id_persona " +
        "WHERE c.id_cliente = ?" [id]);
      if (rows.length === 0) {
        return []; // Retorna un array vacío si no se encuentra la categoría
      }
      return [];
    } catch (error) {
      console.log(error);
      
      throw new Error("Error al obtener el clientes");
    }
  }

  // Método para crear una nueva categoría
  async create(id_persona) {
    try {

      // Verificar si la persona ya existe
      const [existingPersona] = await connection.query(
        "SELECT id_persona FROM personas WHERE id_persona = ?",
        [id_persona]
      );

      if (existingPersona.length === 0) {
        throw new Error("La persona con el ID proporcionado no existe.");
      }

      // Verificar si la persona ya es un cliente
      const [existingClient] = await connection.query(
        "SELECT id_cliente FROM clientes WHERE id_persona = ?",
        [id_persona]
      );

      if (existingClient.length > 0) {
        throw new Error("La persona ya es un cliente.");
      }

      const [result] = await connection.query(
        "INSERT INTO clientes (id_cliente) VALUES (?)",
        [id_persona]
      );
      if (result.affectedRows === 0) {
        return null; // Retorna null si no se pudo crear EL cliente
      }
      // Retorna el nueva cliente creado
      return { id: result.insertId, id_persona };
    } catch (error) {
      throw new Error("Error al crear la cliente");
    }
  }

  async update(id, campos) {
    try {
      let query = "UPDATE clientes SET ";
      let params = [];

      // Construimos dinámicamente la consulta de actualización solo con los campos proporcionados
      for (const [key, value] of Object.entries(campos)) {
        query += `${key} = ?, `;
        params.push(value);
      }

      // Eliminamos la última coma y espacio de la consulta
      query = query.slice(0, -2);

      // Añadimos la condición WHERE para seleccionar el cliente por su ID
      query += " WHERE id = ?";
      params.push(id);
      const [result] = await connection.query(query, params);
      return result.affectedRows > 0 ? { id, ...campos } : null;
    } catch (error) {
      throw new Error("Error al actualizar la cliente");
    }
  }

  // Método para eliminar una cliente
  async delete(id_cliente) {
    const [result] = await connection.query(
      "DELETE FROM clientes WHERE id_cliente = ?",
      [id_cliente]
    );

    if (result.affectedRows === 0) {
      return {
        error: true,
        mensaje: "No se pudo eliminar el cliente, ocurrio un error inesperado.",
      };

    }

    return {
      error: false,
      mensaje: "Cliente eliminado exitosamente.",
    };
  }

}

export default Cliente;