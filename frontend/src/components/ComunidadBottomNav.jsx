import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';

const ComunidadBottomNav = ({ onCreateClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="comunidad-bottom-nav fixed bottom-0 left-0 right-0 z-[1000] md:hidden"
      aria-label="Navegación de comunidad"
    >
      <button
        type="button"
        className={`comunidad-nav-item ${isActive('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <span aria-hidden>🏠</span>
        <span>Inicio</span>
      </button>

      <button
        type="button"
        className={`comunidad-nav-item ${isActive('/comunidad') ? 'active' : ''}`}
        onClick={() => navigate('/comunidad')}
      >
        <span aria-hidden>👥</span>
        <span>Comunidad</span>
      </button>

      <button
        type="button"
        className="comunidad-nav-create"
        onClick={onCreateClick}
        aria-label="Crear publicación"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <button
        type="button"
        className={`comunidad-nav-item ${isActive('/comunidad/guardados') ? 'active' : ''}`}
        onClick={() => navigate('/comunidad/guardados')}
      >
        <span aria-hidden>🔖</span>
        <span>Guardados</span>
      </button>

      <button
        type="button"
        className={`comunidad-nav-item ${isActive('/perfil') ? 'active' : ''}`}
        onClick={() => navigate('/perfil')}
      >
        <span aria-hidden>👤</span>
        <span>Perfil</span>
      </button>
    </nav>
  );
};

export default ComunidadBottomNav;
