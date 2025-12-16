import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [scrolled, setScrolled] = useState(false);

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
        <div className="nav-links">
          {usuario ? (
            <>
              <NavLink to="/" className="nav-link" end>
                Inicio
              </NavLink>
              <NavLink to="/mapa" className="nav-link">
                Mapa
              </NavLink>
              <NavLink to="/contacto" className="nav-link">
                Contacto
              </NavLink>
              <NavLink to="/perfil" className="nav-link">
                Perfil
              </NavLink>

              <button onClick={handleLogout} className="nav-button danger">
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Iniciar sesión
              </NavLink>
              <NavLink to="/registro" className="nav-link">
                Crear cuenta
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
