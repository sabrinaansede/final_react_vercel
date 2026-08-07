import React, { useEffect, useMemo, useState } from "react";
import { Star, MapPin, MessageSquare, Trash2, Edit } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

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
      <div className="min-h-[calc(100vh-94px)] bg-[#f9fafb] px-4 py-4 pb-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-[30px] font-bold text-[#111827] mb-2">Mis reseñas</h1>
            <p className="text-base text-[#6b7280]">Iniciá sesión para ver tus reseñas.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-94px)] bg-[#f9fafb] px-4 py-4 pb-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-[30px] font-bold text-[#111827] mb-2">Mis reseñas</h1>
          <p className="text-base text-[#6b7280]">Tus opiniones sobre los lugares visitados</p>
        </div>

        {loading && (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-[3px] border-[#e5e7eb] border-t-[#3b82f6] rounded-full animate-spin mb-4"></div>
            <p className="text-[#6b7280] mt-2">Cargando tus reseñas...</p>
          </div>
        )}

        {mensaje && (
          <div className="bg-[#fef2f2] border-l-4 border-[#ef4444] p-4 mb-6 rounded text-[#b91c1c]">
            <p>{mensaje}</p>
          </div>
        )}

        {!loading && reseñas.length === 0 && (
          <div className="bg-white rounded shadow p-8 text-center max-w-[500px] mx-auto">
            <p className="text-[#6b7280] mb-6">Aún no has dejado reseñas.</p>
            <button 
              className="bg-[#43A1F2] text-white font-medium px-4 py-2 rounded border-none cursor-pointer hover:bg-[#2E7BB8] transition-colors"
              onClick={() => window.location.href = '/mapa'}
            >
              Ver lugares para reseñar
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-4 px-2">
          {reseñas.map((r) => (
            <div key={r._id} className="bg-white rounded-xl shadow border border-[#e2e8f0] transition-all hover:shadow-lg hover:-translate-y-0.5 flex w-full p-5">
              {r.fotoUrl && (
                <div className="w-14 h-14 min-w-14 rounded overflow-hidden mr-3 border border-[#e2e8f0]">
                  <img 
                    src={r.fotoUrl} 
                    alt="foto reseña" 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              
              <div className="flex flex-col flex-grow overflow-hidden">
                <div className="flex items-center mb-1 w-full">
                  <h3 className="text-base font-semibold text-[#1e293b] mr-2 leading-[1.4] whitespace-nowrap overflow-hidden text-ellipsis">
                    {typeof r.lugar === 'object' ? (r.lugar?.nombre || 'Lugar no especificado') : 'Lugar no especificado'}
                  </h3>
                  <span className="text-xs text-[#64748b] font-normal whitespace-nowrap">
                    {new Date(r.creadoEn || r.createdAt || Date.now()).toLocaleDateString('es-AR')}
                  </span>
                </div>
                
                <div className="flex items-center my-1">
                  <div className="flex mr-1.5">
                    {renderStars(r.puntuacion || 0)}
                  </div>
                  <span className="text-sm text-[#6b7280]">{r.puntuacion || 0}/5</span>
                </div>
                
                {r.comentario && (
                  <p className="text-[15px] text-[#475569] leading-[1.5] my-2 line-clamp-3 overflow-hidden text-ellipsis">
                    {r.comentario}
                  </p>
                )}
                
                {typeof r.lugar === 'object' && r.lugar?.direccion && (
                  <div className="inline-flex items-center text-[#475569] text-sm my-2 px-3 py-2 bg-[#f8fafc] rounded w-fit leading-[1.25] border border-[#e2e8f0]">
                    <MapPin size={14} className="mr-1.5 text-[#94a3b8]" />
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">{r.lugar.direccion}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-[#f1f5f9]">
                  <div className="flex gap-2 items-center">
                    <button 
                      className="p-2 rounded border border-[#e2e8f0] bg-[#f8fafc] cursor-pointer flex items-center justify-center transition-all w-9 h-9 hover:bg-[#f3f4f6] text-[#6b7280] hover:text-[#43a1f2] hover:bg-[#eff6ff]"
                      title="Editar reseña"
                      onClick={() => console.log('Editar reseña', r._id)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="p-2 rounded border border-[#e2e8f0] bg-[#f8fafc] cursor-pointer flex items-center justify-center transition-all w-9 h-9 hover:bg-[#f3f4f6] text-[#6b7280] hover:text-[#dc2626] hover:bg-[#fef2f2]"
                      title="Eliminar reseña"
                      onClick={() => console.log('Eliminar reseña', r._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <button 
                    className="inline-flex items-center bg-transparent border-none text-[#43a1f2] text-xs font-medium cursor-pointer px-2 py-1 rounded transition-all hover:bg-[#eff6ff]"
                    onClick={() => r.lugar?._id && (window.location.href = `/lugar/${r.lugar._id}`)}
                  >
                    Ver lugar
                    <span className="ml-1 font-bold">→</span>
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
