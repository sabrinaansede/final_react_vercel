import React, { useMemo, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Heart,
  ImagePlus,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  Star,
  Search,
  Users,
  Lightbulb,
  User,
  Sparkles,
} from 'lucide-react';
import './comunidad.css';


const CATEGORIES = [
  { id: 'todas', label: 'Todas', icon: Sparkles },
  { id: 'Familias', label: 'Familias', icon: Users },
  { id: 'Experiencias', label: 'Experiencias', icon: MessageCircle },
  { id: 'Consejos', label: 'Consejos', icon: Lightbulb },
  { id: 'Profesionales', label: 'Profesionales', icon: User },
  { id: 'Terapias', label: 'Terapias', icon: Heart },
];

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
  const [posts, setPosts] = useState([]);
  const { socket } = useSocket() || {};
  const [openComments, setOpenComments] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [orderBy, setOrderBy] = useState('recientes');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('usuario');
      setUsuario(raw ? JSON.parse(raw) : null);
    } catch {
      setUsuario(null);
    }
  }, []);

  const userName = usuario?.nombre ? `${usuario.nombre} ${usuario.apellido || ''}`.trim() : 'Usuario';
  const userInitials = (userName || 'U').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    axios
      .get(`${BACKEND}/api/comunidad/posts`)
      .then((res) => {
        const data = res.data?.data || [];
        setPosts(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onNuevoPost = (e) => setPosts((prev) => [e.detail, ...prev]);
    const onNuevoLike = (e) => {
      const { postId, liked, likes } = e.detail || {};
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, liked, likes } : p)));
    };
    const onNuevoComentario = (e) => {
      const { postId, comment } = e.detail || {};
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [comment, ...prev[postId]] : [comment],
      }));
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p)));
    };

    window.addEventListener('socket:nuevo-post', onNuevoPost);
    window.addEventListener('socket:nuevo-like', onNuevoLike);
    window.addEventListener('socket:nuevo-comentario', onNuevoComentario);

    return () => {
      window.removeEventListener('socket:nuevo-post', onNuevoPost);
      window.removeEventListener('socket:nuevo-like', onNuevoLike);
      window.removeEventListener('socket:nuevo-comentario', onNuevoComentario);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

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
    const text = (draft || '').trim();
    if (!text && !imageFile) return;

    const category = activeCategory !== 'todas' ? activeCategory : 'Experiencias';
    const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const form = new FormData();

    form.append('author', userName);
    form.append('category', category);
    form.append('text', text);
    if (imageFile) form.append('image', imageFile);

    axios
      .post(`${BACKEND}/api/comunidad/posts`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        const created = res.data?.data || null;
        if (created) setPosts((prev) => [created, ...prev]);
        setDraft('');
        setImageFile(null);
        setImagePreview(null);
      })
      .catch((err) => {
        console.error('Error enviando post:', err.message || err);
      });
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
          : p,
      ),
    );

    try {
      const post = posts.find((x) => x.id === id);
      const payload = {
        postId: id,
        liked: !post?.liked,
        likes: post?.liked ? post.likes - 1 : post.likes + 1,
      };
      socket?.emit('nuevo-like', payload);
    } catch (error) {
      console.warn('Socket emit nuevo-like falló', error.message || error);
    }
  };

  const toggleComments = (id) => {
    setOpenComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const submitComment = (postId) => {
    const text = (commentDrafts[postId] || '').trim();
    if (!text) return;

    const comment = {
      id: String(Date.now()),
      author: userName,
      text,
      date: 'Ahora',
    };

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: prev[postId] ? [comment, ...prev[postId]] : [comment],
    }));

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p,
      ),
    );

    try {
      socket?.emit('nuevo-comentario', { postId, comment });
    } catch (error) {
      console.warn('Socket emit nuevo-comentario falló', error.message || error);
    }

    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditDraft(post.text || '');
    setEditImageFile(null);
    setEditImagePreview(post.imageUrl || null);
    setShowEditModal(true);
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;

    const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const form = new FormData();

    form.append('text', editDraft);
    if (editImageFile) form.append('image', editImageFile);

    axios
      .put(`${BACKEND}/api/comunidad/posts/${editingPost.id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        const updated = res.data?.data || null;
        if (updated) {
          setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? updated : p)));
        }
        setShowEditModal(false);
        setEditingPost(null);
        setEditDraft('');
        setEditImageFile(null);
        setEditImagePreview(null);
      })
      .catch((err) => {
        console.error('Error actualizando post:', err.message || err);
      });
  };

  const handleDeletePost = (postId) => {
    const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    console.log('Intentando eliminar post:', postId);
    console.log('URL:', `${BACKEND}/api/comunidad/posts/${postId}`);

    axios
      .delete(`${BACKEND}/api/comunidad/posts/${postId}`)
      .then((response) => {
        console.log('Respuesta del servidor:', response);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setNotification({ type: 'success', message: 'Publicación eliminada correctamente' });
        setTimeout(() => setNotification(null), 3000);
      })
      .catch((err) => {
        console.error('Error eliminando post:', err);
        console.error('Error response:', err.response);
        console.error('Error status:', err.response?.status);
        console.error('Error data:', err.response?.data);
        const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar la publicación';
        setNotification({ type: 'error', message: errorMessage });
        setTimeout(() => setNotification(null), 3000);
      });
  };

  const isPostOwner = (post) => {
    return post.author === userName;
  };

  const toggleSave = (id) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)));
  };

  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return posts
      .filter((post) => {
        if (guardadosOnly && !post.saved) return false;
        if (activeCategory !== 'todas' && post.category !== activeCategory) return false;
        if (!normalizedSearch) return true;
        return [post.author, post.category, post.text]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));
      })
      .sort((a, b) => {
        if (orderBy === 'populares') return (b.likes || 0) - (a.likes || 0);
        if (orderBy === 'comentadas') return (b.comments || 0) - (a.comments || 0);
        return new Date(b.createdAt || b.date || Date.now()) - new Date(a.createdAt || a.date || Date.now());
      });
  }, [posts, activeCategory, search, orderBy, guardadosOnly]);

  return (
    <div className="comunidad-container">
      <main className="comunidad-main">
        {/* Hero Header */}
        <div className="comunidad-hero">
          <div className="comunidad-hero-content">
            <div className="comunidad-hero-text">
              <div className="comunidad-hero-badge">
                <Star size={16} className="text-[#43A1F2]" />
                <span className="comunidad-hero-badge-text">Comunidad AutiSi</span>
              </div>
              <h1 className="comunidad-hero-title">
                Conectá, compartí y aprendé
              </h1>
              <p className="comunidad-hero-description">
                Un espacio seguro para publicar preguntas, historias y recursos; pensado para familias, personas con TEA y profesionales.
              </p>
            </div>
            <div className="comunidad-hero-buttons">
              <button
                type="button"
                onClick={scrollToComposer}
                className="comunidad-btn-primary"
              >
                Nueva publicación
              </button>
              <button
                type="button"
                onClick={() => navigate('/comunidad/guardados')}
                className="comunidad-btn-secondary"
              >
                Guardados
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout: Feed 75% + Sidebar 340px */}
        <div className="comunidad-layout">
          {/* Feed Section */}
          <section className="comunidad-feed feed-section">
            {/* Search & Filters */}
            <div className="comunidad-search-card">
              <div className="comunidad-search-header">
                <div className="comunidad-search-info">
                  <h2 className="comunidad-search-title">Explorá la comunidad</h2>
                  <p className="comunidad-search-description">Filtrá por categoría, buscá por palabra clave o elegí lo más reciente.</p>
                </div>
                <div className="comunidad-search-controls">
                  <label className="comunidad-search-wrapper">
                    <input
                      className="comunidad-search-input"
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar publicaciones..."
                      aria-label="Buscar publicaciones"
                    />
                    <Search size={20} className="comunidad-search-icon text-gray-400" />
                  </label>
                  <select
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                    className="comunidad-select"
                  >
                    <option value="recientes">Más recientes</option>
                    <option value="populares">Más populares</option>
                    <option value="comentadas">Más comentadas</option>
                  </select>
                </div>
              </div>

              <div className="comunidad-categories">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`comunidad-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    >
                      <Icon size={18} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Create Post Card */}
            <article className="comunidad-create-post" ref={composerRef}>
              <div className="comunidad-create-post-header">
                <div className="comunidad-avatar">
                  {userInitials}
                </div>
                <div className="comunidad-create-post-content">
                  <div className="comunidad-create-post-title-row">
                    <div>
                      <h2 className="comunidad-create-post-title">Creá un post</h2>
                      <p className="comunidad-create-post-subtitle">Compartí una idea, una pregunta o un recurso útil.</p>
                    </div>
                    <span className="comunidad-create-post-badge">
                      {activeCategory === 'todas' ? 'Experiencias' : activeCategory}
                    </span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Escribí tu publicación aquí..."
                    aria-label="Escribir publicación"
                    className="comunidad-textarea"
                  />
                </div>
              </div>

              <div className="comunidad-create-post-actions">
                <div className="flex flex-wrap gap-3">
                  <label className="comunidad-attach-btn">
                    <ImagePlus size={18} />
                    <span>Adjuntar imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageFile(file);
                        setImagePreview(file ? URL.createObjectURL(file) : null);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={!draft.trim() && !imageFile}
                  className="comunidad-btn-primary"
                  style={{ opacity: (!draft.trim() && !imageFile) ? 0.6 : 1, cursor: (!draft.trim() && !imageFile) ? 'not-allowed' : 'pointer' }}
                >
                  Publicar ahora
                </button>
              </div>

              {imagePreview && (
                <div className="comunidad-image-preview">
                  <img src={imagePreview} alt="Vista previa" />
                </div>
              )}
            </article>

            {/* Posts Feed */}
            {filteredPosts.length === 0 ? (
              <div className="comunidad-empty-state">
                <h2 className="comunidad-empty-title">{guardadosOnly ? 'No hay publicaciones guardadas aún' : 'No encontramos resultados'}</h2>
                <p className="comunidad-empty-text">{guardadosOnly ? 'Guardá los posts que te gusten para volver a verlos después.' : 'Probá otra palabra clave o categoría.'}</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article key={post.id} className="comunidad-post">
                  <div className="comunidad-post-header">
                    <div className="comunidad-post-author">
                      <div className="comunidad-post-avatar">
                        {(post.author || 'Usuario').split(' ').map((segment) => segment[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="comunidad-post-author-info">
                        <p className="comunidad-post-author-name">{post.author}</p>
                        <div className="comunidad-post-meta">
                          <span>{new Date(post.createdAt || post.date || Date.now()).toLocaleString()}</span>
                          <span className="comunidad-post-category">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      {isPostOwner(post) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-[#43A1F2]"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id || post.id)}
                            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-red-500"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                      <button className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                    <p className="comunidad-post-text">{post.text}</p>
                  </div>

                  {post.imageUrl && (
                    <div className="comunidad-post-image">
                      <img src={post.imageUrl} alt="Publicación" />
                    </div>
                  )}

                  <div className="comunidad-post-actions">
                    <div className="comunidad-post-actions-buttons">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className={`comunidad-action-btn ${post.liked ? 'liked' : ''}`}
                      >
                        <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />
                        Me gusta{post.likes > 0 ? ` · ${post.likes}` : ''}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleComments(post.id)}
                        className="comunidad-action-btn"
                      >
                        <MessageCircle size={18} />
                        Comentarios{post.comments > 0 ? ` · ${post.comments}` : ''}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSave(post.id)}
                        className="comunidad-action-btn"
                      >
                        <Bookmark size={18} />
                        {post.saved ? 'Guardado' : 'Guardar'}
                      </button>
                    </div>

                    {openComments[post.id] && (
                      <div className="comunidad-comments-section">
                        <div className="comunidad-comment-list">
                          {(commentsMap[post.id] || []).map((comment) => (
                            <div key={comment.id} className="comunidad-comment">
                              <div className="comunidad-comment-header">
                                <span>{comment.author}</span>
                                <span className="comunidad-comment-date">{comment.date}</span>
                              </div>
                              <p className="comunidad-comment-text">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                        <div className="comunidad-comment-form">
                          <textarea
                            value={commentDrafts[post.id] || ''}
                            onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Escribí un comentario..."
                            rows={2}
                            className="comunidad-comment-input"
                          />
                          <button
                            type="button"
                            onClick={() => submitComment(post.id)}
                            className="comunidad-btn-primary"
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))
            )}
          </section>

          {/* Sidebar */}
          <aside className="comunidad-sidebar">
            <div className="comunidad-sidebar-card">
              <h3 className="comunidad-sidebar-title">Sobre la comunidad</h3>
              <p className="comunidad-sidebar-description">Compartí experiencias, preguntas y recursos en un espacio seguro y colaborativo.</p>
            </div>

            <div className="comunidad-sidebar-card">
              <h3 className="comunidad-sidebar-title">Temas populares</h3>
              <div className="comunidad-topics">
                {['#Rutinas', '#Escuela', '#Comunicación', '#Terapias', '#Inclusión'].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className="comunidad-topic-btn"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="comunidad-sidebar-card">
              <h3 className="comunidad-sidebar-title">Normas de la comunidad</h3>
              <ul className="comunidad-rules">
                <li>• Sé respetuoso</li>
                <li>• No compartas datos personales</li>
                <li>• Comparte apoyo real</li>
                <li>• Mantén un tono amable</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingPost && (
          <div className="comunidad-edit-modal">
            <div className="comunidad-edit-modal-content">
              {/* Header */}
              <div className="comunidad-edit-modal-header">
                <div className="comunidad-edit-modal-header-content">
                  <div className="comunidad-edit-modal-title-group">
                    <div className="comunidad-edit-modal-icon">
                      <Edit size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="comunidad-edit-modal-title">Editar publicación</h3>
                      <p className="comunidad-edit-modal-subtitle">Modificá el contenido de tu post</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingPost(null);
                      setEditDraft('');
                      setEditImageFile(null);
                      setEditImagePreview(null);
                    }}
                    className="comunidad-edit-modal-close"
                  >
                    <X size={24} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="comunidad-edit-modal-body">
                <div className="mb-5">
                  <label className="comunidad-edit-modal-label">
                    <span className="comunidad-edit-modal-label-indicator"></span>
                    Contenido
                  </label>
                  <textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    placeholder="Editá tu publicación..."
                    rows={6}
                    className="comunidad-edit-modal-textarea"
                  />
                </div>
                
                {editImagePreview && (
                  <div className="mb-5">
                    <label className="comunidad-edit-modal-label">
                      <span className="comunidad-edit-modal-label-indicator"></span>
                      Imagen actual
                    </label>
                    <div className="comunidad-edit-modal-image-preview">
                      <img src={editImagePreview} alt="Vista previa" />
                      <div className="comunidad-edit-modal-image-overlay"></div>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="comunidad-edit-modal-image-label">
                    <ImagePlus size={18} className="text-[#43A1F2]" />
                    <span>Cambiar imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setEditImageFile(file);
                        setEditImagePreview(file ? URL.createObjectURL(file) : editingPost.imageUrl || null);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div className="comunidad-edit-modal-buttons">
                  <button
                    onClick={handleUpdatePost}
                    className="comunidad-edit-modal-button-primary"
                  >
                    Guardar cambios
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingPost(null);
                      setEditDraft('');
                      setEditImageFile(null);
                      setEditImagePreview(null);
                    }}
                    className="comunidad-edit-modal-button-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className={`fixed bottom-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <span>✓</span>
              ) : (
                <span>✕</span>
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Comunidad;
