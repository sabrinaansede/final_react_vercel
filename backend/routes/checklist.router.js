import express from "express";
import {
  getChecklistsByUsuario,
  createChecklist,
  updateChecklist,
  deleteChecklist,
  getChecklistById,
} from "../controllers/checklist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Obtener todos los checklists de un usuario
router.get("/usuario/:usuarioId", authMiddleware, getChecklistsByUsuario);

// Obtener un checklist por ID
router.get("/:id", authMiddleware, getChecklistById);

// Crear un nuevo checklist
router.post("/", authMiddleware, createChecklist);

// Actualizar un checklist
router.put("/:id", authMiddleware, updateChecklist);

// Eliminar un checklist
router.delete("/:id", authMiddleware, deleteChecklist);

export default router;
