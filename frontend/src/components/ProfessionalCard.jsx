import React from 'react'
import { Heart, CheckCircle, Star, MapPin } from 'lucide-react'

const ProfessionalCard = ({ professional, onView }) => {
  const { _id, nombre, apellido, especialidad, ubicacion, modalidad, foto, descripcion, calificacion } = professional

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full" onClick={() => onView(professional)}>
      <div className="relative h-48 sm:h-40 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="w-full h-full flex items-center justify-center">
          {foto ? (
            <img src={foto} alt={`${nombre} ${apellido}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-[rgba(67,161,242,0.12)] flex items-center justify-center text-[#43A1F2] font-bold text-3xl">
              {nombre?.[0]}
            </div>
          )}
        </div>
        <button
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-md"
          onClick={(e) => {
            e.stopPropagation()
            // Implementar lógica de favoritos
          }}
        >
          <Heart size={20} className="text-gray-400 hover:text-red-500" />
        </button>

        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
          <CheckCircle size={18} className="text-[#43A1F2]" />
          <span className="text-xs font-semibold text-[#43A1F2]">Verificado</span>
        </div>
      </div>    
      <div className="p-4 sm:p-4 flex flex-col flex-1">
        <h3 className="text-lg sm:text-base font-bold text-[#1b2a4a] mb-1">{nombre} {apellido}</h3>
        <div className="text-sm sm:text-xs text-[#43A1F2] font-semibold mb-2">{especialidad}</div>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star size={18} className="text-orange-500 fill-orange-500" />
            <span className="font-bold text-orange-500">{calificacion?.toFixed(1) || 'N/A'}</span>
          </div>
          <span className="text-xs sm:text-xs text-gray-500">(24 opiniones)</span>
        </div>

        <div className="flex items-center gap-1 text-sm sm:text-xs text-gray-600 mb-2">
          <MapPin size={18} />
          <span>{ubicacion}</span>
        </div>

        <div className="mb-2">
          <span className="bg-blue-50 text-[#43A1F2] px-3 py-1 sm:px-2 sm:py-0.5 rounded-lg text-xs font-semibold">
            {modalidad === 'presencial' ? 'Atención presencial' : modalidad === 'virtual' ? 'Atención online' : 'Atención presencial y online'}
          </span>
        </div>

        <p className="text-sm sm:text-xs text-gray-600 leading-relaxed mb-3 flex-1">
          {descripcion?.substring(0, 80) || 'Descripción no especificada.'}{descripcion?.length > 80 ? '...' : ''}
        </p>

        <button
          className="w-full bg-[#43A1F2] text-white border-none px-4 py-3 sm:px-3 sm:py-2 rounded-xl font-bold text-sm sm:text-xs cursor-pointer hover:bg-[#2e7bb8] transition-colors shadow-md"
          onClick={(e) => {
            e.stopPropagation()
            onView(professional)
          }}
        >
          Ver perfil
        </button>
      </div>
    </article>
  )
}

export default ProfessionalCard
