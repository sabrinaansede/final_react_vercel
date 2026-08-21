import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, MessageCircle, Heart, User } from 'lucide-react';
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
    { id: 'emociones', label: 'Emociones', icon: Heart, path: '/' },
    ...(isSignedIn ? [{ id: 'perfil', label: 'Perfil', icon: User, path: '/perfil' }] : []),
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white/95 backdrop-blur-lg border-t border-gray-200/50 py-3 pb-5 px-4 z-[1000] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden"
      style={{ 
        boxShadow: 'var(--shadow-lg)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
            className="flex flex-col items-center gap-1.5 px-3 py-2 border-none bg-transparent cursor-pointer rounded-2xl transition-all duration-300"
            style={{
              color: isActive ? '#43A1F2' : '#6B7280',
            }}
          >
            <div 
              className="flex items-center justify-center transition-transform duration-300"
              style={{
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <Icon size={24} />
            </div>
            <span 
              className="text-xs font-semibold transition-all duration-300"
              style={{
                fontSize: isActive ? '12px' : '11px',
                opacity: isActive ? 1 : 0.7,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNavigation;
