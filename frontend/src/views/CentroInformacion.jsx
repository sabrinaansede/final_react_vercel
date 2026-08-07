import React, { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Search, Info, Book, Heart, Brain, Star, Lightbulb, Users, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const ICON_MAP = {
  Info,
  Book,
  Heart,
  Brain,
  Star,
  Lightbulb,
};

const CATEGORY_INFO = {
  'Comprender el TEA': {
    description: 'Información fundamental sobre el Trastorno del Espectro Autista, sus características y cómo comprender mejor a las personas con TEA.',
    articles: ['¿Qué es el Autismo?', 'Características del TEA', 'El espectro autista']
  },
  'Detección temprana': {
    description: 'Señales de alerta, diagnóstico temprano y la importancia de la intervención oportuna en el desarrollo infantil.',
    articles: ['Señales de alerta', 'Diagnóstico temprano', 'Intervención temprana']
  },
  'Educación inclusiva': {
    description: 'Estrategias educativas, adaptaciones escolares y cómo fomentar un ambiente inclusivo para estudiantes con TEA.',
    articles: ['Adaptaciones escolares', 'Estrategias educativas', 'Inclusión en el aula']
  },
  'Terapias y apoyos': {
    description: 'Diferentes tipos de terapias, tratamientos y apoyos disponibles para personas con autismo y sus familias.',
    articles: ['Terapia ABA', 'Terapia del habla', 'Terapia ocupacional']
  },
  'Familias y cuidadores': {
    description: 'Recursos y guías para familias, cuidadores y personas cercanas a alguien con TEA.',
    articles: ['Guía para familias', 'Apoyo a cuidadores', 'Redes de apoyo']
  },
  'Derechos e inclusión': {
    description: 'Derechos legales, inclusión social y laboral de las personas con Trastorno del Espectro Autista.',
    articles: ['Derechos legales', 'Inclusión laboral', 'Accesibilidad']
  },
  'Vida cotidiana': {
    description: 'Consejos prácticos para la vida diaria, rutinas, habilidades de vida y autonomía.',
    articles: ['Rutinas diarias', 'Habilidades de vida', 'Autonomía personal']
  },
  'Recursos y organizaciones': {
    description: 'Organizaciones, asociaciones y recursos disponibles para la comunidad autista en Argentina.',
    articles: ['Organizaciones TEA', 'Recursos locales', 'Asociaciones']
  }
};

const CentroInformacion = () => {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModal, setCategoryModal] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/articulos`);
      const data = await response.json();
      setContent(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error al cargar contenido:', error);
      // Usar contenido de fallback si falla el backend
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let result = content;
    
    // Filtrar por categoría
    if (selectedCategory) {
      result = result.filter(item => item.icon === selectedCategory);
    }
    
    // Filtrar por búsqueda
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.intro?.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [content, query, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f7faff] px-4 pb-24 pt-5 sm:px-5">
      <div className="mx-auto max-w-6xl">
        {!selected ? (
          <>
            {console.log('Mostrando listado, artículos:', filtered.length)}
            <section className="mb-4 rounded-[24px] border border-[#dfefff] bg-gradient-to-br from-[#eef7ff] to-[#f9fcff] p-5 shadow-[0_10px_24px_rgba(67,161,242,0.08)] sm:p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e7f3ff] px-3 py-1 text-[0.78rem] font-bold uppercase tracking-[0.04em] text-[#2b7fd6]">
                Centro de Información
              </div>
              <h1
                className="mb-2 font-extrabold leading-tight text-[#1b2a4a]"
                style={{ fontSize: '1.05rem' }}
              >
                Encontrá información confiable, consejos y recursos para comprender mejor el autismo.
              </h1>
              <p className="m-0 text-[0.95rem] leading-6 text-[#5b6882]">
                Esta sección educativa de AutiSi ofrece contenidos claros y accesibles para personas autistas, familias, docentes, profesionales y la comunidad.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <Search size={18} className="text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar artículos por palabra clave"
                  className="flex-1 border-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </section>

            {/* Categories Section */}
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Categorías de Información</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Brain, label: 'Comprender el TEA', color: 'from-[#e8f4ff] to-[#d8efff]' },
                  { icon: Lightbulb, label: 'Detección temprana', color: 'from-[#fff7ed] to-[#ffedd5]' },
                  { icon: Book, label: 'Educación inclusiva', color: 'from-[#f0fdf4] to-[#dcfce7]' },
                  { icon: Heart, label: 'Terapias y apoyos', color: 'from-[#fef2f2] to-[#fee2e2]' },
                  { icon: Users, label: 'Familias y cuidadores', color: 'from-[#faf5ff] to-[#f3e8ff]' },
                  { icon: Star, label: 'Derechos e inclusión', color: 'from-[#eff6ff] to-[#dbeafe]' },
                  { icon: Info, label: 'Vida cotidiana', color: 'from-[#f0fdfa] to-[#ccfbf1]' },
                  { icon: Lightbulb, label: 'Recursos y organizaciones', color: 'from-[#fffbeb] to-[#fef3c7]' },
                ].map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => setCategoryModal(category.label)}
                      className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:border-[#43A1F2] hover:shadow-md"
                      type="button"
                    >
                      <div className={`grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br ${category.color}`}>
                        <Icon size={24} className="text-[#43A1F2]" />
                      </div>
                      <span className="text-xs font-semibold text-gray-900 sm:text-sm">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Articles List */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-gray-900">Todos los Artículos</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => {
                  const Icon = ICON_MAP[item.icon] || Brain;
                  return (
                    <button 
                      key={item.id || item._id} 
                      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 text-left shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:border-[#43A1F2] hover:shadow-md" 
                      type="button" 
                      onClick={() => {
                        console.log('Artículo seleccionado:', item);
                        setSelected(item);
                      }}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-[#e8f4ff] to-[#d8efff]">
                          <Icon size={22} className="text-[#43A1F2]" />
                        </div>
                        <span className="rounded-full bg-[#f0f8ff] px-3 py-1 text-xs font-semibold text-[#43A1F2]">
                          {item.icon}
                        </span>
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-[#43A1F2] transition-colors">{item.title}</h3>
                      <p className="mb-4 text-sm leading-6 text-gray-600 line-clamp-2">{item.intro}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Book size={14} />
                          <span>3-5 min</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#43A1F2] font-medium">
                          Leer más
                          <ArrowLeft size={14} className="rotate-180" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {filtered.length === 0 && (
              <div className="mt-4 rounded-lg border border-dashed border-gray-200 bg-white p-7 text-center text-gray-600">
                No encontramos artículos para esa búsqueda. Probá con otra palabra.
              </div>
            )}
          </>
        ) : (
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="p-6 sm:p-8">
              {/* Article Header */}
              <div className="mb-6 flex min-h-[160px] items-end justify-between rounded-xl bg-gradient-to-br from-[#43A1F2] to-[#2E7BB8] p-6 text-white">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                    {React.createElement(ICON_MAP[selected.icon] || Brain, { size: 14 })}
                    {selected.icon}
                  </div>
                  <h2 className="m-0 text-2xl font-extrabold text-white sm:text-3xl">{selected.title}</h2>
                </div>
                <div className="bg-white/20 rounded-full p-4">
                  {React.createElement(ICON_MAP[selected.icon] || Brain, { size: 40, className: "text-white" })}
                </div>
              </div>

              {/* Back Button */}
              <button className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-[#f3f8ff] px-4 py-2.5 text-sm font-bold text-[#2b7fd6] transition-all hover:bg-[#e7f3ff]" type="button" onClick={() => setSelected(null)}>
                <ArrowLeft size={16} />
                Volver al listado
              </button>

              {/* Article Content */}
              <div className="px-1 pb-1">
                <p className="mb-6 text-lg leading-8 text-gray-600">{selected.intro}</p>
                
                {selected.sections && selected.sections.map((section, index) => (
                  <div key={section.title || index} className="mb-6">
                    <h3 className="mb-3 text-xl font-extrabold text-gray-900">{section.title}</h3>
                    {section.text && <p className="text-base leading-7 text-gray-600">{section.text}</p>}
                    {section.list && (
                      <ul className="ml-6 list-disc space-y-2 text-base leading-7 text-gray-600">
                        {section.list.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                      </ul>
                    )}
                  </div>
                ))}

                {/* Highlight Box */}
                {selected.highlight && (
                  <div className="my-6 rounded-lg border border-gray-200 bg-gradient-to-br from-[#f7fbff] to-[#f0f8ff] p-5 text-base text-gray-700">
                    <div className="mb-2 flex items-center gap-2 font-bold text-[#43A1F2]">
                      <Star size={18} />
                      Destacado
                    </div>
                    {selected.highlight}
                  </div>
                )}

                {/* Related Articles */}
                {selected.related && selected.related.length > 0 && (
                  <div className="mt-8 rounded-lg border border-gray-200 bg-[#f8fafc] p-6">
                    <h3 className="mb-4 text-lg font-extrabold text-gray-900">También te puede interesar</h3>
                    <div className="flex flex-wrap gap-2">
                      {selected.related.map((item) => (
                        <span key={item} className="rounded-full border border-gray-200 bg-[#f0f8ff] px-4 py-2 text-sm font-bold text-[#2b7fd6] transition-all hover:bg-[#e7f3ff] hover:border-[#43A1F2] cursor-pointer">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Resources Section */}
                <div className="mt-8 rounded-lg border border-gray-200 bg-[#f8fafc] p-6">
                  <h3 className="mb-4 text-lg font-extrabold text-gray-900">Recursos Adicionales</h3>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#43A1F2] hover:shadow-md">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[#e8f4ff] to-[#d8efff]">
                        <Book size={20} className="text-[#43A1F2]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Guías descargables</h4>
                        <p className="text-sm text-gray-500">Material educativo para descargar</p>
                      </div>
                      <ArrowLeft size={18} className="rotate-180 text-[#43A1F2]" />
                    </a>
                    <a href="#" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#43A1F2] hover:shadow-md">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]">
                        <Users size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Organizaciones y asociaciones</h4>
                        <p className="text-sm text-gray-500">Enlaces a organizaciones de TEA</p>
                      </div>
                      <ArrowLeft size={18} className="rotate-180 text-[#43A1F2]" />
                    </a>
                    <a href="#" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#43A1F2] hover:shadow-md">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[#fef2f2] to-[#fee2e2]">
                        <Heart size={20} className="text-red-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Recursos para familias</h4>
                        <p className="text-sm text-gray-500">Apoyo y orientación para cuidadores</p>
                      </div>
                      <ArrowLeft size={18} className="rotate-180 text-[#43A1F2]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Category Modal */}
        {categoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{categoryModal}</h3>
                <button
                  onClick={() => setCategoryModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-base text-gray-600 leading-7 mb-6">
                  {CATEGORY_INFO[categoryModal]?.description}
                </p>
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Artículos relacionados</h4>
                  <div className="space-y-2">
                    {CATEGORY_INFO[categoryModal]?.articles.map((article, index) => {
                      const relatedArticle = content.find(item => 
                        item.title?.toLowerCase().includes(article.toLowerCase()) ||
                        article.toLowerCase().includes(item.title?.toLowerCase())
                      );
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            if (relatedArticle) {
                              setCategoryModal(null);
                              setSelected(relatedArticle);
                            }
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-[#f8fafc] hover:border-[#43A1F2] hover:bg-[#f0f8ff] transition-colors cursor-pointer text-left"
                          type="button"
                        >
                          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#e8f4ff]">
                            <Book size={16} className="text-[#43A1F2]" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{article}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={() => setCategoryModal(null)}
                  className="w-full py-3 bg-gradient-to-r from-[#43A1F2] to-[#2E7BB8] text-white font-semibold rounded-lg transition-all hover:from-[#2E7BB8] hover:to-[#43A1F2]"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CentroInformacion;
