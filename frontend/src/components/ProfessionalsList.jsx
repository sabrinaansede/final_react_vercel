import React from 'react'
import ProfessionalCard from './ProfessionalCard'

const ProfessionalsList = ({ professionals = [], onView }) => {
  return (
    <div className="professionals-grid">
      {professionals.map((p) => (
        <ProfessionalCard key={p._id || p.id} professional={p} onView={onView} />
      ))}
    </div>
  )
}

export default ProfessionalsList
