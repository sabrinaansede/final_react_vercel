import React from 'react'
import './ProfessionalCard.css'

const ProfessionalCard = ({ professional, onView }) => {
  const { id, name, specialty, location, modality, rating, photo, services, previsión } = professional

  return (
    <article className="prof-card" onClick={() => onView(professional)}>
      <div className="prof-card-top">
        <div className="prof-avatar" style={{ backgroundImage: `url(${photo})` }}>
          {!photo && name?.[0]}
        </div>
        <h3 className="prof-name">{name}</h3>
        <div className="prof-specialty">{specialty}</div>
      </div>

      <div className="prof-meta">
        <div className="prof-meta-row">
          <span style={{ display: 'inline-flex', gap: 8 }}>
            <span className="prof-badge" style={{ background: 'var(--color-brand)', color: '#fff', padding: '6px 10px', borderRadius: 12 }}>Profesional</span>
            <span className="prof-badge" style={{ background: '#eef7f6', color: 'var(--color-teal)', padding: '6px 10px', borderRadius: 12 }}>{modality}</span>
          </span>
        </div>

        <div className="prof-meta-row">
          <div style={{ color: '#4b5563', fontSize: 14 }}>{location}</div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="prof-modal-text">{services || 'Servicios no especificados.'}</div>
        </div>
      </div>

      <div className="prof-modal-actions">
        <button
          className="prof-btn badge-like"
          onClick={(e) => {
            e.stopPropagation()
            alert('Solicitar turno - implementar acción')
          }}
        >
          Solicitar turno
        </button>
        <button
          className="prof-btn badge-like"
          onClick={(e) => {
            e.stopPropagation()
            onView(professional)
          }}
        >
          Toca para ver más
        </button>
      </div>
    </article>
  )
}

export default ProfessionalCard
