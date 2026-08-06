import React, { useState, useEffect } from "react";
import { Heart, Star } from 'lucide-react';
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const categorias = ["todas", "respiración", "relajación", "enfoque", "movimiento", "sensorial"];

const Tecnicas = () => {
  const [tecnicas, setTecnicas] = useState([]);
  const [favs, setFavs] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("fav_tecnicas") || "[]"));
    } catch {
      return new Set();
    }
  });
  const [openTec, setOpenTec] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState("todas");
  const [showFavs, setShowFavs] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar técnicas del backend
  useEffect(() => {
    const fetchTecnicas = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/tecnicas`);
        setTecnicas(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error al cargar técnicas:", error);
        // Usar datos de fallback si falla la API
        setTecnicas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTecnicas();
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem("fav_tecnicas", JSON.stringify(Array.from(favs)));
    } catch {}
  }, [favs]);

  const toggleFav = (id) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("fav_tecnicas", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const openGuide = (t) => setOpenTec(t);
  const closeGuide = () => setOpenTec(null);

  const tecnicasFiltradas = tecnicas.filter(t => {
    if (showFavs) return favs.has(t._id);
    if (filtroActivo === "todas") return true;
    return t.categoria === filtroActivo;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-4">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#43A1F2] mb-3">Técnicas de autorregulación</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Estrategias prácticas para regular emociones, reducir sobrecarga sensorial y favorecer el bienestar en situaciones cotidianas.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categorias.map(cat => (
              <button
                key={cat}
                style={{
                  background: filtroActivo === cat ? '#43A1F2' : 'white',
                  color: filtroActivo === cat ? 'white' : '#64748b',
                  border: filtroActivo === cat ? '1px solid #43A1F2' : '1px solid #e2e8f0',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => {
                  setFiltroActivo(cat);
                  setShowFavs(false);
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <button
            style={{
              background: showFavs ? '#43A1F2' : 'white',
              color: showFavs ? 'white' : '#64748b',
              border: showFavs ? '1px solid #43A1F2' : '1px solid #e2e8f0',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => {
              setShowFavs(!showFavs);
              setFiltroActivo("todas");
            }}
          >
            <Star size={16} fill={showFavs ? "currentColor" : "none"} />
            Favoritos
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Cargando técnicas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {tecnicasFiltradas.map((t) => (
              <div key={t._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-28 overflow-hidden">
                  <img src={t.img} alt={t.titulo} className="w-full h-full object-cover" />
                  <button
                    className="absolute top-2 right-2 bg-white/90 border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-white hover:scale-110 shadow-md p-0"
                    onClick={() => toggleFav(t._id)}
                  >
                    <Heart 
                      size={18} 
                      fill={favs.has(t._id) ? "#43A1F2" : "none"} 
                      stroke={favs.has(t._id) ? "#43A1F2" : "currentColor"}
                      strokeWidth={2}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <div className="text-xs font-semibold text-[#43A1F2] uppercase tracking-wider mb-2">{t.categoria}</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{t.titulo}</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{t.desc}</p>
                  <button
                    style={{
                      width: '100%',
                      background: '#43A1F2',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => openGuide(t)}
                  >
                    Ver guía paso a paso
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-[#43A1F2]/10 to-[#59C2BA]/10 rounded-2xl p-6 border border-[#43A1F2]/20">
          <div className="support-message">
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-800">Recordá:</strong> Cada persona con TEA experimenta las emociones y los estímulos de manera diferente. 
              Explorá distintas estrategias hasta encontrar aquellas que resulten más beneficiosas para vos.
            </p>
          </div>
        </div>
      </div>

      {openTec && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8 pt-32" onClick={closeGuide}>
          <div className="bg-white rounded-2xl max-w-[500px] w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div className="text-lg font-bold text-slate-800">{openTec.titulo}</div>
              <button className="text-3xl text-slate-400 hover:text-slate-600 cursor-pointer" onClick={closeGuide}>
                ×
              </button>
            </div>
            <div className="p-5">
              <img className="w-full h-45 object-cover rounded-xl mb-4" src={openTec.img} alt={openTec.titulo} />
              <div>
                <p className="text-slate-600 mb-3 leading-relaxed text-sm">{openTec.desc}</p>
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-[#43A1F2]/10 text-[#43A1F2] rounded-full text-xs font-medium">{openTec.categoria}</span>
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-2.5">Pasos</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-sm pl-5">
                  {(openTec.steps || []).map((s, i) => (
                    <li key={i} className="pl-1">{s}</li>
                  ))}
                </ol>
                {openTec.source && (
                  <div className="mt-4">
                    <a
                      className="text-[#43A1F2] hover:underline text-xs"
                      href={openTec.source}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Fuente / Ilustración
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tecnicas;


