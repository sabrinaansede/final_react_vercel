import React, { useState } from 'react'
import ProfessionalsList from '../components/ProfessionalsList'
import './profesionales.css'
import { useNavigate } from 'react-router-dom'

const sample = [
  { id: 1, name: 'Ps. Natalia Ojeda Barra', specialty: 'Psicóloga Clínica Integral', location: 'CABA', modality: 'Online', rating: 4.8, photo: '/public/assets/profile1.jpg', services: 'Psicoeducación, Psicoterapia, Charlas y talleres.', previsión: 'Atención particular con boleta de honorarios electrónica.' },
  { id: 2, name: 'Tamara Véjar Sandoval', specialty: 'Terapista Ocupacional', location: 'Rosario', modality: 'Presencial', rating: 4.6, photo: '/public/assets/profile2.jpg', services: 'Intervenciones sensoriales y adaptación.', previsión: 'Obra social / Particular' },
  { id: 3, name: 'Dr. Martín Pérez', specialty: 'Neuropediatra', location: 'Mendoza', modality: 'Virtual', rating: 4.9, photo: '/public/assets/profile3.jpg', services: 'Consultas diagnósticas y seguimientos.', previsión: 'Particular' },
]

const Profesionales = () => {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  const handleView = (prof) => {
    setSelected(prof)
  }

  return (
    <section className="profesionales-section">
      <header className="profesionales-header">
        <button className="prof-back" onClick={() => navigate('/')} aria-label="Volver al inicio">← Volver</button>
        <h2>Red de Profesionales</h2>
        <p>Encuentra especialistas en TEA y disciplinas afines.</p>
      </header>

      <ProfessionalsList professionals={sample} onView={handleView} />

      {selected && (
        <div className="prof-modal-overlay" onClick={() => setSelected(null)}>
          <div className="prof-modal" onClick={(e) => e.stopPropagation()}>
            <div className="prof-modal-header">
              <button className="prof-modal-close" onClick={() => setSelected(null)}>✕</button>
              <div className="prof-avatar" style={{ width: 92, height: 92, margin: '0 auto', backgroundImage: `url(${selected.photo})` }} />
              <h3 style={{ marginTop: 12 }}>{selected.name}</h3>
              <div style={{ color: '#4b5563' }}>{selected.specialty}</div>
            </div>
            <div className="prof-modal-body">
              <p className="prof-modal-text">{selected.services}</p>
              <div className="prof-modal-info-grid">
                <div className="prof-modal-info-box">
                  <p>Ubicación</p>
                  <p>{selected.location}</p>
                </div>
                <div className="prof-modal-info-box">
                  <p>Modalidad</p>
                  <p>{selected.modality}</p>
                </div>
              </div>

              <div className="prof-modal-contact">
                <a href={`mailto:consulta@ejemplo.com`}>✉️ Enviar mensaje</a>
                <a href="#">📞 Ver horarios</a>
              </div>

              <div className="prof-modal-actions">
                <button className="prof-btn-primary">Solicitar turno</button>
                <button className="prof-btn-secondary" onClick={() => setSelected(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Profesionales
