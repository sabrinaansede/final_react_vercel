import React, { useState, useMemo } from "react";
import { ArrowLeft, Search, Brain, Heart, GraduationCap, Stethoscope, Scale, BookOpen, Lightbulb, Users, Volume2, MessageCircle, Sparkles, XCircle } from "lucide-react";
import "./informacion-autismo.css";
import queEsAutismo from "../assets/autismo/que_es_el_autismo.png - Editado.png";
import senalesCaracteristicas from "../assets/autismo/senales_y_caracteristicas.png - Editado.png";
import comoApoyar from "../assets/autismo/como_apoyar.png - Editado.png";
import familias from "../assets/autismo/familias.png - Editado.png";
import tecnicasEstrategias from "../assets/autismo/tecnicas_y_estrategias.png - Editado.png";
import comunidad from "../assets/autismo/comunidad.png - Editado.png";

const CATEGORIES = [
  {
    id: 'que-es',
    title: '¿Qué es el autismo?',
    description: 'Información fundamental sobre el espectro autista',
    image: queEsAutismo,
    color: 'rgba(67, 161, 242, 0.22)',
    iconColor: '#43A1F2',
  },
  {
    id: 'senales',
    title: 'Comprender el espectro autista',
    description: 'Identificar los rasgos del espectro autista',
    image: senalesCaracteristicas,
    icon: Brain,
    color: 'rgba(80, 193, 185, 0.22)',
    iconColor: '#50C1B9',
  },
  {
    id: 'apoyar',
    title: 'Cómo acompañar',
    description: 'Guía práctica de acompañamiento',
    image: comoApoyar,
    color: 'rgba(236, 112, 84, 0.22)',
    iconColor: '#EC7054',
  },
  {
    id: 'familias',
    title: 'Para familias',
    description: 'Recursos para el entorno familiar',
    image: familias,
    color: 'rgba(67, 161, 242, 0.22)',
    iconColor: '#43A1F2',
  },
  {
    id: 'tecnicas',
    title: 'Herramientas y estrategias',
    description: 'Herramientas prácticas para el día a día',
    image: tecnicasEstrategias,
    icon: BookOpen,
    color: 'rgba(245, 158, 11, 0.22)',
    iconColor: '#F59E0B',
  },
  {
    id: 'comunidad',
    title: 'Comunidad y experiencias',
    description: 'Conectar con otros y compartir experiencias',
    image: comunidad,
    icon: Users,
    color: 'rgba(150, 30, 103, 0.22)',
    iconColor: '#961E67',
  },
];

