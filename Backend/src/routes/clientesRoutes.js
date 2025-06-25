import express from "express";

import { verifyToken } from "../middlewares/auth/index.js";
import ClientesController from "../controllers/clientesController.js";
import {parcialesCliente} from "../middlewares/clientes/parcialesCliente.js";
import {camposCliente} from "../middlewares/clientes/camposCliente.js";




const router = express.Router();
// Creamos una instancia del controlador

// Obtener todas las clientes
router.get("/",  ClientesController.getAllClientes);

// Obtener una cliente por ID
router.get("/:id",  ClientesController.getClientesById);

// Crear una nueva cliente
router.post("/",  camposCliente, ClientesController.createClientes);

// Actualizar una cliente
router.put("/:id",  camposCliente, ClientesController.updateClientes);

// Actualizar parcialmente una cliente
router.patch("/:id",  parcialesCliente, ClientesController.updateClientes);

// Eliminar una cliente
router.delete("/:id",  ClientesController.deleteCliente);

export default router;
