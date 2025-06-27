import connection from "../utils/db.js";

class Empleado {
    
    async getAll() {
        try {
            const [rows] = await connection.query("SELECT * FROM empleados");
            return rows; 
        } catch (error) {
            throw new Error("Error al obtener los empleados");
        }
    }

    async getById(id) {
  try {
    console.log(id);

    const [rows] = await connection.query(
      "SELECT p.id_persona, p.nombre_completo_razon_social, p.id_tipo_identificacion, p.numero_identificacion, p.correo, p.telefono " +
      "FROM personas p JOIN empleados e ON e.id_empleado = p.id_persona " +
      "WHERE e.id_empleado = ?",
      [id]
    );

    if (rows.length === 0) {
      return []; // retornar un array vacío si prefieres que la ausencia de resultados sea un array vacío
    }

    return rows[0]; // Retorna el primer (y único) resultado encontrado, asumiendo que id_cliente es único
  } catch (error) {
    console.error("Error al obtener el cliente por ID:", error); // Usa console.error para errores
    throw new Error("Error al obtener el cliente.");
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
      const [existingEmpleado] = await connection.query(
        "SELECT id_cliente FROM clientes WHERE id_persona = ?",
        [id_persona]
      );

      if (existingEmpleado.length > 0) {
        throw new Error("La persona ya es un cliente.");
      }
      
      const [result] = await connection.query(
        "INSERT INTO empleados (id_empleado) VALUES (?)",
        [id_persona]
      );
      if (result.affectedRows === 0) {
        return null; // Retorna null si no se pudo crear la empleado
      }
      // Retorna la nueva empleado creado
      return { id: result.insertId, id_persona };
    } catch (error) {
      console.log(error);
      
      throw new Error("Error al crear el empleado");
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