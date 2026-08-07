import React, { useState } from 'react';
import { Bell, Send, AlertTriangle, Info, CheckCircle, Clock, Trash2, Eye, X } from 'lucide-react';
import AdminPageLayout from './AdminPageLayout.jsx';

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const notificationTypes = [
  { id: 'info', label: 'Informativa', icon: Info, color: 'blue' },
  { id: 'success', label: 'Éxito', icon: CheckCircle, color: 'green' },
  { id: 'warning', label: 'Advertencia', icon: AlertTriangle, color: 'orange' },
  { id: 'emergency', label: 'Emergencia', icon: AlertTriangle, color: 'red' },
];

const Notifications = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    url: '/',
  });
  const [loading, setLoading] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([
    {
      id: 1,
      title: 'Nuevo lugar certificado',
      message: 'Se ha agregado el Centro Cultural APADEA a la lista de lugares certificados.',
      type: 'success',
      sentAt: 'Hace 2 horas',
      recipients: 1247,
      readCount: 856,
    },
    {
      id: 2,
      title: 'Cambio de horarios',
      message: 'El Shopping Abasto ha modificado sus horarios de atención para personas con TEA.',
      type: 'warning',
      sentAt: 'Hace 1 día',
      recipients: 1247,
      readCount: 1023,
    },
    {
      id: 3,
      title: 'Mantenimiento programado',
      message: 'La aplicación estará en mantenimiento el domingo de 2:00 a 4:00 AM.',
      type: 'info',
      sentAt: 'Hace 3 días',
      recipients: 1247,
      readCount: 1189,
    },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aquí se enviaría la notificación al backend
      const response = await fetch(`${API_URL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Agregar a la lista de notificaciones enviadas
        const newNotification = {
          id: Date.now(),
          title: formData.title,
          message: formData.message,
          type: formData.type,
          sentAt: 'Ahora mismo',
          recipients: 1247,
          readCount: 0,
        };
        setSentNotifications([newNotification, ...sentNotifications]);
        
        // Limpiar formulario
        setFormData({
          title: '',
          message: '',
          type: 'info',
          targetAudience: 'all',
          url: '/',
        });
      }
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'success': return 'bg-green-100 text-green-600 border-green-200';
      case 'warning': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'emergency': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    const typeObj = notificationTypes.find(t => t.id === type);
    return typeObj ? typeObj.icon : Info;
  };

  return (
    <AdminPageLayout 
      title="Notificaciones" 
      description="Envía notificaciones a los usuarios"
      actionButton={
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#43A1F2] text-white text-sm font-medium rounded-lg hover:bg-[#2E7BB8] transition-colors"
        >
          Enviar Notificación
        </button>
      }
    >
      <div className="space-y-8">
        {/* Form Card */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Nueva Notificación</h3>
                  <p className="text-sm text-gray-500 mt-1">Crea y envía una notificación push a los usuarios</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Notificación</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {notificationTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.id })}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            formData.type === type.id
                              ? 'border-[#43A1F2] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon size={24} className={formData.type === type.id ? 'text-[#43A1F2]' : 'text-gray-500'} />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
                    placeholder="Ej: Nuevo lugar disponible"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
                    placeholder="Escribe el mensaje de la notificación..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL de destino (opcional)</label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
                    placeholder="/lugares"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#43A1F2] text-white rounded-lg text-sm font-medium hover:bg-[#2E7BB8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Enviar Notificación
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Historial de Notificaciones</h3>
            <p className="text-sm text-gray-500 mt-1">{sentNotifications.length} notificaciones enviadas</p>
          </div>
          <div className="divide-y divide-gray-200">
            {sentNotifications.map((notification) => {
              const IconComponent = getTypeIcon(notification.type);
              return (
                <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                        <IconComponent size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{notification.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                            {notificationTypes.find(t => t.id === notification.type)?.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {notification.sentAt}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Eye size={14} />
                            {notification.readCount}/{notification.recipients} leídos
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSentNotifications(sentNotifications.filter(n => n.id !== notification.id));
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {sentNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay notificaciones enviadas</p>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default Notifications;
