import express from "express";

import { verifyToken } from "../middlewares/auth/index.js";
import MantenimientosController from "../controllers/mantenimientosController.js";
import {parcialesMantenimiento} from "../middlewares/mantenimientos/parcialesMantenimiento.js";
import {camposMantenimiento} from "../middlewares/mantenimientos/camposMantenimiento.js";

const router = express.Router();
// Creamos una instancia del controlador

// Obtener todas las clientes
router.get("/", MantenimientosController.getAllMantenimientos);

// Obtener una cliente por ID
router.get("/:id",  MantenimientosController.getMantenimientosById);

// Crear una nueva cliente
router.post("/",  camposMantenimiento, MantenimientosController.createMantenimiento);

// Actualizar una cliente
router.put("/:id",  camposMantenimiento, MantenimientosController.updateMantenimiento);

// Actualizar parcialmente una cliente
router.patch("/:id",  parcialesMantenimiento, MantenimientosController.updateMantenimiento);

// Eliminar una cliente
router.delete("/:id",  MantenimientosController.deleteMantenimiento);

export default router;
