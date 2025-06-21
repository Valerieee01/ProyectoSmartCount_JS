import express from "express";
import CategoriaController from "../controllers/categoriaController.js";
import { camposCategoria, parcialesCategoria } from "../middlewares/categorias/index.js";
import { verifyToken } from "../middlewares/auth/index.js";




const router = express.Router();
// Creamos una instancia del controlador

// Obtener todas las categorías
router.get("/", verifyToken, CategoriaController.getAllCategorias);

// Obtener una categoría por ID
router.get("/:id", verifyToken, CategoriaController.getCategoriaById);

// Crear una nueva categoría
router.post("/", verifyToken, camposCategoria, CategoriaController.createCategoria);

// Actualizar una categoría
router.put("/:id", verifyToken, camposCategoria, CategoriaController.updateCategoria);

// Actualizar parcialmente una categoría
router.patch("/:id", verifyToken, parcialesCategoria, CategoriaController.updateCategoria);

// Eliminar una categoría
router.delete("/:id", verifyToken, CategoriaController.deleteCategoria);

export default router;
