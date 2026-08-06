import React from 'react'
import ProfessionalCard from './ProfessionalCard'

const ProfessionalsList = ({ professionals = [], onView }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {professionals.slice(0, 4).map((p) => (
        <ProfessionalCard key={p._id || p.id} professional={p} onView={onView} />
      ))}
    </div>
  )
}

export default ProfessionalsList
