import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Star, 
  Heart, 
  MapPin, 
  Calendar, 
  ThumbsUp, 
  User, 
  Mail, 
  Clock, 
  Activity,
  Settings,
  LogOut,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="loading-skeleton">
    <div className="skeleton-header"></div>
    <div className="skeleton-metrics">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton-metric"></div>
      ))}
    </div>
    <div className="skeleton-activity">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-activity-item"></div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalResenas: 0,
    likesDados: 0,
    lugaresVisitados: 0,
    promedioRating: 0,
    actividadesRecientes: [],
    resenasRecientes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Hace unos segundos';
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `Hace ${mins} minuto${mins > 1 ? 's' : ''}`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-AR');
  };

  const getActivityIcon = (tipo) => {
    switch (tipo) {
      case 'resena':
        return <MessageSquare size={18} />;
      case 'like':
        return <ThumbsUp size={18} />;
      case 'visita':
        return <MapPin size={18} />;
      default:
        return <Activity size={18} />;
    }
  };

  const getDatosEjemplo = () => ({
    totalResenas: 5,
    likesDados: 12,
    lugaresVisitados: 3,
    promedioRating: 4.2,
    actividadesRecientes: [
      {
        tipo: 'resena',
        mensaje: 'Publicaste una reseña en Café Central',
        fecha: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        tipo: 'like',
        mensaje: 'Diste me gusta a una reseña',
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        tipo: 'visita',
        mensaje: 'Visitaste el Parque Central',
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      }
    ],
    reseñasRecientes: [
      {
        _id: '1',
        lugar: { nombre: 'Café Central' },
        puntuacion: 5,
        comentario: 'Excelente café y atención',
        fechaCreacion: new Date().toISOString()
      },
      {
        _id: '2',
        lugar: { nombre: 'Parque Central' },
        puntuacion: 4,
        comentario: 'Muy buen lugar para pasear',
        fechaCreacion: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  });

  const recargarDatos = async () => {
    try {
      setLoading(true);
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const token = localStorage.getItem('token');

      if (!usuario?._id || !token) return navigate('/login');

      const [resEstadisticas, resResenas] = await Promise.all([
        fetch(`${API_URL}/api/usuarios/${usuario._id}/estadisticas`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          credentials: 'include'
        }),
        fetch(`${API_URL}/api/resenas?usuario=${usuario._id}`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          credentials: 'include'
        })
      ]);

      const estadisticas = await resEstadisticas.json();
      let resenasData = await resResenas.json();

      if (resenasData?.data) resenasData = resenasData.data;

      const reseñas = Array.isArray(resenasData) ? resenasData : [];

      // Filtrar solo las reseñas del usuario actual
      const misResenas = reseñas.filter(resena => 
        resena.usuario?._id === usuario._id || resena.usuario === usuario._id
      );
      
      setStats({
        totalResenas: misResenas.length,
        likesDados: estadisticas.data?.totalLikes || 0,
        lugaresVisitados:
          estadisticas.data?.lugaresVisitados ||
          new Set(misResenas.map((r) => r.lugar?._id || r.lugar)).size,
        promedioRating:
          estadisticas.data?.promedioRating ||
          (misResenas.length
            ? (misResenas.reduce((sum, r) => sum + (r.puntuacion || 0), 0) / misResenas.length).toFixed(1)
            : 0),
        actividadesRecientes: estadisticas.data?.actividadesRecientes || [],
        resenasRecientes: misResenas
          .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
          .slice(0, 5)
      });
    } catch (error) {
      setStats(getDatosEjemplo());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    recargarDatos();
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    setUserData(usuario);
  }, [location]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        {/* Se eliminó el logo de la barra lateral */}

        <div className="user-profile">
          <div className="user-avatar">
            {userData?.nombre ? userData.nombre.charAt(0).toUpperCase() : 'U'}
          </div>
          <h3>{userData?.nombre || 'Usuario'}</h3>
          <p className="user-email">
            <Mail size={14} />
            {userData?.email || 'usuario@ejemplo.com'}
          </p>
          <p className="member-since">
            <Calendar size={14} />
            Miembro desde {new Date(userData?.fechaCreacion || new Date()).toLocaleDateString('es-AR')}
          </p>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <Activity />
            <span>Resumen</span>
          </button>
          <button className="nav-item">
            <Heart />
            <span>Favoritos</span>
          </button>
          <button className="nav-item">
            <User />
            <span>Perfil</span>
          </button>
        </nav>

        <div className="quick-actions">
          <h4>Acciones Rápidas</h4>
          <button className="action-btn">
            <Settings size={18} />
            <span>Configuración</span>
          </button>
          <button 
            className="action-btn text-danger"
            onClick={() => {
              // Handle logout
              localStorage.removeItem('token');
              navigate('/login');
            }}
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div>
            <h1>Mi Perfil</h1>
            <p>Bienvenido a tu perfil, {userData?.nombre?.split(' ')[0] || 'Usuario'}. Aquí está un resumen de tu actividad en Autisi.</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} className="mr-2" />
            Actualizar
          </button>
        </header>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-container primary">
              <MessageSquare size={20} />
            </div>
            <div className="metric-info">
              <div className="metric-value">{stats.totalResenas}</div>
              <div className="metric-label">Reseñas Totales</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-container success">
              <ThumbsUp size={20} />
            </div>
            <div className="metric-info">
              <div className="metric-value">{stats.likesDados}</div>
              <div className="metric-label">Me Gusta Dados</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-container warning">
              <MapPin size={20} />
            </div>
            <div className="metric-info">
              <div className="metric-value">{stats.lugaresVisitados}</div>
              <div className="metric-label">Lugares Visitados</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-container danger">
              <Star size={20} />
            </div>
            <div className="metric-info">
              <div className="metric-value">
                {typeof stats.promedioRating === 'number' ? stats.promedioRating.toFixed(1) : '0.0'}
              </div>
              <div className="metric-label">Puntuación Promedio</div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <section className="activity-feed">
          <h2 className="section-title">Actividad Reciente</h2>
          {stats.actividadesRecientes && stats.actividadesRecientes.length > 0 ? (
            <div className="activity-list">
              {stats.actividadesRecientes.map((actividad, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(actividad.tipo)}
                  </div>
                  <div className="activity-details">
                    <p className="activity-message">{actividad.mensaje}</p>
                    <p className="activity-time">
                      <Clock size={14} />
                      {formatTimeAgo(actividad.fecha || new Date())}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-activities">No hay actividad reciente para mostrar.</p>
          )}
        </section>

        {/* Recent Reviews */}
        {stats.resenasRecientes && stats.resenasRecientes.length > 0 && (
          <section className="recent-reviews mt-5">
            <div className="section-header">
              <h2 className="section-title">Tus Reseñas Recientes</h2>
              <button className="view-all-btn" onClick={() => navigate('/mis-resenas')}>
                Ver todas
              </button>
            </div>

            <div className="reviews-grid">
              {stats.resenasRecientes.map((resena, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="place-info">
                      <MapPin size={16} />
                      <h3>{resena.lugar?.nombre || 'Lugar no especificado'}</h3>
                    </div>

                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < resena.puntuacion ? '#F59E0B' : 'none'}
                          color="#F59E0B"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="review-comment">{resena.comentario}</p>

                  <div className="review-footer">
                    <span className="review-date">
                      {new Date(resena.fechaCreacion).toLocaleDateString('es-AR')}
                    </span>

                    <div className="review-actions">
                      <button
                        className="action-btn"
                        onClick={() => navigate(`/editar-resena/${resena._id}`)}
                      >
                        <MessageSquare size={14} /> Editar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACCIONES RÁPIDAS */}
        <section className="quick-actions-grid">
          <div className="quick-action-card" onClick={() => navigate('/mapa')}>
            <MapPin size={24} />
            <h3>Explorar Mapa</h3>
            <p>Descubre nuevos lugares cerca de ti</p>
          </div>

          <div className="quick-action-card" onClick={() => navigate('/favoritos')}>
            <Heart size={24} />
            <h3>Favoritos</h3>
            <p>Tus lugares guardados</p>
          </div>

          <div className="quick-action-card" onClick={() => navigate('/contacto')}>
            <MessageSquare size={24} />
            <h3>Ayuda</h3>
            <p>Contáctanos si necesitas asistencia</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
