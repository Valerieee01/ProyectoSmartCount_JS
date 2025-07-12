import express from "express";

import { verifyToken } from "../middlewares/auth/index.js";
import PersonasController from "../controllers/PersonasController.js";
import {parcialesPersona} from "../middlewares/personas/parcialesPersona.js";
import {camposPersona} from "../middlewares/personas/camposPersona.js";

const router = express.Router();
// Creamos una instancia del controlador

// Obtener todas las clientes
router.get("/", PersonasController.getAllPersonas);

// Obtener una cliente por ID
router.get("/:id",  PersonasController.getPersonasById);

// Crear una nueva cliente
router.post("/",  camposPersona, PersonasController.createPersona);

// Actualizar una cliente
router.put("/:id",  camposPersona, PersonasController.updatePersona);

// Actualizar parcialmente una cliente
router.patch("/:id",  parcialesPersona, PersonasController.updatePersona);

// Eliminar una cliente
router.delete("/:id",  PersonasController.deletePersona);

export default router;
