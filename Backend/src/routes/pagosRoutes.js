import express from "express";

import { verifyToken } from "../middlewares/auth/index.js";
import { parcialesPagos} from "../middlewares/pagos/parcialesPagos.js";
import {camposPagos} from "../middlewares/pagos/camposPagos.js";
import PagoController from "../controllers/pagosController.js";



const router = express.Router();
// Creamos una instancia del controlador

// Obtener todas los pagos
router.get("/", verifyToken, PagoController.getAllPagos);

// Obtener un pago por ID
router.get("/:id", verifyToken, PagoController.getPagosById);

// Crear un nueva pago
router.post("/", verifyToken, camposPagos, PagoController.createPago);

// Actualizar un pago
router.put("/:id", verifyToken, camposPagos, PagoController.updatePago);

// Actualizar parcialmente un pago
router.patch("/:id", verifyToken, parcialesPagos, PagoController.updatePago);

// Eliminar un pago
router.delete("/:id", verifyToken, PagoController.deletePago);

export default router;
