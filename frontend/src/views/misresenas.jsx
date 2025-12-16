import React, { useEffect, useMemo, useState } from "react";
import { Star, MapPin, MessageSquare, Trash2, Edit } from "lucide-react";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MisResenas = () => {
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const usuario = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("usuario") || "null"); } catch { return null; }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMensaje("");
      try {
        const res = await fetch(`${API_URL}/api/resenas`);
        const json = await res.json();
        const all = Array.isArray(json) ? json : (json.data || []);
        const uid = usuario?._id;
        const mine = uid ? all.filter(r => (r.usuario?._id || r.usuario) === uid) : [];
        setReseñas(mine);
      } catch (e) {
        setMensaje("❌ Error al cargar tus reseñas");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [usuario]);

  // Función para renderizar las estrellas de puntuación
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        fill={i < rating ? "#F59E0B" : "none"} 
        color={i < rating ? "#F59E0B" : "#E2E8F0"} 
        className="star"
      />
    ));
  };

  if (!usuario) {
    return (
      <div className="mis-resenas-container">
        <div className="mis-resenas-inner">
          <div className="mis-resenas-header">
            <h1 className="mis-resenas-title">Mis reseñas</h1>
            <p className="mis-resenas-subtitle">Iniciá sesión para ver tus reseñas.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-resenas-container">
      <div className="mis-resenas-inner">
        <div className="mis-resenas-header">
          <h1 className="mis-resenas-title">Mis reseñas</h1>
          <p className="mis-resenas-subtitle">Tus opiniones sobre los lugares visitados</p>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Cargando tus reseñas...</p>
          </div>
        )}

        {mensaje && (
          <div className="error-message">
            <p>{mensaje}</p>
          </div>
        )}

        {!loading && reseñas.length === 0 && (
          <div className="no-reviews">
            <p className="no-reviews-text">Aún no has dejado reseñas.</p>
            <button 
              className="primary-button"
              onClick={() => window.location.href = '/mapa'}
            >
              Ver lugares para reseñar
            </button>
          </div>
        )}

        <div className="reviews-grid">
          {reseñas.map((r) => (
            <div key={r._id} className="review-card">
              {r.fotoUrl && (
                <div className="review-image-container">
                  <img 
                    src={r.fotoUrl} 
                    alt="foto reseña" 
                    className="review-image"
                  />
                </div>
              )}
              
              <div className="review-content">
                <div className="review-header">
                  <h3 className="review-place">
                    {typeof r.lugar === 'object' ? (r.lugar?.nombre || 'Lugar no especificado') : 'Lugar no especificado'}
                  </h3>
                  <span className="review-date">
                    {new Date(r.creadoEn || r.createdAt || Date.now()).toLocaleDateString('es-AR')}
                  </span>
                </div>
                
                <div className="review-rating">
                  <div className="stars-container">
                    {renderStars(r.puntuacion || 0)}
                  </div>
                  <span className="rating-text">{r.puntuacion || 0}/5</span>
                </div>
                
                {r.comentario && (
                  <p className="review-comment">
                    {r.comentario}
                  </p>
                )}
                
                {typeof r.lugar === 'object' && r.lugar?.direccion && (
                  <div className="review-address">
                    <MapPin size={14} className="address-icon" />
                    <span className="address-text">{r.lugar.direccion}</span>
                  </div>
                )}
                
                <div className="review-actions">
                  <div className="action-buttons">
                    <button 
                      className="action-button edit-button"
                      title="Editar reseña"
                      onClick={() => console.log('Editar reseña', r._id)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="action-button delete-button"
                      title="Eliminar reseña"
                      onClick={() => console.log('Eliminar reseña', r._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <button 
                    className="view-place-button"
                    onClick={() => r.lugar?._id && (window.location.href = `/lugar/${r.lugar._id}`)}
                  >
                    Ver lugar
                    <span className="arrow-icon">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MisResenas;
