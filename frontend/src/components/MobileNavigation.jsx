import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, MessageCircle, Heart, User, Info, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestMode } = useAuth();

  const isSignedIn = Boolean(user) && !guestMode;

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home, path: '/' },
    { id: 'mapa', label: 'Explorar', icon: MapPin, path: '/mapa' },
    { id: 'comunidad', label: 'Comunidad', icon: MessageCircle, path: '/comunidad' },
    { id: 'informacion', label: 'Información', icon: Info, path: '/informacion-autismo' },
    { id: 'tecnicas', label: 'Técnicas', icon: Lightbulb, path: '/tecnicas' },
    ...(isSignedIn ? [{ id: 'perfil', label: 'Perfil', icon: User, path: '/perfil' }] : []),
  ];

  return (
    <nav 
      className="mobile-navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrapper">
              <Icon size={22} className="mobile-nav-icon" />
            </div>
            <span className="mobile-nav-label">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNavigation;
