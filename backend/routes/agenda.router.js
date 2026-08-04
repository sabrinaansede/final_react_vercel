import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { crearEvento, listarEventos, obtenerEventosUsuario, obtenerEvento, actualizarEvento, eliminarEvento } from "../controllers/agenda.controller.js";

const router = express.Router();

// Rutas de Agenda (sin authMiddleware temporalmente para probar)
router.get("/usuario/:usuarioId", obtenerEventosUsuario);
router.post("/", crearEvento);
router.get("/", listarEventos);
router.get("/:id", obtenerEvento);
router.put("/", actualizarEvento);
router.delete("/:id", eliminarEvento);

export default router;
