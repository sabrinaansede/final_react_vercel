import express from "express";
import {
  subscribeToPush,
  sendNotification,
  getUserNotifications,
  markNotificationAsRead,
  getAllNotifications,
} from "../controllers/notificaciones.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Suscribirse a notificaciones push
router.post("/subscribe", authenticateToken, subscribeToPush);

// Enviar notificación (solo admin)
router.post("/send", authenticateToken, isAdmin, sendNotification);

// Obtener notificaciones del usuario autenticado
router.get("/user", authenticateToken, getUserNotifications);

// Marcar notificación como leída
router.put("/:notificationId/read", authenticateToken, markNotificationAsRead);

// Obtener todas las notificaciones (solo admin)
router.get("/all", authenticateToken, isAdmin, getAllNotifications);

export default router;
