import express from "express";

import { verifyToken } from "../middlewares/auth/index.js";
import { parcialesUsuarios } from "../middlewares/usuarios/parcialesUsuarios.js";
import { camposUsuarios } from "../middlewares/usuarios/camposUsuarios.js";
import UsuarioController from "../controllers/usuariosController.js";

const router = express.Router();
// Creamos una instancia del controlador

// Obtener todas las usuarios
router.get("/",verifyToken, UsuarioController.getAllUsuarios);

// Obtener una usuario por ID
router.get("/me",verifyToken, UsuarioController.getMe);

// Crear una nueva usuario
router.post("/",verifyToken, camposUsuarios, UsuarioController.createUsuario);

// Actualizar una usuario
router.put("/:id",verifyToken, camposUsuarios, UsuarioController.updateUsuario);

// Actualizar parcialmente una usuario
router.patch("/:id",verifyToken, parcialesUsuarios, UsuarioController.updateUsuario);

// Eliminar una usuario
router.delete("/:id", verifyToken,UsuarioController.deleteUsuario);

export default router;




