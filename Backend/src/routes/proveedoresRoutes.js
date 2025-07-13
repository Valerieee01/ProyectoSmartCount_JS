import express from "express";

import { verifyToken } from "../middlewares/auth/index.js";
import proveedoresController from "../controllers/proveedoresController.js";
import {parcialesProveedores} from "../middlewares/proveedores/parcialesProveedor.js";
import {camposProveedores} from "../middlewares/proveedores/camposProveedor.js";

const router = express.Router();
// Creamos una instancia del controlador

// Obtener todas las clientes
router.get("/", verifyToken,proveedoresController.getAllProveedores);

// Obtener una cliente por ID
router.get("/:id", verifyToken, proveedoresController.getProveedoresById);

// Crear una nueva cliente
router.post("/", verifyToken, camposProveedores, proveedoresController.createProveedor);

// Actualizar una cliente
router.put("/:id", verifyToken, camposProveedores, proveedoresController.updateProveedor);

// Actualizar parcialmente una cliente
router.patch("/:id", verifyToken, parcialesProveedores, proveedoresController.updateProveedor);

// Eliminar una cliente
router.delete("/:id",verifyToken, proveedoresController.deleteProveedor);

export default router;
