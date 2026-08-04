import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Home, MapPin, Users, BookOpen, CheckSquare, MessageCircle, Mail, User, UserPlus } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  // Efecto para manejar la autenticación
  useEffect(() => {
    try {
      const raw = localStorage.getItem("usuario");
      setUsuario(raw ? JSON.parse(raw) : null);
    } catch {}
    
    const onStorage = () => {
      try {
        const raw = localStorage.getItem("usuario");
        setUsuario(raw ? JSON.parse(raw) : null);
      } catch {}
    };
    
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/", { replace: true });
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand flex items-center gap-2">
          <img
            src={logo}
            alt="Autisi Logo"
            className="navbar-logo"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentNode.textContent = "AUTISI";
            }}
          />
        </Link>
        {/* Desktop simplified nav */}
        <div className="nav-links-desktop">
          <NavLink to="/" className="nav-link" end>
            Inicio
          </NavLink>
          <NavLink to="/mapa" className="nav-link">
            Mapa
          </NavLink>
          <NavLink to="/checklist" className="nav-link">
            Checklist
          </NavLink>
          <NavLink to="/profesionales" className="nav-link">
            Profesionales
          </NavLink>
          <NavLink to="/perfil" className="nav-link">
            Perfil
          </NavLink>
          {usuario && (
            <button onClick={handleLogout} className="nav-button danger">
              Salir
            </button>
          )}
        </div>
        
        <button 
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {
          mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
        }
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`} role="navigation" aria-label="Menú principal">
          <div className="mobile-drawer-header">
            <div className="mobile-drawer-brand">
              <img src={logo} alt="Autisi" className="mobile-drawer-logo" />
            </div>
          </div>
          {usuario ? (
            <>
              <NavLink to="/" className="nav-link mobile-nav-item" end onClick={() => setMobileMenuOpen(false)}>
                <Home size={20} />
                <span>Inicio</span>
              </NavLink>
              <NavLink to="/mapa" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <MapPin size={20} />
                <span>Mapa</span>
              </NavLink>
              <NavLink to="/profesionales" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Users size={20} />
                <span>Profesionales</span>
              </NavLink>
              <NavLink to="/tecnicas" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <BookOpen size={20} />
                <span>Técnicas</span>
              </NavLink>
              <NavLink to="/checklist" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <CheckSquare size={20} />
                <span>Checklist</span>
              </NavLink>
              <NavLink to="/mis-resenas" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <MessageCircle size={20} />
                <span>Mis reseñas</span>
              </NavLink>
              <NavLink to="/contacto" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Mail size={20} />
                <span>Contacto</span>
              </NavLink>
              <NavLink to="/perfil" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <User size={20} />
                <span>Perfil</span>
              </NavLink>

              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="nav-button danger">
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" className="nav-link mobile-nav-item" end onClick={() => setMobileMenuOpen(false)}>
                <Home size={20} />
                <span>Inicio</span>
              </NavLink>
              <NavLink to="/mapa" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <MapPin size={20} />
                <span>Mapa</span>
              </NavLink>
              <NavLink to="/profesionales" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Users size={20} />
                <span>Profesionales</span>
              </NavLink>
              <NavLink to="/tecnicas" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <BookOpen size={20} />
                <span>Técnicas</span>
              </NavLink>
              <NavLink to="/checklist" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <CheckSquare size={20} />
                <span>Checklist</span>
              </NavLink>
              <NavLink to="/contacto" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Mail size={20} />
                <span>Contacto</span>
              </NavLink>
              <NavLink to="/login" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <UserPlus size={20} />
                <span>Iniciar sesión</span>
              </NavLink>
              <NavLink to="/registro" className="nav-link mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <UserPlus size={20} />
                <span>Crear cuenta</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
