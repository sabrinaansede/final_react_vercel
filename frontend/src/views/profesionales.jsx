import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Search, Star, CheckCircle, Users, MapPin, Mail, Phone, Brain, MessageSquare, ArrowRight, SlidersHorizontal, GraduationCap, HandHeart, Calendar, Filter, Map, ChevronDown, X, Mic, Activity, Move, Stethoscope } from 'lucide-react'
import './profesionales.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://autisi-backend.onrender.com'

const normalizeString = (value) => {
  if (!value) return ''
  return value.toString().trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

const Profesionales = () => {
  const [profesionales, setProfesionales] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ especialidad: '', ubicacion: '', modalidad: '', rangoPrecio: '', disponibilidad: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 100])
  const navigate = useNavigate()

  const visibleProfesionales = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return profesionales.filter((prof) => {
      const matchesEspecialidad = !filters.especialidad || normalizeString(prof.especialidad) === normalizeString(filters.especialidad)
      const matchesUbicacion = !filters.ubicacion || normalizeString(prof.ubicacion) === normalizeString(filters.ubicacion)
      const matchesModalidad = !filters.modalidad || normalizeString(prof.modalidad) === normalizeString(filters.modalidad)
      if (!matchesEspecialidad || !matchesUbicacion || !matchesModalidad) return false

      if (!search) return true

      const nombreApellido = `${prof.nombre || ''} ${prof.apellido || ''}`.toLowerCase()
      const especialidad = (prof.especialidad || '').toLowerCase()
      const ubicacion = (prof.ubicacion || '').toLowerCase()
      const descripcion = (prof.descripcion || '').toLowerCase()
      const modalidad = (prof.modalidad || '').toLowerCase()
      const modalidadAliases = [modalidad]
      if (modalidad === 'virtual') modalidadAliases.push('online')
      if (modalidad === 'ambas') modalidadAliases.push('mixta', 'ambas')

      const matchesModalidadSearch = modalidadAliases.some((term) => term.includes(search) || search.includes(term))

      return (
        nombreApellido.includes(search) ||
        especialidad.includes(search) ||
        ubicacion.includes(search) ||
        descripcion.includes(search) ||
        matchesModalidadSearch
      )
    })
  }, [profesionales, filters, searchTerm])

  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        const queryParams = new URLSearchParams()
        if (filters.especialidad) queryParams.append('especialidad', filters.especialidad)
        if (filters.ubicacion) queryParams.append('ubicacion', filters.ubicacion)
        if (filters.modalidad) queryParams.append('modalidad', filters.modalidad)

        const url = `${API_URL}/api/profesionales${queryParams.toString() ? `?${queryParams}` : ''}`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
        const data = await res.json()
        const profesionalesCargados = Array.isArray(data) ? data : data.data || []

        const psicologos = profesionalesCargados.filter((prof) => prof.especialidad === 'Psicología')
        const psicomotricos = profesionalesCargados.filter((prof) => prof.especialidad === 'Psicomotricidad')
        const psicopedagogos = profesionalesCargados.filter((prof) => prof.especialidad === 'Psicopedagogía')
        const terapeutas = profesionalesCargados.filter((prof) => prof.especialidad === 'Terapia Ocupacional')
        const neuropediatras = profesionalesCargados.filter((prof) => prof.especialidad === 'Neuropediatría')

        const matchesModalidadFilter = (modalidad) => {
          if (!filters.modalidad) return true
          if (filters.modalidad === 'ambas') return modalidad === 'ambas'
          return modalidad === filters.modalidad || modalidad === 'ambas'
        }

        const filterExtrasByModalidad = (extras) => {
          return filters.modalidad ? extras.filter((extra) => matchesModalidadFilter(extra.modalidad)) : extras
        }

        const profesionExtra = {
          _id: 'psicologia-adicional-01',
          nombre: 'Mariana',
          apellido: 'Ríos',
          especialidad: 'Psicología',
          ubicacion: 'CABA',
          modalidad: 'virtual',
          foto: '',
          descripcion: 'Psicóloga especializada en acompañamiento familiar y atención individual para personas con TEA.',
          experiencia: '8 años de experiencia en terapias y estrategias de inclusión.',
          horarios: 'Lun a Vie 10:00 - 18:00',
          email: 'mariana.rios@autisi.com',
          telefono: '+54 11 5566 7788',
          calificacion: 4.9,
          activo: true,
        }

        const psicomotricidadExtras = [
          {
            _id: 'psicomotricidad-01',
            nombre: 'Lucía',
            apellido: 'Fernández',
            especialidad: 'Psicomotricidad',
            ubicacion: 'Rosario',
            modalidad: 'presencial',
            foto: '',
            descripcion: 'Psicomotricista con enfoque en motricidad fina y estrategias de juego terapéutico.',
            experiencia: '7 años trabajando con niños y adolescentes.',
            horarios: 'Mar, Mié y Vie 09:00 - 16:00',
            email: 'lucia.fernandez@autisi.com',
            telefono: '+54 341 556 3344',
            calificacion: 4.8,
            activo: true,
          },
          {
            _id: 'psicomotricidad-02',
            nombre: 'Diego',
            apellido: 'Silva',
            especialidad: 'Psicomotricidad',
            ubicacion: 'Mendoza',
            modalidad: 'ambas',
            foto: '',
            descripcion: 'Profesional en psicomotricidad con experiencia en programas de inclusión escolar.',
            experiencia: '6 años acompañando procesos escolares y familiares.',
            horarios: 'Lun a Jue 11:00 - 19:00',
            email: 'diego.silva@autisi.com',
            telefono: '+54 261 667 8899',
            calificacion: 4.7,
            activo: true,
          },
          {
            _id: 'psicomotricidad-03',
            nombre: 'Ana',
            apellido: 'Gómez',
            especialidad: 'Psicomotricidad',
            ubicacion: 'Córdoba',
            modalidad: 'virtual',
            foto: '',
            descripcion: 'Psicomotricista especializada en estimulación temprana y coordinación motora.',
            experiencia: '5 años en apoyo a familias y educadores.',
            horarios: 'Mié y Sáb 10:00 - 14:00',
            email: 'ana.gomez@autisi.com',
            telefono: '+54 9 351 776 5544',
            calificacion: 4.6,
            activo: true,
          },
        ]

        const psicopedagogiaExtras = [
          {
            _id: 'psicopedagogia-01',
            nombre: 'Sofía',
            apellido: 'Martínez',
            especialidad: 'Psicopedagogía',
            ubicacion: 'CABA',
            modalidad: 'presencial',
            foto: '',
            descripcion: 'Psicopedagoga con enfoque en desarrollo de estrategias educativas personalizadas.',
            experiencia: '9 años trabajando con niños y adolescentes en escuelas especiales.',
            horarios: 'Lun a Vie 09:00 - 15:00',
            email: 'sofia.martinez@autisi.com',
            telefono: '+54 11 5588 9977',
            calificacion: 4.8,
            activo: true,
          },
          {
            _id: 'psicopedagogia-02',
            nombre: 'Valentina',
            apellido: 'Pérez',
            especialidad: 'Psicopedagogía',
            ubicacion: 'Rosario',
            modalidad: 'ambas',
            foto: '',
            descripcion: 'Especialista en evaluaciones psicopedagógicas y planes de intervención escolar.',
            experiencia: '7 años apoyando familias y docentes.',
            horarios: 'Mar a Jue 10:00 - 18:00',
            email: 'valentina.perez@autisi.com',
            telefono: '+54 341 559 2233',
            calificacion: 4.7,
            activo: true,
          },
          {
            _id: 'psicopedagogia-03',
            nombre: 'Camila',
            apellido: 'Lopez',
            especialidad: 'Psicopedagogía',
            ubicacion: 'Córdoba',
            modalidad: 'virtual',
            foto: '',
            descripcion: 'Psicopedagoga especializada en inclusión educativa y apoyo en habilidades de aprendizaje.',
            experiencia: '6 años en acompañamiento escolar y familiar.',
            horarios: 'Lun, Mié y Vie 11:00 - 17:00',
            email: 'camila.lopez@autisi.com',
            telefono: '+54 9 351 778 6633',
            calificacion: 4.6,
            activo: true,
          },
        ]

        const terapiaOcupacionalExtras = [
          {
            _id: 'terapiaocupacional-01',
            nombre: 'Marcos',
            apellido: 'Santos',
            especialidad: 'Terapia Ocupacional',
            ubicacion: 'CABA',
            modalidad: 'presencial',
            foto: '',
            descripcion: 'Terapeuta ocupacional con experiencia en actividades de vida diaria y autonomía.',
            experiencia: '8 años desarrollando planes personalizados en entornos educativos y familiares.',
            horarios: 'Lun a Vie 10:00 - 16:00',
            email: 'marcos.santos@autisi.com',
            telefono: '+54 11 5566 3344',
            calificacion: 4.8,
            activo: true,
          },
          {
            _id: 'terapiaocupacional-02',
            nombre: 'Carla',
            apellido: 'Paredes',
            especialidad: 'Terapia Ocupacional',
            ubicacion: 'Rosario',
            modalidad: 'ambas',
            foto: '',
            descripcion: 'Terapeuta ocupacional centrada en la mejora de habilidades sensoriales y motoras.',
            experiencia: '6 años trabajando con niños y adolescentes con TEA.',
            horarios: 'Mar a Jue 11:00 - 18:00',
            email: 'carla.paredes@autisi.com',
            telefono: '+54 341 556 8899',
            calificacion: 4.7,
            activo: true,
          },
        ]

        const neuropediatriaExtras = [
          {
            _id: 'neuropediatria-01',
            nombre: 'Martina',
            apellido: 'Ruiz',
            especialidad: 'Neuropediatría',
            ubicacion: 'CABA',
            modalidad: 'presencial',
            foto: '',
            descripcion: 'Neuropediatra con experiencia en el seguimiento de desarrollo y coordinación motora.',
            experiencia: '10 años trabajando con niños y familias en contextos clínicos y educativos.',
            horarios: 'Lun a Vie 10:00 - 16:00',
            email: 'martina.ruiz@autisi.com',
            telefono: '+54 11 5555 1122',
            calificacion: 4.9,
            activo: true,
          },
          {
            _id: 'neuropediatria-02',
            nombre: 'Gonzalo',
            apellido: 'Pérez',
            especialidad: 'Neuropediatría',
            ubicacion: 'Rosario',
            modalidad: 'ambas',
            foto: '',
            descripcion: 'Neuropediatra enfocado en diagnósticos tempranos y tratamientos interdisciplinarios.',
            experiencia: '8 años de experiencia en neuropediatría y acompañamiento escolar.',
            horarios: 'Mar a Jue 11:00 - 18:00',
            email: 'gonzalo.perez@autisi.com',
            telefono: '+54 341 556 7788',
            calificacion: 4.7,
            activo: true,
          },
          {
            _id: 'neuropediatria-03',
            nombre: 'Julieta',
            apellido: 'Silva',
            especialidad: 'Neuropediatría',
            ubicacion: 'Mendoza',
            modalidad: 'virtual',
            foto: '',
            descripcion: 'Neuropediatra con énfasis en tratamientos de integración sensorial y apoyo familiar.',
            experiencia: '7 años en neurodesarrollo infantil y terapias multidisciplinarias.',
            horarios: 'Mié y Vie 12:00 - 18:00',
            email: 'julieta.silva@autisi.com',
            telefono: '+54 261 555 3344',
            calificacion: 4.6,
            activo: true,
          },
        ]

        const profesionalesConExtras = [...profesionalesCargados]
        if ((filters.especialidad === 'Psicología' || !filters.especialidad) && psicologos.length < 2) {
          profesionalesConExtras.push(profesionExtra)
        }
        if ((filters.especialidad === 'Psicomotricidad' || !filters.especialidad) && psicomotricos.length < 3) {
          profesionalesConExtras.push(...filterExtrasByModalidad(psicomotricidadExtras).slice(0, 3 - psicomotricos.length))
        }
        if ((filters.especialidad === 'Psicopedagogía' || !filters.especialidad) && psicopedagogos.length < 3) {
          profesionalesConExtras.push(...filterExtrasByModalidad(psicopedagogiaExtras).slice(0, 3 - psicopedagogos.length))
        }
        if ((filters.especialidad === 'Terapia Ocupacional' || !filters.especialidad) && terapeutas.length < 3) {
          profesionalesConExtras.push(...filterExtrasByModalidad(terapiaOcupacionalExtras).slice(0, 3 - terapeutas.length))
        }
        if ((filters.especialidad === 'Neuropediatría' || !filters.especialidad) && neuropediatras.length < 3) {
          profesionalesConExtras.push(...filterExtrasByModalidad(neuropediatriaExtras).slice(0, 3 - neuropediatras.length))
        }

        setProfesionales(profesionalesConExtras)
      } catch (error) {
        console.error('Error al cargar profesionales:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfesionales()
  }, [filters])

  const handleView = (prof) => {
    setSelected(prof)
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 pt-4">
        <div className="text-center py-12 text-gray-600">Cargando profesionales...</div>
      </section>
    )
  }

  const specialtyFilters = ['Todos', 'Psicología', 'Fonoaudiología', 'Terapia Ocupacional', 'Psicomotricidad', 'Psicopedagogía', 'Neuropediatría']
  const quickAccessCards = [
    { icon: Brain, title: 'Psicología', description: 'Apoyo emocional y conductual', color: '#E0F2FE', iconColor: '#43A1F2' },
    { icon: Mic, title: 'Fonoaudiología', description: 'Comunicación y lenguaje', color: '#E8F5E9', iconColor: '#50C1B9' },
    { icon: Activity, title: 'Terapia Ocupacional', description: 'Desarrollo de habilidades', color: '#FEE8E2', iconColor: '#EC7054' },
    { icon: Move, title: 'Psicomotricidad', description: 'Movimiento y coordinación', color: '#FEF9E6', iconColor: '#F59E0B' },
    { icon: GraduationCap, title: 'Psicopedagogía', description: 'Aprendizaje escolar', color: '#E8F5E9', iconColor: '#50C1B9' },
    { icon: Stethoscope, title: 'Neuropediatría', description: 'Evaluación médica', color: '#E0F2FE', iconColor: '#43A1F2' },
  ]

  return (
    <section className="professionals-page-new">
      <div className="professionals-container-new">
        {/* Header */}
        <header className="professionals-header-new">
          <button className="back-button-new" onClick={() => navigate('/')}>
            <ArrowRight size={16} className="rotate-180" />
            Volver
          </button>
          <div className="header-content-new">
            <p className="header-eyebrow-new">Encontrá tu apoyo</p>
            <h1>Profesionales cerca tuyo</h1>
            <p className="header-subtitle-new">Personas que acompañan con experiencia, empatía y una mirada respetuosa de cada proceso.</p>
          </div>
          <div className="verification-badge-new">
            <Shield size={20} />
            <span>Profesionales verificados</span>
          </div>
        </header>

        {/* Search Bar */}
        <div className="search-bar-new">
          <Search size={20} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar profesional, especialidad..."
          />
          <button 
            className="filter-toggle-new"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter size={18} />
            Filtros
          </button>
        </div>

        {/* Quick Access Cards - Dashboard Style */}
        <section className="quick-access-section-new">
          <div className="section-header-new">
            <h2>Explorar por categoría</h2>
          </div>
          <div className="quick-access-grid-new">
            {quickAccessCards.map(({ icon: Icon, title, description, color, iconColor }) => (
              <button 
                key={title} 
                className="quick-access-card-new" 
                style={{ backgroundColor: color }}
                onClick={() => setFilters({ ...filters, especialidad: title })}
              >
                <div className="quick-access-icon-new" style={{ backgroundColor: iconColor }}>
                  <Icon size={24} style={{ color: '#FFFFFF' }} />
                </div>
                <div className="quick-access-content-new">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <ArrowRight size={18} className="quick-access-arrow-new" />
              </button>
            ))}
          </div>
        </section>

        {/* Main Content Area */}
        <div className="professionals-main-content-new">
          {/* Professional List */}
          <section className="professionals-list-section-new">
            <div className="list-header-new">
              <div>
                <h2>Profesionales recomendados</h2>
                <p>Elegidos por la comunidad</p>
              </div>
              <span className="available-count-new">{visibleProfesionales.length} disponibles</span>
            </div>

            {/* Professional Cards - Horizontal Mobile Style */}
            <div className="professionals-list-new">
              {visibleProfesionales.length > 0 ? (
                visibleProfesionales.map((prof) => (
                  <div key={prof._id || prof.id} className="professional-card-new">
                    <div className="professional-avatar-new">
                      {prof.foto ? (
                        <img src={prof.foto} alt={`${prof.nombre} ${prof.apellido}`} />
                      ) : (
                        <div className="avatar-placeholder-new">
                          {prof.nombre?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="professional-info-new">
                      <div className="professional-header-new">
                        <h3>{prof.nombre} {prof.apellido}</h3>
                        <div className="rating-badge-new">
                          <Star size={14} fill="#F59E0B" color="#F59E0B" />
                          <span>{prof.calificacion?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                      <p className="professional-specialty-new">{prof.especialidad}</p>
                      <p className="professional-bio-new">{prof.descripcion}</p>
                      <p className="professional-experience-new">{prof.experiencia}</p>
                      <div className="professional-meta-new">
                        <span className="meta-item-new">
                          <MapPin size={14} />
                          {prof.ubicacion}
                        </span>
                        <span className="meta-item-new">
                          {prof.modalidad === 'presencial' ? 'Presencial' : prof.modalidad === 'virtual' ? 'Virtual' : 'Mixta'}
                        </span>
                      </div>
                    </div>
                    <div className="professional-actions-new">
                      <button className="contact-button-new" onClick={() => setSelected(prof)}>
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-new">
                  <p>No encontramos profesionales con esos filtros. Probá con otra búsqueda.</p>
                </div>
              )}
            </div>
          </section>

          {/* Advanced Filters Sidebar */}
          {showAdvancedFilters && (
            <aside className="advanced-filters-sidebar-new">
              <div className="filters-header-new">
                <h3>Filtros avanzados</h3>
                <button onClick={() => setShowAdvancedFilters(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="filter-group-new">
                <label>Especialidad</label>
                <select 
                  value={filters.especialidad}
                  onChange={(e) => setFilters({ ...filters, especialidad: e.target.value })}
                >
                  <option value="">Todas</option>
                  {specialtyFilters.slice(1).map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group-new">
                <label>Ubicación</label>
                <select 
                  value={filters.ubicacion}
                  onChange={(e) => setFilters({ ...filters, ubicacion: e.target.value })}
                >
                  <option value="">Todas</option>
                  <option value="CABA">CABA</option>
                  <option value="Rosario">Rosario</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Mendoza">Mendoza</option>
                </select>
              </div>

              <div className="filter-group-new">
                <label>Modalidad</label>
                <select 
                  value={filters.modalidad}
                  onChange={(e) => setFilters({ ...filters, modalidad: e.target.value })}
                >
                  <option value="">Todas</option>
                  <option value="presencial">Presencial</option>
                  <option value="virtual">Virtual</option>
                  <option value="ambas">Mixta</option>
                </select>
              </div>

              <div className="filter-group-new">
                <label>Rango de precio</label>
                <div className="price-range-new">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  />
                  <span>${priceRange[1]}000</span>
                </div>
              </div>

              <div className="filter-group-new">
                <label>Mapa de ubicación</label>
                <div className="map-preview-new">
                  <Map size={32} />
                  <p>Ver en mapa</p>
                </div>
              </div>

              <button className="apply-filters-new" onClick={() => setShowAdvancedFilters(false)}>
                Aplicar filtros
              </button>
            </aside>
          )}
        </div>
      </div>

      {/* Professional Detail Modal */}
      {selected && (
        <div className="modal-overlay-new" onClick={() => setSelected(null)}>
          <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <div className="modal-avatar-new">
                {selected.foto ? (
                  <img src={selected.foto} alt={`${selected.nombre} ${selected.apellido}`} />
                ) : (
                  <div className="modal-avatar-placeholder-new">
                    {selected.nombre?.[0]}
                  </div>
                )}
              </div>
              <button className="modal-close-new" onClick={() => setSelected(null)}>
                <X size={20} />
              </button>
              <div className="verified-badge-modal-new">
                <CheckCircle size={16} />
                <span>Verificado</span>
              </div>
            </div>

            <div className="modal-body-new">
              <h2>{selected.nombre} {selected.apellido}</h2>
              <p className="modal-specialty-new">{selected.especialidad}</p>

              <div className="modal-info-grid-new">
                <div className="info-item-new">
                  <MapPin size={18} />
                  <div>
                    <span>Ubicación</span>
                    <p>{selected.ubicacion}</p>
                  </div>
                </div>
                <div className="info-item-new">
                  <span>Modalidad</span>
                  <p>{selected.modalidad === 'presencial' ? 'Presencial' : selected.modalidad === 'virtual' ? 'Virtual' : 'Mixta'}</p>
                </div>
              </div>

              <div className="modal-section-new">
                <h3>Sobre mí</h3>
                <p>{selected.descripcion}</p>
              </div>

              <div className="modal-section-new">
                <h3>Experiencia</h3>
                <p>{selected.experiencia}</p>
              </div>

              <div className="modal-section-new">
                <h3>Horarios</h3>
                <p>{selected.horarios}</p>
              </div>

              <div className="modal-contact-new">
                <a href={`mailto:${selected.email}`} className="contact-btn-new">
                  <Mail size={18} />
                  Enviar mensaje
                </a>
                <a href={`tel:${selected.telefono}`} className="contact-btn-new">
                  <Phone size={18} />
                  {selected.telefono}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Profesionales
