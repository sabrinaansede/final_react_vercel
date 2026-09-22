import React, { useMemo, useState } from 'react';
import { ArrowLeft, Search, Brain, Heart, GraduationCap, Stethoscope, Scale, BookOpen, Lightbulb, Users } from 'lucide-react';
import './CentroInformacion.css';

const CATEGORIES = [
  {
    id: 'que-es-autismo',
    title: '¿Qué es el autismo?',
    description: 'Información fundamental sobre el espectro autista',
    icon: Brain,
    color: '#E8F5E9',
    iconColor: '#4CAF50',
  },
  {
    id: 'apoyar-persona-autista',
    title: '¿Cómo apoyar a una persona autista?',
    description: 'Guía práctica de acompañamiento',
    icon: Heart,
    color: '#FFF5F5',
    iconColor: '#EC7054',
  },
  {
    id: 'familias',
    title: 'Familias',
    description: 'Recursos para el entorno familiar',
    icon: Users,
    color: '#F0F9FF',
    iconColor: '#43A1F2',
  },
  {
    id: 'escuelas-inclusion',
    title: 'Escuelas e inclusión',
    description: 'Educación y ambientes inclusivos',
    icon: GraduationCap,
    color: '#FFF9E6',
    iconColor: '#F59E0B',
  },
  {
    id: 'profesionales',
    title: 'Profesionales',
    description: 'Orientación para el trabajo interdisciplinario',
    icon: Stethoscope,
    color: '#F3E8FF',
    iconColor: '#961E67',
  },
  {
    id: 'mitos-realidades',
    title: 'Mitos y realidades',
    description: 'Desmitificando creencias comunes',
    icon: Lightbulb,
    color: '#E8F5E9',
    iconColor: '#59C2BA',
  },
  {
    id: 'derechos-recursos',
    title: 'Derechos y recursos',
    description: 'Marco legal y apoyo disponible',
    icon: Scale,
    color: '#F0F9FF',
    iconColor: '#43A1F2',
  },
  {
    id: 'consejos-dia-a-dia',
    title: 'Consejos para el día a día',
    description: 'Prácticas cotidianas útiles',
    icon: BookOpen,
    color: '#FFF5F5',
    iconColor: '#EC7054',
  },
];

const CentroInformacion = () => {
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

  return (
    <div className="centro-informacion-container">
      <div className="centro-informacion-wrapper">
        {!selected ? (
          <>
            {/* Header Section */}
            <section className="info-header-section">
              <div className="info-badge">Centro de Información</div>
              <h1 className="info-title">
                Encontrá información confiable, consejos y recursos para comprender mejor el autismo.
              </h1>
              <p className="info-description">
                Esta sección educativa de AutiSi ofrece contenidos claros y accesibles para personas autistas, familias, docentes, profesionales y la comunidad.
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
                    >
                      <div className="category-content">
                        <h3 className="category-title">{category.title}</h3>
                        <p className="category-description">{category.description}</p>
                      </div>
                      <div className="category-icon-wrapper" style={{ backgroundColor: category.color }}>
                        <Icon size={32} className="category-icon" style={{ color: category.iconColor }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <section className="article-detail-section">
            <div className="article-detail-container">
              {/* Article Header */}
              <div className="article-header">
                <div className="article-header-content">
                  <div className="article-badge">
                    {React.createElement(selected.icon, { size: 16 })}
                    {selected.title}
                  </div>
                  <h2 className="article-title">{selected.title}</h2>
                </div>
                <div className="article-header-icon">
                  {React.createElement(selected.icon, { size: 48 })}
                </div>
              </div>

              {/* Back Button */}
              <button className="back-button" onClick={() => setSelected(null)}>
                <ArrowLeft size={18} />
                ← Volver a categorías
              </button>

              {/* Article Content */}
              <div className="article-content">
                <p className="article-intro">{selected.description}</p>
                
                <div className="article-placeholder">
                  <p className="placeholder-text">
                    El contenido detallado sobre "{selected.title}" estará disponible próximamente.
                  </p>
                  <p className="placeholder-subtext">
                    Esta categoría está en desarrollo para brindarte información completa y actualizada.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CentroInformacion;
