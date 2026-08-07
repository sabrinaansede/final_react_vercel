import express from "express";
import {
  crearArticulo,
  listarArticulos,
  obtenerArticulo,
  actualizarArticulo,
  eliminarArticulo,
} from "../controllers/articulo.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Crear artículo (solo admin)
router.post("/", authenticateToken, isAdmin, crearArticulo);

// Listar artículos (público)
router.get("/", listarArticulos);

// Obtener artículo por ID (público)
router.get("/:id", obtenerArticulo);

// Actualizar artículo (solo admin)
router.put("/:id", authenticateToken, isAdmin, actualizarArticulo);

// Eliminar artículo (solo admin)
router.delete("/:id", authenticateToken, isAdmin, eliminarArticulo);

export default router;
