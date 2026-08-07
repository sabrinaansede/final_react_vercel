import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Activity,
  Stethoscope,
  FileText,
  Bell,
  MapPin,
  MessageSquare,
  Users,
  LogOut,
  Mail,
  Calendar
} from 'lucide-react';

const AdminPageLayout = ({ children, title, description, actionButton }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'resumen', label: 'Resumen', icon: Activity, path: '/admin' },
    { id: 'profesionales', label: 'Profesionales', icon: Stethoscope, path: '/admin/profesionales' },
    { id: 'contenido', label: 'Contenido', icon: FileText, path: '/admin/contenido' },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell, path: '/admin/notificaciones' },
    { id: 'lugares', label: 'Lugares', icon: MapPin, path: '/admin/lugares' },
    { id: 'comunidad', label: 'Comunidad', icon: MessageSquare, path: '/admin/comunidad' },
    { id: 'usuarios', label: 'Usuarios', icon: Users, path: '/admin/usuarios' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <aside className="w-[280px] min-w-[280px] bg-white border-r border-black/5 flex flex-col fixed left-0 top-[72px] bottom-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-10 overflow-y-auto">
        <div className="p-6 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#43A1F2] to-[#2E7BB8] flex items-center justify-center text-white font-semibold text-lg">
              {user?.nombre?.charAt(0) || 'A'}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900">{user?.nombre || 'Admin'}</h3>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#43A1F2] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-black/5">
          <p className="text-xs font-semibold text-gray-500 mb-3 px-4">ACCIONES RÁPIDAS</p>
          <div className="space-y-1">
            <button
              onClick={() => navigate('/admin/profesionales')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              <Stethoscope size={18} className="text-gray-400" />
              <span>Agregar Profesional</span>
            </button>
            <button
              onClick={() => navigate('/admin/contenido')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              <FileText size={18} className="text-gray-400" />
              <span>Publicar Contenido</span>
            </button>
            <button
              onClick={() => navigate('/admin/notificaciones')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              <Bell size={18} className="text-gray-400" />
              <span>Enviar Notificación</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-black/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:-translate-y-px transition-all"
          >
            <LogOut size={20} className="text-gray-400" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="absolute left-[280px] top-[72px] right-0 bottom-0 bg-[#f8f9fa] overflow-y-auto">
        <div className="max-w-7xl mx-auto px-12 py-10 pt-16">
          <header className="mb-8">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h1>
                <p className="text-base text-gray-600 leading-relaxed max-w-2xl">{description}</p>
              </div>
              {actionButton && actionButton}
            </div>
          </header>
          <div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPageLayout;
