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
import './home.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LUGARES_DESTACADOS = [
  { _id: "dest-bullrich", nombre: "Bullrich APADEA", tipo: "Centro cultural", certificacion: "APADEA", rating: 4.8, distancia: "1.2 km" },
  { _id: "dest-abasto", nombre: "Abasto APADEA", tipo: "Shopping", certificacion: "APADEA", rating: 4.6, distancia: "2.4 km" },
  { _id: "dest-cafe", nombre: "Café Posible", tipo: "Cafetería", certificacion: "Comunidad", rating: 4.5, distancia: "0.8 km" },
];

const Home = () => {
  const navigate = useNavigate();
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

  // Render condicional según autenticación
  if (!usuario) {
    return <AuthLanding initialTab="login" />;
  }

  // Vista de inicio para usuario autenticado
  return (
    <div className="min-h-screen bg-slate-50 px-4 pt-2 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Saludo personalizado */}
        <div className="mb-4">
          <h1 className="home-greeting-title">Hola, {usuario?.nombre || ""} 👋</h1>
          <p className="home-greeting-subtitle">
            Este es tu espacio seguro para descubrir lugares preparados y recursos que acompañan el bienestar diario.
          </p>
        </div>

        {/* Botón de Modo de Emergencia */}
        <button
          onClick={() => setEmergencyModeOpen(true)}
          className="w-full mb-4 p-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <AlertTriangle size={22} />
          <span className="text-base font-bold">Modo de Emergencia</span>
        </button>

        {/* Registro de estado de ánimo */}
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

        {/* Mapa de Lugares Seguros - Tarjeta destacada */}
        <MainExploreCard subtitle="Buscá espacios preparados y recomendaciones de la comunidad." />

        {/* Accesos rápidos - Cuadrícula horizontal */}
        <QuickAccessGrid items={[
          { id: 'comunidad', kicker: 'Comunidad', title: 'Foro y experiencias', to: '/comunidad' },
          { id: 'checklist', kicker: 'Checklist', title: 'Checklist personalizado', to: '/checklist' },
          { id: 'mislugares', kicker: 'Mis lugares', title: 'Lugares guardados', to: '/perfil' },
          { id: 'tecnicas', kicker: 'Técnicas', title: 'Técnicas sensoriales', to: '/tecnicas' },
          { id: 'resenas', kicker: 'Reseñas', title: 'Mis reseñas', to: '/mis-resenas' },
          { id: 'profesionales', kicker: 'Profesionales', title: 'Red de especialistas', to: '/profesionales' },
        ]} />

        {/* Lugares destacados */}
        <RecommendedList places={lugaresMostrar} />
      </div>
      
      <EmergencyMode isOpen={emergencyModeOpen} onClose={() => setEmergencyModeOpen(false)} />
    </div>
  );
};

export default Home;
