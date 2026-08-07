import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const NotificationPermission = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Verificar si el navegador soporta notificaciones
    if (!('Notification' in window)) {
      return;
    }

    // Verificar si el usuario ya rechazó
    if (localStorage.getItem('notificationDismissed') === 'true') {
      return;
    }

    // Verificar si ya se solicitó permiso
    if (Notification.permission === 'default') {
      // Mostrar el banner después de 3 segundos
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const registerSubscription = async (subscription) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No hay token de autenticación');
        return;
      }

      const response = await fetch(`${API_URL}/api/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Error al registrar suscripción');
      }

      console.log('Suscripción registrada exitosamente');
    } catch (error) {
      console.error('Error al registrar suscripción:', error);
    }
  };

  const requestPermission = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Permiso de notificaciones concedido');

        // Registrar Service Worker
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registrado:', registration);

            // Suscribirse a push notifications
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(process.env.VITE_VAPID_PUBLIC_KEY || 'BNzxKrUNcbr_TCgNKDNoIv9xTWByOKGTF67LMOVAtbQ1hhQJmJQTWCiJGnWFSOsuqx4M9iWpYGMbYfUhUfneg_g'),
            });

            console.log('Suscripción push creada:', subscription);
            await registerSubscription(subscription);
          } catch (error) {
            console.error('Error al registrar Service Worker o suscripción:', error);
          }
        }

        setShow(false);
      } else {
        setShow(false);
      }
    } catch (error) {
      console.error('Error al solicitar permiso de notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismiss = () => {
    setShow(false);
    // Guardar que el usuario rechazó para no mostrar de nuevo
    localStorage.setItem('notificationDismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[1000] p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-[#43A1F2] to-[#2E7BB8] rounded-xl flex items-center justify-center">
            <Bell size={24} className="text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1">Activar notificaciones</h3>
          <p className="text-sm text-gray-600 mb-3">
            Recibí alertas importantes sobre lugares seguros, eventos y actualizaciones de la comunidad.
          </p>
          <div className="flex gap-2">
            <button
              onClick={requestPermission}
              disabled={loading}
              className="flex-1 bg-[#43A1F2] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#2E7BB8] transition-colors disabled:opacity-50"
            >
              {loading ? 'Activando...' : 'Activar'}
            </button>
            <button
              onClick={dismiss}
              className="px-4 py-2 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

// Función auxiliar para convertir VAPID key de base64 a Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default NotificationPermission;
