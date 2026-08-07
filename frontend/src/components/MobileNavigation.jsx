import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, Users, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestMode } = useAuth();

  const isSignedIn = Boolean(user) && !guestMode;

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home, path: '/' },
    { id: 'mapa', label: 'Mapa', icon: MapPin, path: '/mapa' },
    { id: 'comunidad', label: 'Comunidad', icon: MessageCircle, path: '/comunidad' },
    ...(isSignedIn ? [{ id: 'profesionales', label: 'Profesionales', icon: Users, path: '/profesionales' }] : []),
    { id: 'perfil', label: 'Perfil', icon: User, path: '/perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-end bg-white/90 backdrop-blur-lg border-t border-gray-200/50 py-3 pb-6 z-[1000] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden rounded-t-3xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
            className={`flex flex-col items-center gap-1 px-4 py-2 border-none bg-none cursor-pointer rounded-xl ${isActive ? 'text-[#43A1F2]' : 'text-gray-500 hover:text-[#43A1F2]'}`}
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNavigation;
