import express from "express";

import { verifyToken } from "../middlewares/auth/index.js";
import EquiposController from "../controllers/equiposController.js";
import {parcialesEquipos} from "../middlewares/equipos/parcialesEquipo.js";
import {camposEquipos} from "../middlewares/equipos/camposEquipos.js";

const router = express.Router();
// Creamos una instancia del controlador

// Obtener todas las clientes
router.get("/", EquiposController.getAllEquipos);

// Obtener una cliente por ID
router.get("/:id",  EquiposController.getEquiposById);

// Crear una nueva cliente
router.post("/",  camposEquipos, EquiposController.createEquipos);

// Actualizar una cliente
router.put("/:id",  camposEquipos, EquiposController.updateEquipos);

// Actualizar parcialmente una cliente
router.patch("/:id",  parcialesEquipos, EquiposController.updateEquipos);

// Eliminar una cliente
router.delete("/:id",  EquiposController.deleteEquipos);

export default router;
