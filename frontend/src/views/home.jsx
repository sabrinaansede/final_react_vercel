import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLanding from "../components/AuthLanding.jsx";
import MainExploreCard from "../components/MainExploreCard";
import QuickAccessGrid from "../components/QuickAccessGrid";
import RecommendedList from "../components/RecommendedList";
import ActiveChecklist from "../components/ActiveChecklist";
import EmergencyMode from "../components/EmergencyMode";
import { AlertTriangle } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 px-4 pt-2 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="home-greeting-title">
            {isGuest ? "Explorá AutiSi sin cuenta" : `Hola, ${usuario?.nombre || ""} 👋`}
          </h1>
          <p className="home-greeting-subtitle">
            {isGuest
              ? "Conocé información pública, el mapa de lugares adaptados y recursos educativos antes de registrarte."
              : "Este es tu espacio seguro para descubrir lugares preparados y recursos que acompañan el bienestar diario."}
          </p>
        </div>

        {isGuest ? (
          <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
            <h2 className="home-section-heading mb-2">Contenido disponible para explorar</h2>
            <p className="text-sm text-gray-600 mb-4">
              Podés navegar por información general, recursos educativos y el mapa de lugares adaptados sin iniciar sesión.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <button type="button" onClick={() => navigate('/centro-informacion')} className="rounded-2xl border border-[#dfefff] bg-[#f7fbff] p-4 text-left shadow-sm transition hover:border-[#43A1F2]">
                <div className="text-sm font-bold text-[#1b2a4a]">Información sobre el autismo</div>
                <div className="text-sm text-gray-600 mt-1">Artículos y recursos educativos para comprender mejor el autismo.</div>
              </button>
              <button type="button" onClick={() => navigate('/mapa')} className="rounded-2xl border border-[#dfefff] bg-[#f7fbff] p-4 text-left shadow-sm transition hover:border-[#43A1F2]">
                <div className="text-sm font-bold text-[#1b2a4a]">Mapa de lugares adaptados</div>
                <div className="text-sm text-gray-600 mt-1">Explorá espacios registrados con información general de accesibilidad.</div>
              </button>
              <button type="button" onClick={() => navigate('/tecnicas')} className="rounded-2xl border border-[#dfefff] bg-[#f7fbff] p-4 text-left shadow-sm transition hover:border-[#43A1F2]">
                <div className="text-sm font-bold text-[#1b2a4a]">Técnicas y recursos</div>
                <div className="text-sm text-gray-600 mt-1">Accedé a herramientas de apoyo y orientación general.</div>
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => navigate('/login')} className="rounded-full bg-[#43A1F2] px-4 py-2 text-sm font-semibold text-white">Iniciar sesión</button>
              <button type="button" onClick={() => navigate('/registro')} className="rounded-full border border-[#43A1F2] px-4 py-2 text-sm font-semibold text-[#43A1F2]">Crear cuenta</button>
            </div>
          </section>
        ) : (
          <>
            <button
              onClick={() => setEmergencyModeOpen(true)}
              className="w-full mb-4 p-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <AlertTriangle size={22} />
              <span className="text-base font-bold">Modo de Emergencia</span>
            </button>

            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
              <div className="mb-3">
                <h2 className="home-section-heading mb-0.5">¿Cómo te sentís hoy?</h2>
                <p className="text-xs text-gray-500">Elegí una carita para registrar tu estado de ánimo de hoy.</p>
                {estadoAnimo && (
                  <span className="inline-block mt-2 text-sm text-[#43A1F2] font-semibold">
                    Hoy te sentís: <strong>{estadoAnimo.label}</strong>
                  </span>
                )}
              </div>

              <div className="flex justify-center gap-2 flex-wrap">
                {[
                  { id: "muy-mal", emoji: "☹️", label: "Mal" },
                  { id: "asi-asi", emoji: "😐", label: "Más o menos" },
                  { id: "bien", emoji: "🙂", label: "Bien" },
                  { id: "genial", emoji: "😄", label: "Genial" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border-2 transition-all min-w-[74px] ${
                      estadoAnimo?.id === m.id 
                        ? "border-[#43A1F2] bg-blue-50" 
                        : "border-gray-200 hover:border-[#43A1F2] hover:bg-gray-50"
                    }`}
                    onClick={() => setEstadoAnimo(m)}
                  >
                    <span className="text-2xl leading-none">{m.emoji}</span>
                    <span className="text-[11px] font-medium text-gray-700 text-center">{m.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <ActiveChecklist />
          </>
        )}

        <MainExploreCard subtitle="Buscá espacios preparados y recomendaciones de la comunidad." />

        <QuickAccessGrid items={[
          { id: 'centro', kicker: 'Información', title: 'Recursos sobre autismo', to: '/centro-informacion' },
          { id: 'mapa', kicker: 'Mapa', title: 'Lugares adaptados', to: '/mapa' },
          { id: 'tecnicas', kicker: 'Técnicas', title: 'Técnicas sensoriales', to: '/tecnicas' },
          ...(isGuest ? [] : [
            { id: 'comunidad', kicker: 'Comunidad', title: 'Foro y experiencias', to: '/comunidad' },
            { id: 'checklist', kicker: 'Checklist', title: 'Checklist personalizado', to: '/checklist' },
            { id: 'mislugares', kicker: 'Mis lugares', title: 'Lugares guardados', to: '/perfil' },
            { id: 'resenas', kicker: 'Reseñas', title: 'Mis reseñas', to: '/mis-resenas' },
          ])
        ]} />

        <RecommendedList places={lugaresMostrar} />
      </div>
      
      {!isGuest && <EmergencyMode isOpen={emergencyModeOpen} onClose={() => setEmergencyModeOpen(false)} />}
    </div>
  );
};

export default Home;
