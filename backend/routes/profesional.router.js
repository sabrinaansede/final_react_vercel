import express from "express";
import {
  crearProfesional,
  listarProfesionales,
  obtenerProfesional,
  actualizarProfesional,
  eliminarProfesional,
  obtenerEspecialidades,
  obtenerUbicaciones
} from "../controllers/profesional.controller.js";

const router = express.Router();

router.post("/", crearProfesional);
router.get("/", listarProfesionales);
router.get("/especialidades", obtenerEspecialidades);
router.get("/ubicaciones", obtenerUbicaciones);
router.get("/:id", obtenerProfesional);
router.put("/:id", actualizarProfesional);
router.delete("/:id", eliminarProfesional);

export default router;
