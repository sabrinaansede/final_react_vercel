import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  obtenerLugares,
  crearLugar,
  votarLugar,
  subirFotoLugar
} from "../controllers/lugar.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const base = path.basename(file.originalname || "foto", ext).replace(/[^a-z0-9-_]/gi, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});
const upload = multer({ storage });

router.get("/", obtenerLugares);
router.post("/", crearLugar);
router.put("/:id/votar", authMiddleware, votarLugar);
router.post("/:id/foto", upload.single('foto'), subirFotoLugar);

export default router;
