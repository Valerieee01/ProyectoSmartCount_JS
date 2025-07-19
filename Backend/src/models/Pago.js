import connection from "../utils/db.js";

class Pago {
    // Método para obtener todos los pagos
    async getAll() {
        try {
            const [rows] = await connection.query("SELECT pa.id_pago, p.nombre_completo_razon_social, pa.id_mantenimiento, pa.detalle,  pa.valor_trabajo, " +
                " pa.valor_pagado, pa.valor_mora, pa.estado_pago, pa.dias_plazo, pa.fecha_vencimiento " +
                "FROM pagos pa " +
                "JOIN clientes c ON c.id_cliente = pa.id_cliente " +
                "JOIN personas p ON p.id_persona = c.id_cliente");
            return rows;
        } catch (error) {
            console.error("Error al obtener todos los pagos:", error);
            throw new Error("Error al obtener los pagos.");
        }
    }

    // Método para obtener un pago por ID
    async getById(id_pago) { // <-- ¡Corregido! Recibe 'id_pago'
        try {
            const [rows] = await connection.query("SELECT * FROM pagos WHERE id_pago = ?", [id_pago]); // <-- Usa 'id_pago'
            if (rows.length === 0) {
                return null; // Retorna null si no se encuentra el pago
            }
            return rows[0]; // Retorna el pago encontrado
        } catch (error) {
            console.error("Error al obtener el pago por ID:", error);
            throw new Error("Error al obtener el pago por ID.");
        }
    }

    // Método para crear un nuevo pago
    async create(id_cliente, id_mantenimiento, detalle, valor_trabajo, valor_pagado, estado_pago, fecha_facturacion, dias_plazo) {
        try {
            const [result] = await connection.query(
                "INSERT INTO pagos (id_cliente, id_mantenimiento, detalle, valor_trabajo, valor_pagado, estado_pago, fecha_facturacion, dias_plazo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [id_cliente, id_mantenimiento, detalle, valor_trabajo, valor_pagado, estado_pago, fecha_facturacion, dias_plazo]
            );
            if (result.affectedRows === 0) {
                return null; // Retorna null si no se pudo crear el pago
            }
            return { id_pago: result.insertId }; // Retorna el ID insertado
        } catch (error) {
            console.error("Error al crear el pago:", error);
            throw new Error("Error al crear el pago.");
        }
    }

    // Método para actualizar un pago
    async update(id_pago, campos) { 
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

            // Añadimos la condición WHERE para seleccionar el pago por su ID
            query += " WHERE id_pago = ?"; 
            params.push(id_pago); 

            const [result] = await connection.query(query, params);
            return result.affectedRows > 0 ? { id_pago: id_pago, ...campos } : null;
        } catch (error) {
            console.error("Error al actualizar el pago:", error);
            throw new Error("Error al actualizar el pago.");
        }
    }

    // Método para eliminar un pago
    async delete(id_pago) { 
        try {
            const [result] = await connection.query(
                "DELETE FROM pagos WHERE id_pago = ?",
                [id_pago]
            );

            if (result.affectedRows === 0) {
                return {
                    error: true,
                    mensaje: "No se pudo eliminar el pago, el pago no fue encontrado o ocurrió un error inesperado.",
                };
            }

            return {
                error: false,
                mensaje: "Pago eliminado exitosamente.",
            };
        } catch (error) {
            throw new Error("Error al eliminar el pago.");
        }
    }


    // Método para obtener el resumen de pagos por estado (para el gráfico de torta/donut)
    async getPaymentStatusSummary() {
        try {
            const [rows] = await connection.query(`
                SELECT
                    estado_pago,
                    SUM(valor_trabajo - valor_pagado) AS total_valor_pendiente
                FROM pagos
                GROUP BY estado_pago
            `);
            return rows;
        } catch (error) {
            console.error("Error en getPaymentStatusSummary:", error);
            throw new Error("Error al obtener el resumen de estado de pagos.");
        }
    }

    // Método para obtener los clientes con mayor mora (para el gráfico de barras)
    async getTopOverdueClients(limit = 5) {
        try {
            const [rows] = await connection.query(`
                SELECT
                    c.id_cliente,
                    c.nombre_completo_razon_social,
                    SUM(p.valor_mora) AS total_mora
                FROM pagos p
                JOIN clientes c ON p.id_cliente = c.id_cliente
                WHERE p.valor_mora > 0 -- Solo clientes con mora
                GROUP BY c.id_cliente, c.nombre_completo_razon_social
                ORDER BY total_mora DESC
                LIMIT ?
            `, [limit]);
            return rows;
        } catch (error) {
            console.error("Error en getTopOverdueClients:", error);
            throw new Error("Error al obtener los clientes con mayor mora.");
        }
    }
}

export default Pago;