import React from 'react'
import { CheckCircle, Star, MapPin, ArrowRight, Video, Building2 } from 'lucide-react'

const ProfessionalCard = ({ professional, onView }) => {
  const { _id, nombre, apellido, especialidad, ubicacion, modalidad, foto, descripcion, calificacion } = professional

  return (
    <article className="professional-card" onClick={() => onView(professional)}>
      <div className="professional-card-top">
        <div className="professional-avatar">
          {foto ? (
            <img src={foto} alt={`${nombre} ${apellido}`} />
          ) : (
            <span>{nombre?.[0]}</span>
          )}
        </div>
        <div className="professional-verified"><CheckCircle size={15} /> Verificado</div>
        <div className="professional-rating"><Star size={15} fill="currentColor" /> {calificacion?.toFixed(1) || '4.8'}</div>
      </div>
      <div className="professional-card-body">
        <div className="professional-name-row"><div><h3>{nombre} {apellido}</h3><p>{especialidad}</p></div></div>
        <div className="professional-meta"><span><MapPin size={15} /> {ubicacion || 'Cerca tuyo'}</span><span>·</span><span>{calificacion?.toFixed(1) || '4.8'} valoración</span></div>
        <div className="professional-tags"><span>Autismo</span><span>Infancia</span><span>Adolescentes</span></div>
        <div className="professional-mode">
          {modalidad !== 'virtual' && <span><Building2 size={14} /> Presencial</span>}
          {modalidad !== 'presencial' && <span><Video size={14} /> Virtual</span>}
        </div>
        <button
          className="professional-view-btn"
          onClick={(e) => {
            e.stopPropagation()
            onView(professional)
          }}
        >
          Ver perfil <ArrowRight size={17} />
        </button>
      </div>
    </article>
  )
}

export default ProfessionalCard
