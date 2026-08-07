import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import BullrichApadea from '../assets/Bullrich_apadea.jpg';
import AbastoApadea from '../assets/abasto_apadea.jpg';
import CafePosible from '../assets/cafe_posible.jpeg';

const API_URL = import.meta.env.VITE_API_URL || 'https://autisi-backend.onrender.com';

const normalizeImageUrl = (src) => {
  if (!src) return '';
  if (typeof src === 'object' && src.default) return src.default;
  if (typeof src === 'object' && src.src) return src.src;
  if (src.startsWith('/uploads/')) return `${API_URL}${src}`;
  if (src.startsWith('uploads/')) return `${API_URL}/${src}`;
  return src;
};

const getFallbackPlaceImage = (name) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('bullrich') || lower.includes('burrlirch')) return BullrichApadea;
  if (lower.includes('abasto')) return AbastoApadea;
  if (lower.includes('cafe') && lower.includes('posible')) return CafePosible;
  if (lower.includes('apadea')) return BullrichApadea;
  return '';
};

const RecommendedList = ({ places = [] }) => {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState({});
  const [showAll, setShowAll] = useState(false);
  const fileInputs = useRef({});

  if (!places || places.length === 0) return null;

  const handleFileChange = async (placeId, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviews((s) => ({ ...s, [placeId]: url }));

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://autisi-backend.onrender.com';
      const form = new FormData();
      form.append('foto', file);
      
      const res = await fetch(`${API_URL}/api/lugares/${placeId}/foto`, {
        method: 'POST',
        body: form,
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data && data.fotoUrl) {
        setPreviews((s) => ({ ...s, [placeId]: data.fotoUrl }));
      }
    } catch (err) {
      console.error('Image upload error', err);
    }
  };

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[18px] font-bold text-[#0f172a]">Recomendados para vos</h2>
        {places.length > 3 && !showAll && (
          <button 
            className="bg-[#43A1F2] text-white border-none px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:bg-[#2E7BB8] hover:-translate-y-0.5"
            onClick={() => setShowAll(true)}
          >
            Ver todos
          </button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-x-visible lg:pb-0">
        {places.slice(0, showAll ? places.length : 3).map((p) => {
          const defaultImg = (() => {
            const name = (p.nombre || '').toLowerCase();
            if (name.includes('bullrich') || name.includes('burrlirch')) return BullrichApadea;
            if (name.includes('abasto')) return AbastoApadea;
            if (name.includes('cafe') && name.includes('posible')) return CafePosible;
            return '';
          })();

          const rawImg = previews[p._id] || p.fotoUrl || p.foto || defaultImg;
          const img = normalizeImageUrl(rawImg);
          const rating = p.rating || p.calificacion || 0;
          const distance = p.distancia || '1.2 km';
          
          const isApadea = p.certificacion === 'APADEA' || 
                         (p.nombre || '').toLowerCase().includes('abasto') || 
                         (p.nombre || '').toLowerCase().includes('patio') ||
                         (p.nombre || '').toLowerCase().includes('bullrich');
          
          return (
            <div key={p._id} className="min-w-[200px] lg:min-w-0 flex-shrink-0 lg:flex-1">
              <div
                className="flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer shadow-md border border-blue-50 transition-all hover:-translate-y-1 hover:shadow-lg group"
                onClick={() => navigate(`/lugar/${p._id}`)}
              >
                <div className="relative w-full h-[140px] lg:h-[220px] rounded-t-2xl overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center bg-slate-100 group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `url(${img})`,
                    }}
                  />
                  <div className={`absolute top-2 right-2 w-7 h-7 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold text-white ${isApadea ? 'bg-teal-400' : 'bg-[#43A1F2]'}`}>
                    <Check size={14} lg:size={18} />
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 lg:px-2 lg:py-1 rounded-lg">
                    <div className="text-[#43A1F2] text-[10px] lg:text-xs font-semibold">{p.tipo || 'Categoría'}</div>
                  </div>
                </div>
                <div className="p-3 lg:p-5 flex-1 flex flex-col">
                  <div className="font-bold text-sm lg:text-lg text-[#1b2a4a] mb-1 leading-tight">{p.nombre}</div>
                  <div className="mt-auto flex justify-between items-center text-xs lg:text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="text-sm lg:text-base">📍</span>
                      <span className="font-medium">{distance}</span>
                    </span>
                    <span className="bg-orange-50 text-orange-500 px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-lg text-xs lg:text-sm font-semibold flex items-center gap-1">
                      ⭐ {rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedList;
