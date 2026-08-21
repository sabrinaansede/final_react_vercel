import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLanding from "../components/AuthLanding.jsx";
import MainExploreCard from "../components/MainExploreCard";
import QuickAccessGrid from "../components/QuickAccessGrid";
import RecommendedList from "../components/RecommendedList";
import ActiveChecklist from "../components/ActiveChecklist";
import EmergencyMode from "../components/EmergencyMode";
import { AlertTriangle, Frown, Meh, Smile, Star, Map, MessageSquare, Heart, CheckSquare, Lightbulb, Cloud, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './home.css';

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const LUGARES_DESTACADOS = [
  { _id: "dest-bullrich", nombre: "Bullrich APADEA", tipo: "Centro cultural", certificacion: "APADEA", rating: 4.8, distancia: "1.2 km" },
  { _id: "dest-abasto", nombre: "Abasto APADEA", tipo: "Shopping", certificacion: "APADEA", rating: 4.6, distancia: "2.4 km" },
  { _id: "dest-cafe", nombre: "Café Posible", tipo: "Cafetería", certificacion: "Comunidad", rating: 4.5, distancia: "0.8 km" },
];

const Home = () => {
  const navigate = useNavigate();
  const { guestMode } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [lugares, setLugares] = useState([]);
  const [estadoAnimo, setEstadoAnimo] = useState(null);
  const [emergencyModeOpen, setEmergencyModeOpen] = useState(false);

  // Mantenerse en Inicio aunque esté logueado (sin auto-redirect)
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

  // Si está logueado, traer algunos lugares destacados
  useEffect(() => {
    const fetchLugares = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/lugares`);
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setLugares(data.length > 0 ? data : LUGARES_DESTACADOS);
      } catch {
        setLugares(LUGARES_DESTACADOS);
      }
    };
    if (usuario) fetchLugares();
  }, [usuario]);

  const lugaresMostrar = lugares.length > 0 ? lugares : LUGARES_DESTACADOS;

  const isGuest = Boolean(guestMode);

  // Render condicional según autenticación
  if (!usuario && !isGuest) {
    return <AuthLanding initialTab="login" />;
  }

  // Vista de inicio para usuario autenticado o visitante
  return (
    <div className="home-container">
      <div className="home-wrapper">
        {/* Header Section */}
        <div className="home-header">
          <h1 className="home-greeting">
            {isGuest ? "Explorá AutiSi" : `Hola, ${usuario?.nombre?.split(' ')[0] || ""} 👋`}
          </h1>
          <p className="home-subtitle">
            ¿Cómo podemos acompañarte hoy?
          </p>
          {!isGuest && (
            <p className="home-description">
              Encontrá herramientas y recursos pensados para vos.
            </p>
          )}
        </div>

        {isGuest ? (
          <>
            <QuickAccessGrid items={[
              { id: 'mapa', kicker: 'Mapa', title: 'Lugares adaptados', to: '/mapa' },
              { id: 'tecnicas', kicker: 'Técnicas', title: 'Técnicas sensoriales', to: '/tecnicas' },
            ]} />
          </>
        ) : (
          <>
            {/* Wellness Card */}
            <div className="home-wellness-card">
              <div className="home-wellness-illustration">
                <Cloud size={80} />
              </div>
              <div className="home-wellness-content">
                <h2 className="home-wellness-title">¿Cómo te sentís hoy?</h2>
                <p className="home-wellness-text">
                  Registrá cómo te sentís y llevá un seguimiento de tu bienestar.
                </p>
                {estadoAnimo ? (
                  <div className="px-6 py-3 rounded-full mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                    <span className="text-white font-semibold">
                      Hoy te sentís: <strong>{estadoAnimo.label}</strong>
                    </span>
                  </div>
                ) : (
                  <button className="home-wellness-button">
                    Registrar
                  </button>
                )}
              </div>
            </div>

            {/* Needs Section */}
            <div className="home-needs-section">
              <h2 className="home-needs-title">¿Qué necesitás hoy?</h2>
              <div className="home-needs-grid">
                {/* Explorar */}
                <button
                  onClick={() => navigate('/mapa')}
                  className="home-needs-card explore"
                >
                  <div className="home-needs-icon">
                    <Map size={64} />
                  </div>
                  <h3 className="home-needs-title">Explorar lugares</h3>
                  <p className="home-needs-description">
                    Encontrá espacios adaptados para vos.
                  </p>
                </button>

                {/* Comunidad */}
                <button
                  onClick={() => navigate('/comunidad')}
                  className="home-needs-card community"
                >
                  <div className="home-needs-icon">
                    <MessageSquare size={64} />
                  </div>
                  <h3 className="home-needs-title">Comunidad</h3>
                  <p className="home-needs-description">
                    Compartí y conectá con otras personas.
                  </p>
                </button>

                {/* Checklist */}
                <button
                  onClick={() => navigate('/checklist')}
                  className="home-needs-card checklist"
                >
                  <div className="home-needs-icon">
                    <CheckSquare size={64} />
                  </div>
                  <h3 className="home-needs-title">Checklist</h3>
                  <p className="home-needs-description">
                    Prepará lo que necesitás llevar.
                  </p>
                </button>

                {/* Profesionales */}
                <button
                  onClick={() => navigate('/profesionales')}
                  className="home-needs-card prepare"
                >
                  <div className="home-needs-icon">
                    <Sun size={64} />
                  </div>
                  <h3 className="home-needs-title">Profesionales</h3>
                  <p className="home-needs-description">
                    Encontrá terapeutas y especialistas.
                  </p>
                </button>
              </div>
            </div>

            {/* Recommended Section */}
            <div className="home-recommended-section">
              <h2 className="home-recommended-title">Recomendado para vos</h2>
              <div className="home-recommended-card">
                <div className="home-recommended-image">
                  <Map size={64} />
                </div>
                <div className="home-recommended-content">
                  <h3 className="home-recommended-name">
                    {lugaresMostrar[0]?.nombre || "Bullrich APADEA"}
                  </h3>
                  <p className="home-recommended-location">
                    📍 Buenos Aires
                  </p>
                  <span className="home-recommended-badge">
                    Espacio adaptado
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Card */}
            <div className="home-emergency-card">
              <div className="home-emergency-icon">
                <AlertTriangle size={28} />
              </div>
              <div className="home-emergency-content">
                <h3 className="home-emergency-title">Modo de emergencia</h3>
                <p className="home-emergency-text">
                  Accedé rápidamente a tus contactos y lugares de ayuda.
                </p>
              </div>
              <button
                onClick={() => setEmergencyModeOpen(true)}
                className="home-emergency-button"
              >
                Activar
              </button>
            </div>

            <ActiveChecklist />
          </>
        )}
      </div>
      
      {!isGuest && <EmergencyMode isOpen={emergencyModeOpen} onClose={() => setEmergencyModeOpen(false)} />}
    </div>
  );
};

export default Home;
