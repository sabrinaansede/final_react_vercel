import React from 'react'
import ProfessionalCard from './ProfessionalCard'
import './ProfessionalsList.css'

const ProfessionalsList = ({ professionals = [], onView }) => {
  return (
    <div className="profesionales-container">
      <div className="profesionales-grid">
        {professionals.map((p) => (
          <ProfessionalCard key={p.id} professional={p} onView={onView} />
        ))}
      </div>
    </div>
  )
}

export default ProfessionalsList
