// models/Usuario.js
import db from "../utils/db.js";

export class Usuario {
  
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE correo = ?", [
      email,
    ]);
    return rows[0];
  }

  static async create(nombre, correo, hashedPassword) {
    const [result] = await db.query(
      "INSERT INTO usuarios (nombreCompleto, correo, contrasena) VALUES (?, ?, ?)",
      [nombre, correo, hashedPassword]
    );
    return result.insertId;
  }

  static async updateRefreshToken(id, refreshToken) {
    await db.query("UPDATE usuarios SET refresh_token = ? WHERE id_usuario = ?", [
      refreshToken,
      id,
    ]);
  }
}
