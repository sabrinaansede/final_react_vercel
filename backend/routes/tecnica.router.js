import express from "express";
import {
  obtenerTecnicas,
  crearTecnica,
  obtenerTecnicaPorId,
  actualizarTecnica,
  eliminarTecnica
} from "../controllers/tecnica.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", obtenerTecnicas);
router.post("/", authMiddleware, crearTecnica);
router.get("/:id", obtenerTecnicaPorId);
router.put("/:id", authMiddleware, actualizarTecnica);
router.delete("/:id", authMiddleware, eliminarTecnica);

export default router;
