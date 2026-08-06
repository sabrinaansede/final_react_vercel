import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Heart,
  ImagePlus,
  Menu,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
} from 'lucide-react';
import './comunidad.css';

const CATEGORIES = [
  { id: 'todas', label: 'Todas', emoji: '✨', chipClass: 'chip-familias' },
  { id: 'Familias', label: 'Familias', emoji: '👨‍👩‍👧', chipClass: 'chip-familias' },
  { id: 'Experiencias', label: 'Experiencias', emoji: '💬', chipClass: 'chip-experiencias' },
  { id: 'Consejos', label: 'Consejos', emoji: '💡', chipClass: 'chip-consejos' },
  { id: 'Profesionales', label: 'Profesionales', emoji: '👨‍⚕️', chipClass: 'chip-profesionales' },
  { id: 'Terapias', label: 'Terapias', emoji: '❤️', chipClass: 'chip-terapias' },
];

const BADGE_CLASS = {
  Familias: 'chip-familias',
  Experiencias: 'chip-experiencias',
  Consejos: 'chip-consejos',
  Profesionales: 'chip-profesionales',
  Terapias: 'chip-terapias',
};

const INITIAL_POSTS = [
  {
    id: '1',
    author: 'Mariana G.',
    category: 'Familias',
    date: '12 de mayo',
    text: 'Hoy fue un gran día, mi hijo logró expresar lo que sentía con palabras. Pequeños pasos, grandes logros 💙',
    image: null,
    routine: null,
    likes: 24,
    liked: false,
    saved: false,
    comments: 8,
  },
  {
    id: '2',
    author: 'Javier P.',
    category: 'Consejos',
    date: '10 de mayo',
    text: 'Comparto una rutina visual para las mañanas. Nos ayudó mucho a reducir la ansiedad antes de salir.',
    image: null,
    routine: [
      { emoji: '🛏️', label: 'Levantarse' },
      { emoji: '👕', label: 'Vestirse' },
      { emoji: '🥣', label: 'Desayunar' },
      { emoji: '🎒', label: 'Mochila' },
      { emoji: '🚗', label: 'Auto' },
    ],
    likes: 41,
    liked: true,
    saved: true,
    comments: 15,
  },
];

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const Comunidad = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const guardadosOnly = location.pathname === '/comunidad/guardados';

  const composerRef = useRef(null);
  const textareaRef = useRef(null);

  const [usuario, setUsuario] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todas');
  const [draft, setDraft] = useState('');
  const [posts, setPosts] = useState(INITIAL_POSTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('usuario');
      setUsuario(raw ? JSON.parse(raw) : null);
    } catch {
      setUsuario(null);
    }
  }, []);

  const userName = usuario?.nombre ? `${usuario.nombre} ${usuario.apellido || ''}`.trim() : 'Usuario';
  const userInitials = getInitials(userName);

  const filteredPosts = useMemo(() => {
    let list = guardadosOnly ? posts.filter((p) => p.saved) : posts;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.text.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'todas') {
      list = list.filter((p) => p.category === activeCategory);
    }
    return list;
  }, [posts, search, activeCategory, guardadosOnly]);

  const scrollToComposer = () => {
    if (guardadosOnly) {
      navigate('/comunidad');
      setTimeout(() => {
        composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        textareaRef.current?.focus();
      }, 100);
      return;
    }
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    textareaRef.current?.focus();
  };

  const handlePublish = () => {
    const text = draft.trim();
    if (!text) return;
    const category =
      activeCategory !== 'todas' ? activeCategory : 'Experiencias';
    const newPost = {
      id: String(Date.now()),
      author: userName,
      category,
      date: 'Ahora',
      text,
      image: null,
      routine: null,
      likes: 0,
      liked: false,
      saved: false,
      comments: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    setDraft('');
  };

  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const toggleSave = (id) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
  };

  return (
    <div className="comunidad-page">
      <header className="comunidad-header">
        <button
          type="button"
          className="comunidad-header-btn"
          aria-label="Menú"
          onClick={() => navigate('/')}
        >
          <Menu size={22} />
        </button>
        <div className="comunidad-logo">
          <span className="comunidad-logo-line">Comunidad</span>
          <span className="comunidad-logo-brand">AutiSi</span>
        </div>
        <button type="button" className="comunidad-header-btn" aria-label="Notificaciones">
          <Bell size={22} />
        </button>
      </header>

      <main className="comunidad-main">
        {!guardadosOnly && (
          <>
            <div className="comunidad-search">
              <span className="text-gray-400" aria-hidden>
                🔍
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="¿Qué estás buscando?"
                aria-label="Buscar publicaciones"
              />
            </div>

            <div className="comunidad-chips" role="tablist" aria-label="Categorías">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  className={`comunidad-chip ${cat.chipClass} ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <article className="comunidad-card" ref={composerRef}>
              <div className="comunidad-composer-top">
                <div className="comunidad-avatar" aria-hidden>
                  {userInitials}
                </div>
                <p className="comunidad-composer-hint">Comparte algo con la comunidad...</p>
              </div>
              <div className="comunidad-composer-field">
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Escribe tu publicación aquí..."
                  aria-label="Escribir publicación"
                />
                <button type="button" className="comunidad-image-btn" aria-label="Agregar imagen">
                  <ImagePlus size={20} />
                </button>
              </div>
              <div className="comunidad-publish-row">
                <button
                  type="button"
                  className="comunidad-publish-btn"
                  onClick={handlePublish}
                  disabled={!draft.trim()}
                >
                  Publicar
                </button>
              </div>
            </article>
          </>
        )}

        {guardadosOnly && (
          <div className="mb-4">
            <h1 className="text-xl font-extrabold text-[#1F2937] m-0">Publicaciones guardadas</h1>
            <p className="text-sm text-[#6B7280] mt-1">Accedé rápido a lo que marcaste con 📌 Guardar.</p>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="comunidad-empty">
            <h2>{guardadosOnly ? 'Aún no guardaste publicaciones' : 'No hay resultados'}</h2>
            <p>
              {guardadosOnly
                ? 'Explorá el feed y tocá Guardar en las publicaciones que te sirvan.'
                : 'Probá otra búsqueda o categoría.'}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article key={post.id} className="comunidad-card">
              <div className="post-header">
                <div className="comunidad-avatar" aria-hidden>
                  {getInitials(post.author)}
                </div>
                <div className="post-meta">
                  <p className="post-name">{post.author}</p>
                  <div className="post-badge-row">
                    <span className={`post-badge ${BADGE_CLASS[post.category] || 'chip-familias'}`}>
                      {post.category}
                    </span>
                    <span className="post-date">{post.date}</span>
                  </div>
                </div>
                <button type="button" className="post-menu-btn" aria-label="Más opciones">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p className="post-text">{post.text}</p>

              {post.image && (
                <img src={post.image} alt="" className="post-image" />
              )}

              {post.routine && (
                <div className="post-routine" aria-label="Rutina visual">
                  {post.routine.map((step) => (
                    <div key={step.label} className="post-routine-step">
                      <span>{step.emoji}</span>
                      {step.label}
                    </div>
                  ))}
                </div>
              )}

              <div className="post-actions">
                <button
                  type="button"
                  className={`post-action-btn ${post.liked ? 'liked' : ''}`}
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} />
                  Me gusta
                  {post.likes > 0 && ` · ${post.likes}`}
                </button>
                <button type="button" className="post-action-btn">
                  <MessageCircle size={16} />
                  Comentarios
                  {post.comments > 0 && ` · ${post.comments}`}
                </button>
                <button
                  type="button"
                  className={`post-action-btn ${post.saved ? 'text-[#43A1F2]' : ''}`}
                  onClick={() => toggleSave(post.id)}
                >
                  <Bookmark size={16} fill={post.saved ? 'currentColor' : 'none'} />
                  Guardar
                </button>
                <button type="button" className="post-action-btn" aria-label="Más opciones">
                  <MoreHorizontal size={16} />
                  Más
                </button>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
};

export default Comunidad;
