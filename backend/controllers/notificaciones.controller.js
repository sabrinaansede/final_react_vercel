import PushSubscription from "../models/pushSubscription.model.js";
import Notificacion from "../models/notificacion.model.js";
import webpush from "web-push";

// Configurar VAPID keys
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (!publicVapidKey || !privateVapidKey) {
  console.warn('VAPID keys not configured. Push notifications will not work.');
} else {
  webpush.setVapidDetails(
    'mailto:contacto@autisi.com',
    publicVapidKey,
    privateVapidKey
  );
}

// Suscribirse a notificaciones push
export const subscribeToPush = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    const usuarioId = req.user.id;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({ message: "Datos de suscripción inválidos" });
    }

    // Verificar si ya existe una suscripción para este usuario y endpoint
    const existingSubscription = await PushSubscription.findOne({
      usuario: usuarioId,
      endpoint,
    });

    if (existingSubscription) {
      // Actualizar suscripción existente
      existingSubscription.keys = keys;
      existingSubscription.isActive = true;
      existingSubscription.userAgent = req.headers['user-agent'];
      await existingSubscription.save();
      return res.status(200).json({ message: "Suscripción actualizada" });
    }

    // Crear nueva suscripción
    const newSubscription = new PushSubscription({
      usuario: usuarioId,
      endpoint,
      keys,
      userAgent: req.headers['user-agent'],
    });

    await newSubscription.save();
    res.status(201).json({ message: "Suscripción registrada exitosamente" });
  } catch (error) {
    console.error("Error al suscribirse a notificaciones:", error);
    res.status(500).json({ message: "Error al registrar suscripción" });
  }
};

// Enviar notificación push
export const sendNotification = async (req, res) => {
  try {
    const { titulo, mensaje, tipo, url, targetAudience, targetUsers } = req.body;
    const enviadoPor = req.user.id;

    if (!titulo || !mensaje) {
      return res.status(400).json({ message: "Título y mensaje son requeridos" });
    }

    // Obtener suscripciones activas según el público objetivo
    let subscriptions;
    if (targetAudience === 'specific' && targetUsers && targetUsers.length > 0) {
      subscriptions = await PushSubscription.find({
        usuario: { $in: targetUsers },
        isActive: true,
      });
    } else if (targetAudience === 'registered') {
      subscriptions = await PushSubscription.find({ isActive: true });
    } else {
      subscriptions = await PushSubscription.find({ isActive: true });
    }

    if (subscriptions.length === 0) {
      return res.status(404).json({ message: "No hay suscripciones activas" });
    }

    // Preparar payload de la notificación
    const payload = JSON.stringify({
      title: titulo,
      body: mensaje,
      type: tipo || 'info',
      url: url || '/',
      notificationId: Date.now(),
    });

    // Enviar notificaciones
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(subscription, payload);
          return { success: true, endpoint: subscription.endpoint };
        } catch (error) {
          console.error("Error al enviar notificación:", error);
          // Desactivar suscripción fallida
          await PushSubscription.findByIdAndUpdate(subscription._id, { isActive: false });
          return { success: false, endpoint: subscription.endpoint, error: error.message };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    // Guardar notificación en base de datos
    const newNotificacion = new Notificacion({
      titulo,
      mensaje,
      tipo: tipo || 'info',
      url: url || '/',
      targetAudience: targetAudience || 'all',
      targetUsers: targetUsers || [],
      enviadoPor,
      enviadoAt: new Date(),
      recipientsCount: successful,
      readCount: 0,
    });

    await newNotificacion.save();

    // Emitir evento en tiempo real a través de Socket.IO
    try {
      const io = req.app && req.app.get && req.app.get('io');
      if (io) io.emit('new-notification', newNotificacion);
    } catch (e) {
      console.warn('No se pudo emitir evento socket (notificación):', e.message);
    }

    res.status(200).json({
      message: "Notificaciones enviadas",
      successful,
      failed,
      notificationId: newNotificacion._id,
    });
  } catch (error) {
    console.error("Error al enviar notificación:", error);
    res.status(500).json({ message: "Error al enviar notificación" });
  }
};

// Obtener notificaciones del usuario autenticado
export const getUserNotifications = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const notificaciones = await Notificacion.find({
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'registered' },
        { targetUsers: usuarioId },
      ],
    })
      .sort({ enviadoAt: -1 })
      .limit(50);

    // Marcar notificaciones como leídas si ya fueron leídas por este usuario
    const notificacionesConEstado = notificaciones.map(notif => ({
      ...notif.toObject(),
      read: notif.leidoPor.some(leido => leido.usuario.toString() === usuarioId),
    }));

    res.status(200).json(notificacionesConEstado);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};

// Marcar notificación como leída
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const usuarioId = req.user.id;

    const notificacion = await Notificacion.findById(notificationId);
    if (!notificacion) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    // Verificar si ya fue leída por este usuario
    const yaLeida = notificacion.leidoPor.some(leido => leido.usuario.toString() === usuarioId);
    if (!yaLeida) {
      notificacion.leidoPor.push({ usuario: usuarioId, leidoAt: new Date() });
      notificacion.readCount += 1;
      await notificacion.save();
    }

    res.status(200).json({ message: "Notificación marcada como leída" });
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    res.status(500).json({ message: "Error al marcar notificación como leída" });
  }
};

// Obtener todas las notificaciones (solo admin)
export const getAllNotifications = async (req, res) => {
  try {
    const notificaciones = await Notificacion.find()
      .sort({ enviadoAt: -1 })
      .limit(100);

    res.status(200).json(notificaciones);
  } catch (error) {
    console.error("Error al obtener todas las notificaciones:", error);
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};
