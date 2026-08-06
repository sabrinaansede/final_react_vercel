import express from "express";
import {
  obtenerRegistros,
  crearRegistro,
  obtenerRegistroPorId,
  actualizarRegistro,
  eliminarRegistro,
  obtenerRegistrosPorUsuario
} from "../controllers/registroEmocional.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Rutas públicas (solo lectura)
router.get("/", obtenerRegistros);
router.get("/:id", obtenerRegistroPorId);
router.get("/usuario/:usuarioId", obtenerRegistrosPorUsuario);

// Rutas protegidas (requieren autenticación)
router.post("/", authMiddleware, crearRegistro);
router.put("/:id", authMiddleware, actualizarRegistro);
router.delete("/:id", authMiddleware, eliminarRegistro);

export default router;
