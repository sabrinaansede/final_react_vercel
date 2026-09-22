import React, { useState, useEffect } from 'react';
import { Heart, Star, Wind, Volume2, Brain, Activity, Smile, Hand, Clock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import FlipCard from '../components/FlipCard';
import './tecnicas-autorregulacion.css';
import respiracionImg from '../assets/tecnicas/respiracion-467.png';
import presionImg from '../assets/tecnicas/presion-profunda.png';
import estiramientosImg from '../assets/tecnicas/estiramientos suaves.png';
import caminataImg from '../assets/tecnicas/caminata-consciente.png';
import focoImg from '../assets/tecnicas/foco-objeto.png';
import ruidoImg from '../assets/tecnicas/ruido-blanco.png';

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const categorias = ["todas", "respiración", "relajación", "enfoque", "movimiento", "sensorial"];

const PASTEL_COLORS = [
  '#dbeaff',  // celeste suave (deriva de #43A1F2)
  '#d8f3f0',  // turquesa suave (deriva de #59C2BA)
  '#fde3dc',  // coral suave (deriva de #EC7054)
  '#f4d7e8',  // magenta suave (deriva de #961E67)
  '#e8d7f5',  // lila suave (deriva de los tonos existentes)
  '#dbeaff',  // celeste suave (repetido para variación)
];

const DEFAULT_TECHNIQUE_IMAGE = respiracionImg;
const TECHNIQUE_IMAGES = {
  respiracion: respiracionImg,
  presion: presionImg,
  ruido: ruidoImg,
  estir: estiramientosImg,
  foco: focoImg,
  caminata: caminataImg,
};

const getTechniqueImage = (tech) => {
  const title = (tech?.titulo || "").toLowerCase();
  if (title.includes("respir")) return TECHNIQUE_IMAGES.respiracion;
  if (title.includes("presión") || title.includes("presion")) return TECHNIQUE_IMAGES.presion;
  if (title.includes("ruido")) return TECHNIQUE_IMAGES.ruido;
  if (title.includes("estir")) return TECHNIQUE_IMAGES.estir;
  if (title.includes("foco") || title.includes("objeto")) return TECHNIQUE_IMAGES.foco;
  if (title.includes("caminata")) return TECHNIQUE_IMAGES.caminata;
  return DEFAULT_TECHNIQUE_IMAGE;
};

const getTechniqueIcon = (tech) => {
  const title = (tech?.titulo || "").toLowerCase();
  if (title.includes("respir")) return "/assets/icons/respiracion.png";
  if (title.includes("presión") || title.includes("presion")) return "/assets/icons/presion.png";
  if (title.includes("ruido")) return "/assets/icons/ruido.png";
  if (title.includes("estir")) return "/assets/icons/estiramiento.png";
  if (title.includes("foco") || title.includes("objeto")) return "/assets/icons/foco.png";
  if (title.includes("caminata")) return "/assets/icons/caminata.png";
  if (title.includes("ground")) return "/assets/icons/grounding.png";
  if (title.includes("visual")) return "/assets/icons/visualizacion.png";
  if (title.includes("escrit")) return "/assets/icons/escritura.png";
  if (title.includes("música") || title.includes("musica")) return "/assets/icons/musica.png";
  if (title.includes("agua")) return "/assets/icons/agua.png";
  return "/assets/icons/default.png";
};

const TecnicasAutorregulacion = () => {
  const [tecnicas, setTecnicas] = useState([]);
  const [favs, setFavs] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("fav_tecnicas") || "[]"));
    } catch {
      return new Set();
    }
  });
  const [filtroActivo, setFiltroActivo] = useState("todas");
  const [showFavs, setShowFavs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [needFilter, setNeedFilter] = useState(null);

  // Cargar técnicas del backend
  useEffect(() => {
    const fetchTecnicas = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/tecnicas`);
        setTecnicas(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error al cargar técnicas:", error);
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

  const handleNeedFilter = (need) => {
    setNeedFilter(need);
    // Mapear necesidades a categorías
    const needToCategory = {
      'calmarme': 'respiración',
      'estimulos': 'sensorial',
      'concentrarme': 'enfoque',
      'moverme': 'movimiento',
      'relajarme': 'relajación',
      'sentidos': 'sensorial'
    };
    setFiltroActivo(needToCategory[need] || 'todas');
    setShowFavs(false);
  };

  const openGuide = (technique) => {
    console.log('Opening technique:', technique);
    // Aquí podrías implementar la lógica para abrir el detalle de la técnica
  };

  const tecnicasFiltradas = tecnicas.filter(t => {
    if (showFavs) return favs.has(t._id);
    if (filtroActivo === "todas") return true;
    return t.categoria === filtroActivo;
  });

  const quickNeeds = [
    { id: 'calmarme', icon: Wind, label: 'Calmarme', color: '#d8f3f0' },
    { id: 'estimulos', icon: Volume2, label: 'Bajar estímulos', color: '#dbeaff' },
    { id: 'concentrarme', icon: Brain, label: 'Concentrarme', color: '#e8d7f5' },
    { id: 'moverme', icon: Activity, label: 'Necesito moverme', color: '#fde3dc' },
    { id: 'relajarme', icon: Smile, label: 'Relajarme', color: '#dbeaff' },
    { id: 'sentidos', icon: Hand, label: 'Regular mis sentidos', color: '#d8f3f0' },
  ];

  return (
    <div className="tecnicas-page">
      <div className="tecnicas-container">
        <header className="tecnicas-header">
          <h1 className="tecnicas-title">¿Qué necesitás ahora?</h1>
        </header>

        <section className="quick-needs-section">
          <div className="quick-needs-grid">
            {quickNeeds.map((need) => (
              <button
                key={need.id}
                className={`quick-need-card ${needFilter === need.id ? 'active' : ''}`}
                onClick={() => handleNeedFilter(need.id)}
                style={{ backgroundColor: need.color }}
              >
                <need.icon size={36} className="quick-need-icon" />
                <span className="quick-need-label">{need.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="explore-section">
          <h2 className="explore-title">Explorá técnicas</h2>
          
          {/* Categorías como filtros secundarios */}
          <div className="tecnicas-filters">
            <div className="filter-buttons">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`filter-button ${filtroActivo === cat ? 'active' : ''}`}
                  onClick={() => {
                    setFiltroActivo(cat);
                    setShowFavs(false);
                    setNeedFilter(null);
                  }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <button
              className={`filter-button ${showFavs ? 'active' : ''}`}
              onClick={() => {
                setShowFavs(!showFavs);
                setFiltroActivo("todas");
                setNeedFilter(null);
              }}
            >
              <Star size={16} fill={showFavs ? "currentColor" : "none"} />
              Favoritos
            </button>
          </div>

          {loading ? (
            <div className="tecnicas-loading">
              <p>Cargando técnicas...</p>
            </div>
          ) : (
            <div className="tecnicas-grid">
              {tecnicasFiltradas.map((t, index) => (
                <div key={t._id} className="technique-card-wrapper">
                  <button
                    className="fav-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFav(t._id);
                    }}
                    aria-label={favs.has(t._id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    <Heart 
                      size={18} 
                      fill={favs.has(t._id) ? "#43A1F2" : "none"} 
                      stroke={favs.has(t._id) ? "#43A1F2" : "currentColor"}
                      strokeWidth={2}
                    />
                  </button>
                  <div 
                    className="technique-card"
                    style={{ backgroundColor: PASTEL_COLORS[index % PASTEL_COLORS.length] }}
                    onClick={() => openGuide(t)}
                  >
                    <div className="technique-content">
                      <h3 className="technique-title">{t.titulo}</h3>
                      <p className="technique-description">{t.desc}</p>
                    </div>
                    <div className="technique-illustration">
                      <img 
                        src={getTechniqueImage(t)} 
                        alt={t.titulo}
                        className="technique-image"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="tecnicas-support">
          <p>
            <strong>Recordá:</strong> Probá la técnica y observá cómo te sentís. No todas las estrategias funcionan igual para todas las personas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TecnicasAutorregulacion;
