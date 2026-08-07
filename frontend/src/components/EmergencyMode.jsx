import React, { useState } from 'react';
import { Phone, MapPin, Share2, Heart, X, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmergencyMode = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  if (!isOpen) return null;

  const handleContact = () => {
    setSelectedOption('contact');
  };

  const handleSafePlace = () => {
    navigate('/mapa');
    onClose();
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const message = `🚨 Necesito ayuda. Mi ubicación: ${mapUrl}`;
          
          if (navigator.share) {
            navigator.share({
              title: 'Ubicación de emergencia',
              text: message,
            });
          } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
          }
        },
        (error) => {
          alert('No se pudo obtener la ubicación. Por favor, verifica los permisos de ubicación.');
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  };

  const handleCalmTechniques = () => {
    navigate('/tecnicas');
    onClose();
  };

  const emergencyOptions = [
    {
      id: 'contact',
      icon: Phone,
      title: 'Contactar a alguien',
      description: 'Llamar a familiares, tutores o profesionales de confianza',
      color: 'bg-red-50 border-red-200 hover:bg-red-100',
      iconColor: 'text-red-500',
      onClick: handleContact,
    },
    {
      id: 'safe-place',
      icon: MapPin,
      title: 'Ir a un lugar seguro',
      description: 'Ver lugares seguros cercanos en el mapa',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-500',
      onClick: handleSafePlace,
    },
    {
      id: 'share-location',
      icon: Share2,
      title: 'Compartir ubicación',
      description: 'Enviar tu ubicación a contactos de emergencia',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-500',
      onClick: handleShareLocation,
    },
    {
      id: 'calm-techniques',
      icon: Heart,
      title: 'Técnicas de calma',
      description: 'Ejercicios de respiración y herramientas de regulación',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      iconColor: 'text-purple-500',
      onClick: handleCalmTechniques,
    },
  ];

  if (selectedOption === 'contact') {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Contactos de emergencia</h2>
            <button
              onClick={() => setSelectedOption(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Mamá</h3>
                  <p className="text-sm text-gray-600">11-1234-5678</p>
                </div>
                <a
                  href="tel:1112345678"
                  className="p-3 bg-[#43A1F2] text-white rounded-full hover:bg-[#2E7BB8] transition-colors"
                >
                  <Phone size={20} />
                </a>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Papá</h3>
                  <p className="text-sm text-gray-600">11-2345-6789</p>
                </div>
                <a
                  href="tel:1123456789"
                  className="p-3 bg-[#43A1F2] text-white rounded-full hover:bg-[#2E7BB8] transition-colors"
                >
                  <Phone size={20} />
                </a>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Dra. Martínez</h3>
                  <p className="text-sm text-gray-600">11-3456-7890</p>
                </div>
                <a
                  href="tel:1134567890"
                  className="p-3 bg-[#43A1F2] text-white rounded-full hover:bg-[#2E7BB8] transition-colors"
                >
                  <Phone size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setSelectedOption(null)}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4" onClick={onClose}>
      <div className="bg-white rounded-[24px] max-w-[90%] w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button 
          className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-slate-600 cursor-pointer z-[10001] bg-white/80 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        
        {/* Encabezado */}
        <div className="p-4 md:p-6 text-center border-b border-slate-200">
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="p-3 md:p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-full">
              <AlertTriangle size={32} className="text-white md:size-40" />
            </div>
          </div>
          <h2 className="text-2xl md:text-[38px] font-bold text-slate-800 mb-2">Modo de Emergencia</h2>
          <p className="text-sm md:text-[18px] text-slate-600">Seleccioná una opción para recibir ayuda rápidamente.</p>
        </div>
        
        {/* Opciones de emergencia */}
        <div className="p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {emergencyOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={option.onClick}
                  className="w-full h-auto min-h-[100px] md:h-[130px] bg-white rounded-xl border-2 border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 flex items-center px-4 md:px-6 py-4 md:py-0 hover:border-[#43A1F2]"
                >
                  <div className={`p-3 md:p-4 rounded-xl ${option.iconColor} bg-white shadow-sm flex-shrink-0`}>
                    <Icon size={24} className="md:hidden" />
                    <Icon size={32} className="hidden md:block" />
                  </div>
                  <div className="flex-1 ml-3 md:ml-4 text-left">
                    <h3 className="text-base md:text-xl font-bold text-slate-800 mb-1">{option.title}</h3>
                    <p className="text-xs md:text-base text-slate-600">{option.description}</p>
                  </div>
                  <div className="p-2 md:p-3 bg-slate-100 rounded-full ml-2 flex-shrink-0">
                    <ChevronRight size={20} className="text-slate-600 md:hidden" />
                    <ChevronRight size={24} className="hidden md:block text-slate-600" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón cancelar */}
        <div className="p-4 md:p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-3 md:py-4 bg-white border-2 border-red-500 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors text-base md:text-lg"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMode;
