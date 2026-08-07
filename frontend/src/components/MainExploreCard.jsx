import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Shield, Users } from 'lucide-react';

const MainExploreCard = ({ title = 'Explorar lugares', subtitle, buttonText = 'Abrir mapa' }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-[#43A1F2] to-[#2E7BB8] rounded-2xl p-4 lg:p-4 mb-4 lg:mb-5 shadow-lg relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-5%] w-[300px] h-[300px] bg-white/10 rounded-full"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[200px] h-[200px] bg-white/5 rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col gap-2 lg:gap-3 items-center">
          {/* Icono principal */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/20 rounded-2xl flex items-center justify-center relative backdrop-blur-sm border border-white/30">
              <MapPin className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" size={24} lg:size={28} />
              <Navigation className="text-white absolute bottom-3 right-3 animate-pulse" size={16} lg:size={20} />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 text-white text-center">
            <div className="inline-block bg-white/20 px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-full text-[10px] lg:text-xs font-bold uppercase tracking-wider text-white/90 mb-1 lg:mb-2">
              Mapa de Lugares Seguros
            </div>
            <h2 className="text-base lg:text-lg font-bold mb-1 lg:mb-2 text-white leading-tight">
              Descubrí espacios preparados para vos
            </h2>
            
            <button 
              className="bg-white text-[#43A1F2] px-4 py-2.5 lg:px-5 lg:py-2.5 rounded-xl text-sm lg:text-sm font-semibold border-none cursor-pointer inline-flex items-center shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all w-full justify-center"
              onClick={() => navigate('/mapa')}
            >
              <Navigation size={16} lg:size={16} className="mr-2" />
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainExploreCard;
