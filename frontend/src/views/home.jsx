import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLanding from "../components/AuthLanding.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Home = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [lugares, setLugares] = useState([]);
  const [estadoAnimo, setEstadoAnimo] = useState(null);

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
        setLugares(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch {}
    };
    if (usuario) fetchLugares();
  }, [usuario]);

  // Render condicional según autenticación
  if (!usuario) {
    return <AuthLanding initialTab="login" />;
  }

  // Vista de inicio para usuario autenticado
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-hero">
          <h1 className="home-title">Hola {usuario?.nombre || ""} 👋</h1>
          <p className="home-subtitle">
            Este es tu espacio seguro para descubrir lugares preparados y recursos que acompañan el bienestar diario.
          </p>
        </div>

        <div className="home-tabs" style={{ marginBottom: 24 }}>
          <div className="home-tabs-inner">
            <button className="tab-btn active" onClick={() => navigate("/mapa")}>
              Ver mapa
            </button>
            <button className="tab-btn" onClick={() => navigate("/tecnicas")}>
              Ver técnicas de autorregulación
            </button>
            <button className="tab-btn" onClick={() => navigate("/contacto")}>
              Contacto
            </button>
          </div>
        </div>

        <section className="home-mood-section">
          <div className="home-mood-header">
            <p className="home-mood-label">¿Cómo te sentís hoy?</p>
            <p className="home-mood-helper">
              Elegí una carita para registrar tu estado de ánimo de hoy.
            </p>
            {estadoAnimo && (
              <span className="home-mood-selected">
                Hoy te sentís: <strong>{estadoAnimo.label}</strong>
              </span>
            )}
          </div>

          <div className="home-mood-row">
            {[
              { id: "muy-mal", emoji: "☹️", label: "Mal" },
              { id: "asi-asi", emoji: "😐", label: "Más o menos" },
              { id: "bien", emoji: "🙂", label: "Bien" },
              { id: "genial", emoji: "😄", label: "Genial" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                className={
                  "mood-circle" +
                  (estadoAnimo?.id === m.id ? " mood-circle-active" : "")
                }
                onClick={() => setEstadoAnimo(m)}
              >
                <div className={`mood-face mood-face-${m.id}`}>{m.emoji}</div>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="home-dashboard-grid">
          {[
            {
              id: "mapa",
              variant: "primary",
              kicker: "Explorar lugares",
              title: "Ver mapa inclusivo",
              text: "Buscá espacios preparados y recomendaciones de la comunidad.",
              action: "Abrir mapa",
              to: "/mapa",
            },
            {
              id: "checklist",
              variant: "premium",
              kicker: "Premium",
              title: "Checklist personalizado",
              text: "Organizá tus salidas y actividades para no olvidar nada importante.",
              action: "Ver checklist",
              to: "/checklist",
            },
            {
              id: "tecnicas",
              variant: "secondary",
              kicker: "Autorregulación",
              title: "Técnicas sensoriales",
              text: "Encontrá ideas simples para bajar el ruido interno y externo.",
              action: "Ver técnicas",
              to: "/tecnicas",
            },
            {
              id: "resenas",
              variant: "accent",
              kicker: "Tu voz suma",
              title: "Mis reseñas",
              text: "Revisá y actualizá lo que fuiste compartiendo sobre los lugares.",
              action: "Ir a mi perfil",
              to: "/perfil",
            },
            {
              id: "contacto",
              variant: "neutral",
              kicker: "Necesitás ayuda",
              title: "Hablemos",
              text: "Si algo no funciona o tenés una idea, podés escribirnos.",
              action: "Contactar equipo",
              to: "/contacto",
            },
            {
              id: "profesionales",
              variant: "primary",
              kicker: "Profesionales",
              title: "Red de especialistas",
              text: "Accedé a profesionales especializados en TEA y disciplinas afines.",
              action: "Ver profesionales",
              to: "/profesionales",
            },
          ].map((card) => (
            <button
              key={card.id}
              type="button"
              className={`home-mini-card ${card.variant}`}
              onClick={() => navigate(card.to)}
            >
              <p className="mini-card-kicker">{card.kicker}</p>
              <h2 className="mini-card-title">{card.title}</h2>
              <p className="mini-card-text">{card.text}</p>
              <span className="mini-card-button-link">{card.action}</span>
            </button>
          ))}
        </section>

        {lugares && lugares.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <h2 className="card-title" style={{ margin: "0 0 12px 0" }}>
              Lugares destacados
            </h2>
            <div className="home-grid">
              {lugares.slice(0, 6).map((l) => (
                <div key={l._id} className="card">
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{l.nombre}</div>
                  <div style={{ color: "#64748b", marginBottom: 4 }}>{l.direccion}</div>
                  <div style={{ fontSize: 14, color: "#94a3b8" }}>
                    Tipo: {l.tipo || "—"} | Provincia: {l.provincia || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default Home;
