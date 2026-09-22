import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLanding from "../components/AuthLanding.jsx";
import ActiveChecklist from "../components/ActiveChecklist";
import EmergencyMode from "../components/EmergencyMode";
import { AlertTriangle, Heart, MapPin, MessageCircle, Wind, Search, Bell, User, ArrowRight, BookOpen, Stethoscope } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import "./home.css";

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const LUGARES_DESTACADOS = [
  { _id: "dest-bullrich", nombre: "Bullrich APADEA", tipo: "Centro cultural", certificacion: "APADEA", rating: 4.8, distancia: "1.2 km" },
  { _id: "dest-abasto", nombre: "Abasto APADEA", tipo: "Shopping", certificacion: "APADEA", rating: 4.6, distancia: "2.4 km" },
  { _id: "dest-cafe", nombre: "Café Posible", tipo: "Cafetería", certificacion: "Comunidad", rating: 4.5, distancia: "0.8 km" },
];

const MOODS = [
  { id: "muy-mal", emoji: "☹️", label: "Mal" },
  { id: "asi-asi", emoji: "😐", label: "Más o menos" },
  { id: "bien", emoji: "🙂", label: "Bien" },
  { id: "genial", emoji: "😄", label: "Genial" },
];

const PRIMARY_CARDS = [
  {
    id: "calma",
    title: "Encontrá tu calma",
    text: "Herramientas para regularte y sentirte mejor.",
    to: "/tecnicas",
    icon: Wind,
    tone: "blue",
    keywords: ["calma", "regular", "técnica", "tecnicas", "bienestar", "respir", "autorregul"],
  },
  {
    id: "lugares",
    title: "Explorar lugares",
    text: "Descubrí espacios inclusivos.",
    to: "/mapa",
    icon: MapPin,
    tone: "teal",
    keywords: ["lugar", "mapa", "espacio", "inclusiv", "explorar"],
  },
  {
    id: "aprender",
    title: "Aprendé y comprendé",
    text: "Información clara para comprender el autismo y acompañar de manera respetuosa.",
    to: "/informacion-autismo",
    icon: BookOpen,
    tone: "yellow",
    keywords: ["aprender", "comprend", "inform", "autismo", "educ", "conoc", "apoyar"],
  },
  {
    id: "comunidad",
    title: "Comunidad",
    text: "Compartí y conectate.",
    to: "/comunidad",
    icon: MessageCircle,
    tone: "coral",
    keywords: ["comunidad", "compart", "foro", "conect"],
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { guestMode } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [lugares, setLugares] = useState([]);
  const [estadoAnimo, setEstadoAnimo] = useState(null);
  const [emergencyModeOpen, setEmergencyModeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoodPanel, setShowMoodPanel] = useState(true);

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
  const isSignedIn = Boolean(usuario) && !guestMode;

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PRIMARY_CARDS;
    return PRIMARY_CARDS.filter(
      (card) =>
        card.title.toLowerCase().includes(q) ||
        card.text.toLowerCase().includes(q) ||
        card.keywords.some((word) => word.includes(q) || q.includes(word))
    );
  }, [searchQuery]);

  const openCard = (card) => {
    if (card.to) navigate(card.to);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredCards.length === 1) openCard(filteredCards[0]);
  };

  if (!usuario && !isGuest) {
    return <AuthLanding initialTab="login" />;
  }

  return (
    <div className="autisi-home">
      <div className="autisi-home-inner">
        <header className="autisi-home-header">
          <div className="autisi-home-greeting">
            <h1>Hola, ¿qué querés hacer hoy?</h1>
            <p>Estoy acá para acompañarte.</p>
          </div>
          <div className="autisi-home-header-actions">
            {isSignedIn && (
              <>
                <button
                  type="button"
                  className="autisi-home-icon-btn"
                  onClick={() => navigate("/notificaciones")}
                  aria-label="Notificaciones"
                >
                  <Bell size={20} />
                </button>
                <button
                  type="button"
                  className="autisi-home-icon-btn"
                  onClick={() => navigate("/perfil")}
                  aria-label="Perfil"
                >
                  <User size={20} />
                </button>
              </>
            )}
          </div>
        </header>

        <div className="autisi-home-mascot-slot" aria-hidden="true" />

        <form className="autisi-home-search" onSubmit={handleSearchSubmit} role="search">
          <label htmlFor="autisi-home-search-input" className="sr-only">
            ¿Qué necesitás ahora?
          </label>
          <Search size={18} aria-hidden="true" />
          <input
            id="autisi-home-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué necesitás ahora?"
            autoComplete="off"
          />
        </form>

        {showMoodPanel && (
          <section className="autisi-home-mood" aria-labelledby="autisi-mood-title">
            <div className="autisi-home-mood-head">
              <h2 id="autisi-mood-title">¿Cómo te sentís hoy?</h2>
              <p>Elegí una opción para registrar tu estado de ánimo.</p>
            </div>
            {estadoAnimo && (
              <p className="autisi-home-mood-selected">
                Hoy te sentís: <strong>{estadoAnimo.label}</strong>
              </p>
            )}
            <div className="autisi-home-mood-row">
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  className={`autisi-home-mood-btn ${estadoAnimo?.id === mood.id ? "is-active" : ""}`}
                  onClick={() => setEstadoAnimo(mood)}
                  aria-pressed={estadoAnimo?.id === mood.id}
                  aria-label={mood.label}
                >
                  <span aria-hidden="true">{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="autisi-home-grid" aria-label="Accesos principales">
          {filteredCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                className={`autisi-home-card tone-${card.tone}`}
                onClick={() => openCard(card)}
                aria-label={`${card.title}. ${card.text}`}
              >
                <span className="autisi-home-card-icon" aria-hidden="true">
                  <Icon size={32} />
                </span>
                <span className="autisi-home-card-copy">
                  <span className="autisi-home-card-title">{card.title}</span>
                  <span className="autisi-home-card-text">{card.text}</span>
                </span>
                <span className="autisi-home-card-go" aria-hidden="true">
                  <ArrowRight size={18} />
                </span>
              </button>
            );
          })}
        </section>

        {isSignedIn && (
          <button
            type="button"
            className="autisi-home-professionals"
            onClick={() => navigate("/profesionales")}
          >
            <span className="autisi-home-professionals-icon" aria-hidden="true">
              <Stethoscope size={20} />
            </span>
            <span className="autisi-home-professionals-content">
              <span className="autisi-home-professionals-title">Encontrá profesionales</span>
              <span className="autisi-home-professionals-text">Accedé a profesionales y especialistas que pueden acompañarte.</span>
            </span>
            <span className="autisi-home-professionals-cta" aria-hidden="true">
              Ver profesionales →
            </span>
          </button>
        )}

        {isSignedIn && (
          <div className="autisi-home-secondary">
            <ActiveChecklist />
            <button
              type="button"
              className="autisi-home-emergency"
              onClick={() => setEmergencyModeOpen(true)}
            >
              <AlertTriangle size={22} />
              <span>
                <strong>Necesito ayuda</strong>
                <small>Accedé al modo de emergencia</small>
              </span>
            </button>
          </div>
        )}
      </div>

      {!isGuest && (
        <EmergencyMode isOpen={emergencyModeOpen} onClose={() => setEmergencyModeOpen(false)} />
      )}
    </div>
  );
};

export default Home;
