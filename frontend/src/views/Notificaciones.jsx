import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X, Trash2, Filter, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const notificationTypes = {
  info: { label: 'Informativa', icon: Info, color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200' },
  success: { label: 'Éxito', icon: CheckCircle, color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-600', borderColor: 'border-green-200' },
  warning: { label: 'Advertencia', icon: AlertTriangle, color: 'orange', bgColor: 'bg-orange-50', textColor: 'text-orange-600', borderColor: 'border-orange-200' },
  emergency: { label: 'Emergencia', icon: AlertTriangle, color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-200' },
};

const Notificaciones = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nuevo lugar certificado',
      message: 'Se ha agregado el Centro Cultural APADEA a la lista de lugares certificados. Este lugar cuenta con personal capacitado y adaptaciones sensoriales.',
      type: 'success',
      createdAt: 'Hace 2 horas',
      read: false,
      url: '/mapa',
    },
    {
      id: 2,
      title: 'Cambio de horarios',
      message: 'El Shopping Abasto ha modificado sus horarios de atención para personas con TEA. Ahora disponible de 10:00 a 18:00.',
      type: 'warning',
      createdAt: 'Hace 1 día',
      read: true,
      url: '/mapa',
    },
    {
      id: 3,
      title: 'Mantenimiento programado',
      message: 'La aplicación estará en mantenimiento el domingo de 2:00 a 4:00 AM por actualizaciones importantes.',
      type: 'info',
      createdAt: 'Hace 3 días',
      read: true,
      url: '/',
    },
    {
      id: 4,
      title: 'Nueva funcionalidad disponible',
      message: 'Ya podés agregar lugares al mapa directamente desde tu dispositivo móvil. ¡Probá la nueva función!',
      type: 'info',
      createdAt: 'Hace 5 días',
      read: true,
      url: '/mapa',
    },
    {
      id: 5,
      title: 'Alerta de cierre temporal',
      message: 'El Parque de la Costa estará cerrado por mantenimiento hasta el próximo lunes.',
      type: 'emergency',
      createdAt: 'Hace 1 semana',
      read: true,
      url: '/mapa',
    },
  ]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [filterType, setFilterType] = useState('all'); // all, info, success, warning, emergency

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'read' && !n.read) return false;
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-[calc(100vh-94px)] bg-[#f9fafb] px-4 py-4 pb-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-8">
          <h1 className="text-[30px] font-bold text-[#111827] mb-2">Centro de Notificaciones</h1>
          <p className="text-base text-[#6b7280]">
            {unreadCount > 0 ? `Tenés ${unreadCount} notificaciones sin leer` : 'Todas tus notificaciones están al día'}
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all' ? 'bg-[#43A1F2] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === 'unread' ? 'bg-[#43A1F2] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sin leer
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === 'read' ? 'bg-[#43A1F2] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Leídas
              </button>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-600 hover:bg-green-200 transition-all"
              >
                <Check size={16} />
                Marcar todas como leídas
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700 mr-2">Tipo:</span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === 'all' ? 'bg-[#43A1F2] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {Object.entries(notificationTypes).map(([key, type]) => {
              const Icon = type.icon;
              return (
                <button
                  key={key}
                  onClick={() => setFilterType(key)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                    filterType === key ? 'bg-[#43A1F2] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={14} />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="flex flex-col gap-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <Bell size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay notificaciones que coincidan con los filtros seleccionados.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const typeConfig = notificationTypes[notification.type];
              const Icon = typeConfig.icon;
              
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl p-5 shadow-sm border transition-all hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-[#43A1F2] border-gray-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${typeConfig.bgColor}`}>
                      <Icon size={24} className={typeConfig.textColor} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-[#1e293b] mb-1 ${!notification.read ? 'text-[#111827]' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-[#475569] leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-[#43A1F2] rounded-full flex-shrink-0 ml-2 mt-2"></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-[#64748b]">{notification.createdAt}</span>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                            >
                              <Check size={14} />
                              Marcar como leída
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                          >
                            <Trash2 size={14} />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notificaciones;
