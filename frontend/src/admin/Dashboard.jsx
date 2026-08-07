import React, { useState, useEffect } from 'react';
import {
  Users,
  MapPin,
  MessageSquare,
  Star,
  Clock,
  Bell,
  FileText,
  Stethoscope,
  RefreshCw,
  Activity,
  Mail,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    usuarios: 0,
    lugares: 0,
    publicaciones: 0,
    reseñas: 0,
    profesionales: 0,
    articulos: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // En una implementación real, estos datos vendrían del backend
      // Por ahora usamos datos de ejemplo
      setStats({
        usuarios: 1247,
        lugares: 89,
        publicaciones: 456,
        reseñas: 1234,
        profesionales: 45,
        articulos: 23,
      });

      setRecentActivities([
        { id: 1, type: 'lugar', message: 'Nuevo lugar agregado: "Café Posible"', time: 'Hace 5 minutos', user: 'Admin' },
        { id: 2, type: 'usuario', message: 'Nuevo usuario registrado: María G.', time: 'Hace 12 minutos', user: 'Sistema' },
        { id: 3, type: 'publicacion', message: 'Publicación reportada en Comunidad', time: 'Hace 25 minutos', user: 'Usuario' },
        { id: 4, type: 'resena', message: 'Nueva reseña en "Bullrich APADEA"', time: 'Hace 1 hora', user: 'Juan P.' },
        { id: 5, type: 'lugar', message: 'Lugar actualizado: "Abasto APADEA"', time: 'Hace 2 horas', user: 'Admin' },
        { id: 6, type: 'profesional', message: 'Nuevo profesional agregado: Dr. García', time: 'Hace 3 horas', user: 'Admin' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#43A1F2] rounded-full animate-spin"></div>
        <p className="text-gray-600">Cargando dashboard...</p>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lugar': return { icon: MapPin, bg: 'bg-blue-100', color: 'text-[#43A1F2]', label: 'Lugar' };
      case 'usuario': return { icon: Users, bg: 'bg-green-100', color: 'text-green-600', label: 'Usuario' };
      case 'publicacion': return { icon: MessageSquare, bg: 'bg-purple-100', color: 'text-purple-600', label: 'Publicación' };
      case 'resena': return { icon: Star, bg: 'bg-yellow-100', color: 'text-yellow-600', label: 'Reseña' };
      case 'profesional': return { icon: Stethoscope, bg: 'bg-pink-100', color: 'text-pink-600', label: 'Profesional' };
      default: return { icon: MessageSquare, bg: 'bg-gray-100', color: 'text-gray-600', label: 'General' };
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        {/* User Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#43A1F2] to-[#2E7BB8] flex items-center justify-center text-white font-semibold text-lg">
              {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user?.nombre || 'Administrador'}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Mail size={12} />
                {user?.email || 'admin@autisi.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => navigate('/admin')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-[#43A1F2] text-white transition-colors"
              >
                <Activity size={18} />
                <span>Resumen</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/profesionales')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Stethoscope size={18} />
                <span>Profesionales</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/contenido')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FileText size={18} />
                <span>Contenido</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/notificaciones')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Bell size={18} />
                <span>Notificaciones</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/lugares')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <MapPin size={18} />
                <span>Lugares</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/comunidad')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <MessageSquare size={18} />
                <span>Comunidad</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/usuarios')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Users size={18} />
                <span>Usuarios</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">Acciones Rápidas</h4>
          <div className="space-y-1">
            <button
              onClick={() => navigate('/admin/profesionales')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Stethoscope size={16} />
              <span>Crear Profesional</span>
            </button>
            <button
              onClick={() => navigate('/admin/contenido')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FileText size={16} />
              <span>Publicar Contenido</span>
            </button>
            <button
              onClick={() => navigate('/admin/notificaciones')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Bell size={16} />
              <span>Enviar Notificación</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-sm text-gray-500 mt-1">Bienvenido al panel de administración, {user?.nombre?.split(' ')[0] || 'Administrador'}. Gestiona profesionales, contenido y configura la plataforma.</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#43A1F2] text-white text-sm font-medium rounded-lg hover:bg-[#2E7BB8] transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Actualizar
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users size={20} className="text-[#43A1F2]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.usuarios.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Usuarios Registrados</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <MapPin size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.lugares}</div>
                  <div className="text-sm text-gray-500">Lugares Cargados</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <MessageSquare size={20} className="text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.publicaciones}</div>
                  <div className="text-sm text-gray-500">Publicaciones</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Star size={20} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.reseñas.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Reseñas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity) => {
                  const { icon: ActivityIcon, bg, color } = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg} ${color} flex-shrink-0`}>
                        <ActivityIcon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
