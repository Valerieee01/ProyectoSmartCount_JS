import connection from "../utils/db.js";

class Proveedor {
    
    async getAll() {
        try {
            const [rows] = await connection.query("SELECT  p.id_persona, p.nombre_completo_razon_social, p.id_tipo_identificacion, p.numero_identificacion, p.correo, p.telefono, p.estado FROM personas p JOIN proveedores pr ON pr.id_proveedor = p.id_persona");
            return rows; 
        } catch (error) {
            throw new Error("Error al obtener las proveedores");
        }
    }

    async getById(id) {
        try {
            const [rows] = await connection.query(  "SELECT p.id_persona, p.nombre_completo_razon_social, p.id_tipo_identificacion, p.numero_identificacion, p.correo, p.telefono, p.estado " +
      "FROM personas p JOIN proveedores pr ON pr.id_proveedor = p.id_persona " +
      "WHERE e.id_empleado = ?",[id]);
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

       // Verificar si la persona ya existe
      const [existingPersona] = await connection.query(
        "SELECT id_persona FROM personas WHERE id_persona = ?",
        [id_persona]
      );

      if (existingPersona.length === 0) {
        throw new Error("La persona con el ID proporcionado no existe.");
      }

       // Verificar si la persona ya es un cliente
      const [existingProveedor] = await connection.query(
        "SELECT id_proveedor FROM proveedores WHERE id_persona = ?",
        [id_persona]
      );

         if (existingProveedor.length > 0) {
        throw new Error("La persona ya es un Proveedor.");
      }

      const [result] = await connection.query(
        "INSERT INTO personas (id_proveedor) VALUES (?)",
        [id_persona]
      );
      if (result.affectedRows === 0) {
        return null; // Retorna null si no se pudo crear la proveedor
      }
      // Retorna la nueva persona creada
      return { id: result.insertId, id_persona };
    } catch (error) {
      throw new Error("Error al crear la proveedor");
    }
  }

   async update(id, campos) {
    try {
      let query = "UPDATE proveedores SET ";
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
      throw new Error("Error al actualizar el proveedor");
    }
  }

   // Método para eliminar una Persona
  async delete(id_proveedor) {
    // Procedemos con la eliminación si no está relacionada
    const [result] = await connection.query(
      "DELETE FROM proveedor WHERE id_proveedor = ?",
      [id_proveedor]
    );

    if (result.affectedRows === 0) {
      return {
        error: true,
        mensaje: "No se pudo eliminar la proveedor, ocurrio un error inesperado.",
      };
    }

    return {
      error: false,
      mensaje: "proveedor eliminado exitosamente.",
    };
  }

}

export default Proveedor;