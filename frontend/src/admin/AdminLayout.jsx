import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  MessageSquare,
  Bell,
  FileText,
  LogOut,
  Menu,
  X,
  Search,
  Stethoscope,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'profesionales', label: 'Profesionales', icon: Stethoscope, path: '/admin/profesionales' },
    { id: 'contenido', label: 'Contenido', icon: FileText, path: '/admin/contenido' },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell, path: '/admin/notificaciones' },
    { id: 'lugares', label: 'Gestión de Lugares', icon: MapPin, path: '/admin/lugares' },
    { id: 'comunidad', label: 'Comunidad', icon: MessageSquare, path: '/admin/comunidad' },
    { id: 'usuarios', label: 'Usuarios', icon: Users, path: '/admin/usuarios' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-lg ${
        sidebarOpen ? 'w-64' : 'w-0'
      } ${!isMobile ? 'lg:w-64' : 'lg:w-20'}`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#43A1F2] to-[#2E7BB8] flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            {sidebarOpen && (
              <div>
                <span className="text-lg font-bold text-gray-900">AutiSi</span>
                <span className="text-xs font-semibold text-[#43A1F2] ml-2">Admin</span>
              </div>
            )}
          </div>
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} className="text-gray-600" /> : <Menu size={20} className="text-gray-600" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="list-none p-0 m-0">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="mb-1">
                  <button
                    className={`w-full flex items-center gap-3 px-6 py-3 bg-transparent border-none text-sm font-medium cursor-pointer transition-all text-left hover:bg-gray-50 ${
                      isActive(item.path) 
                        ? 'text-[#43A1F2] bg-[#43A1F2]/5 border-r-4 border-[#43A1F2]' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setSidebarOpen(false);
                    }}
                  >
                    <Icon size={20} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#43A1F2] to-[#2E7BB8] flex items-center justify-center text-white font-semibold">
              {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-900 block">{user?.nombre || 'Administrador'}</span>
                <span className="text-xs text-gray-500">Administrador</span>
              </div>
            )}
          </div>
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg cursor-pointer transition-all hover:bg-red-100"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      } ml-0`}>
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {!isMobile && (
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
              >
                <Menu size={20} className="text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900 m-0">
                {menuItems.find(item => isActive(item.path))?.label || 'Panel de Administración'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-64">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="border-none bg-transparent outline-none ml-2 text-sm text-gray-900 w-full placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
