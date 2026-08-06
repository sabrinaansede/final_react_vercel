import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Shield, Users } from 'lucide-react';

const MainExploreCard = ({ title = 'Explorar lugares', subtitle, buttonText = 'Abrir mapa' }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-[#43A1F2] to-[#2E7BB8] rounded-2xl p-4 mb-5 shadow-lg relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-5%] w-[300px] h-[300px] bg-white/10 rounded-full"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[200px] h-[200px] bg-white/5 rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col gap-3 items-center">
          {/* Icono principal */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center relative backdrop-blur-sm border border-white/30">
              <MapPin className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" size={28} />
              <Navigation className="text-white absolute bottom-3 right-3 animate-pulse" size={20} />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 text-white text-center">
            <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
              Mapa de Lugares Seguros
            </div>
            <h2 className="text-lg font-bold mb-2 text-white leading-tight">
              Descubrí espacios preparados para vos
            </h2>
            <p className="text-sm mb-3 text-white/85 leading-relaxed">
              Encontrá lugares accesibles, espacios certificados por APADEA y recomendaciones de la comunidad.
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-3 justify-center">
              <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1.5 rounded-lg">
                <Shield size={14} />
                <span className="text-xs font-medium">Certificados APADEA</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1.5 rounded-lg">
                <Users size={14} />
                <span className="text-xs font-medium">Reseñas</span>
              </div>
            </div>

            <button 
              className="bg-white text-[#43A1F2] px-5 py-2.5 rounded-xl text-sm font-semibold border-none cursor-pointer inline-flex items-center shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all w-full justify-center"
              onClick={() => navigate('/mapa')}
            >
              <Navigation size={16} className="mr-2" />
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainExploreCard;
