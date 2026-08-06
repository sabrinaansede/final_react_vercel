import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, Users, MessageCircle, User } from 'lucide-react';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home, path: '/' },
    { id: 'comunidad', label: 'Comunidad', icon: MessageCircle, path: '/comunidad' },
    { id: 'mapa', label: 'Mapa', icon: MapPin, path: '/mapa' },
    { id: 'profesionales', label: 'Profesionales', icon: Users, path: '/profesionales' },
    { id: 'perfil', label: 'Perfil', icon: User, path: '/perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t border-gray-200 py-2 z-[1000] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.id}
            className={`flex flex-col items-center gap-1 px-3 py-2 border-none bg-none cursor-pointer text-gray-600 transition-all rounded-lg hover:bg-gray-100 ${isActive ? 'text-[#43A1F2]' : ''}`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNavigation;