const InformacionAutismo = () => {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCardId, setSelectedCardId] = useState(null);

  const handleOpenCategory = (category) => {
    setSelected(category);
    setSelectedCardId(category.id);
    if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filtered = useMemo(() => {
    if (!query) return CATEGORIES;
    const q = query.toLowerCase();
    return CATEGORIES.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [query]);

  const renderCardContent = () => {
    switch (selected?.id) {
      case 'que-es':
        return (
          <div className="detail-content">
            <h2 className="section-title">¿Qué es el autismo?</h2>
            <div className="info-card">
              <p className="info-text">El autismo, o trastorno del espectro autista (TEA), es una condición del neurodesarrollo. Puede influir en la comunicación, la interacción social, los intereses, las rutinas y la forma en que una persona procesa diferentes estímulos.</p>
            </div>
            <div className="info-card secondary">
              <div className="info-card-icon">
                <Users size={24} className="info-icon" />
              </div>
              <div className="info-card-content">
                <h3 className="info-card-title">Cada persona es diferente</h3>
                <p className="info-card-text">El espectro autista es amplio. No existe una única manera de ser autista ni todas las personas presentan las mismas características.</p>
              </div>
            </div>
          </div>
        );
      case 'apoyar':
        return (
          <div className="detail-content">
            <h2 className="section-title">Cómo acompañar</h2>
            <p className="section-subtitle">Ideas prácticas para acompañar respetando las necesidades de cada persona.</p>
            <div className="accompaniment-grid">
              <div className="accompaniment-card">
                <div className="accompaniment-icon-wrapper">
                  <MessageCircle size={24} className="accompaniment-icon" />
                </div>
                <h3 className="accompaniment-title">Preguntá qué necesita</h3>
                <p className="accompaniment-text">No asumas qué puede o no puede hacer una persona.</p>
              </div>
              <div className="accompaniment-card">
                <div className="accompaniment-icon-wrapper">
                  <Users size={24} className="accompaniment-icon" />
                </div>
                <h3 className="accompaniment-title">Respetá sus formas de comunicación</h3>
                <p className="accompaniment-text">No todas las personas se comunican de la misma manera.</p>
              </div>
              <div className="accompaniment-card">
                <div className="accompaniment-icon-wrapper">
                  <Brain size={24} className="accompaniment-icon" />
                </div>
                <h3 className="accompaniment-title">Anticipá los cambios</h3>
                <p className="accompaniment-text">Cuando sea posible, avisar con anticipación puede facilitar las transiciones.</p>
              </div>
              <div className="accompaniment-card">
                <div className="accompaniment-icon-wrapper">
                  <Volume2 size={24} className="accompaniment-icon" />
                </div>
                <h3 className="accompaniment-title">Respetá los límites sensoriales</h3>
                <p className="accompaniment-text">No obligar al contacto físico ni a exponerse a estímulos que resulten incómodos.</p>
              </div>
              <div className="accompaniment-card">
                <div className="accompaniment-icon-wrapper">
                  <Heart size={24} className="accompaniment-icon" />
                </div>
                <h3 className="accompaniment-title">Permití diferentes formas de expresión</h3>
                <p className="accompaniment-text">Una persona puede expresar sus emociones y necesidades de maneras diferentes.</p>
              </div>
              <div className="accompaniment-card">
                <div className="accompaniment-icon-wrapper">
                  <Lightbulb size={24} className="accompaniment-icon" />
                </div>
                <h3 className="accompaniment-title">Escuchá</h3>
                <p className="accompaniment-text">La mejor forma de saber qué necesita alguien es preguntarle y respetar su respuesta.</p>
              </div>
            </div>
          </div>
        );
      case 'mitos':
        return (
          <div className="detail-content">
            <h2 className="section-title">Mitos y realidades</h2>
            <p className="section-subtitle">Información para diferenciar ideas comunes de información basada en evidencia.</p>
            <div className="myths-container">
              <div className="myth-card">
                <div className="myth-header">
                  <XCircle size={20} className="myth-icon myth-false" />
                  <h3 className="myth-label">MITO</h3>
                </div>
                <p className="myth-text">"Todas las personas autistas son iguales."</p>
                <div className="myth-divider"></div>
                <div className="myth-header">
                  <Sparkles size={20} className="myth-icon myth-true" />
                  <h3 className="myth-label">REALIDAD</h3>
                </div>
                <p className="myth-text">"El autismo es un espectro y las características, fortalezas y necesidades de apoyo pueden variar mucho entre personas."</p>
              </div>
              <div className="myth-card">
                <div className="myth-header">
                  <XCircle size={20} className="myth-icon myth-false" />
                  <h3 className="myth-label">MITO</h3>
                </div>
                <p className="myth-text">"Todas las personas autistas tienen dificultades para comunicarse."</p>
                <div className="myth-divider"></div>
                <div className="myth-header">
                  <Sparkles size={20} className="myth-icon myth-true" />
                  <h3 className="myth-label">REALIDAD</h3>
                </div>
                <p className="myth-text">"Las formas de comunicación son diversas. Algunas personas utilizan lenguaje verbal, otras utilizan sistemas alternativos o aumentativos, y otras combinan diferentes formas de comunicación."</p>
              </div>
              <div className="myth-card">
                <div className="myth-header">
                  <XCircle size={20} className="myth-icon myth-false" />
                  <h3 className="myth-label">MITO</h3>
                </div>
                <p className="myth-text">"El autismo se puede identificar de una sola manera."</p>
                <div className="myth-divider"></div>
                <div className="myth-header">
                  <Sparkles size={20} className="myth-icon myth-true" />
                  <h3 className="myth-label">REALIDAD</h3>
                </div>
                <p className="myth-text">"No existe una única característica que permita identificar a todas las personas autistas."</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="detail-content">
            <h2 className="section-title">{selected.title}</h2>
            <div className="info-card">
              <p className="info-text">
                El contenido detallado sobre "{selected.title}" estará disponible próximamente.
                Esta categoría está en desarrollo para brindarte información completa y actualizada.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="informacion-autismo-page">
      <div className="informacion-autismo-container">
        
        {!selected ? (
          <>
            {/* Header Section */}
            <section className="info-header-section">
              <div className="info-badge">Centro de Información</div>
              <h1 className="info-title">
                Aprendé y comprendé
              </h1>
              <p className="info-description">
                Información clara y accesible para comprender el autismo, acompañar y construir entornos más inclusivos.
              </p>
              <div className="search-bar-container">
                <Search size={20} className="search-icon" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar información..."
                  className="search-input"
                />
              </div>
            </section>

            {/* Categories Grid */}
            <section className="categories-section">
              <div className="categories-grid">
                {filtered.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      className={`category-card ${selectedCardId === category.id ? 'selected' : ''}`}
                      onClick={() => handleOpenCategory(category)}
                      style={{ 
                        backgroundColor: category.color,
                        borderColor: selectedCardId === category.id ? '#43A1F2' : 'rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <div className="category-content">
                        <h3 className="category-title">{category.title}</h3>
                        <p className="category-description">{category.description}</p>
                      </div>
                      <div className="category-illustration">
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.title}
                            className="category-image"
                          />
                        ) : (
                          <Icon size={64} className="category-icon" style={{ color: category.iconColor }} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button className="back-button" onClick={() => setSelected(null)}>
              <ArrowLeft size={18} />
              ← Volver a categorías
            </button>
            
            {/* Detail Content */}
            {renderCardContent()}
          </>
        )}
      </div>
    </div>
  );
};

export default InformacionAutismo;
