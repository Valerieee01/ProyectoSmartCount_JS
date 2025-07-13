import express from "express";

import { verifyToken } from "../middlewares/auth/index.js";
import ClientesController from "../controllers/clientesController.js";
import {parcialesCliente} from "../middlewares/clientes/parcialesCliente.js";
import {camposCliente} from "../middlewares/clientes/camposCliente.js";

const router = express.Router();
// Creamos una instancia del controlador

// Obtener todas las clientes
router.get("/", verifyToken,ClientesController.getAllClientes);

// Obtener una cliente por ID
router.get("/:id", verifyToken, ClientesController.getClientesById);

// Crear una nueva cliente
router.post("/", verifyToken, camposCliente, ClientesController.createClientes);

// Actualizar una cliente
router.put("/:id", verifyToken, camposCliente, ClientesController.updateClientes);

// Actualizar parcialmente una cliente
router.patch("/:id", verifyToken, parcialesCliente, ClientesController.updateClientes);

// Eliminar una cliente
router.delete("/:id", verifyToken, ClientesController.deleteCliente);

export default router;
