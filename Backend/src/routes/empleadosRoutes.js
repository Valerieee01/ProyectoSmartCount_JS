import express from "express";

import { verifyToken } from "../middlewares/auth/index.js";
import { parcialesEmpleado} from "../middlewares/empleados/parcialesEmpleado.js";
import {camposEmpleado} from "../middlewares/empleados/camposEmpleado.js";
import EmpleadosController from "../controllers/empleadosController.js";



const router = express.Router();
// Creamos una instancia del controlador

// Obtener todas las clientes
router.get("/",  EmpleadosController.getAllEmpleados);

// Obtener una cliente por ID
router.get("/:id",  EmpleadosController.getEmpleadosById);

// Crear una nueva cliente
router.post("/",  camposEmpleado, EmpleadosController.createEmpleados);

// Actualizar una cliente
router.put("/:id",  camposEmpleado, EmpleadosController.updateEmpleados);

// Actualizar parcialmente una cliente
router.patch("/:id",  parcialesEmpleado, EmpleadosController.updateEmpleados);

// Eliminar una cliente
router.delete("/:id",  EmpleadosController.deleteEmpleado);

export default router;
