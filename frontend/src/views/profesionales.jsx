import React, { useState, useEffect } from 'react'
import ProfessionalsList from '../components/ProfessionalsList'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Search, Filter, Star, CheckCircle, Clock, Heart, Users, MapPin, Mail, Phone, Brain, Target, MessageSquare, Activity, BookOpen, Baby } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://autisi-backend.onrender.com'

const Profesionales = () => {
  const { user } = useAuth()
  const [profesionales, setProfesionales] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ especialidad: '', ubicacion: '', modalidad: '' })
  const navigate = useNavigate()

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
        setProfesionales(Array.isArray(data) ? data : data.data || [])
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

  return (
    <section className="min-h-screen bg-gray-50 px-4 pt-4">
      {/* Encabezado Premium dividido en dos sectores */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
          {/* Sector izquierdo - Título y descripción */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <button className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200" onClick={() => navigate('/')}>← Volver</button>
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Premium</span>
            </div>
            <h1 className="text-[32px] lg:text-[44px] font-bold text-[#1b2a4a] mb-3 leading-[125%]">Profesionales</h1>
            <p className="text-gray-600 text-[16px] max-w-2xl leading-[150%]">Encuentra profesionales especializados en acompañamiento para personas con TEA y sus familias, verificados por nuestra comunidad.</p>
          </div>

          {/* Sector derecho - Tarjeta de verificación */}
          <div className="flex flex-col gap-4 items-start lg:items-end w-full lg:w-auto">
            {/* Tarjeta informativa de verificación */}
            <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm w-full lg:max-w-md">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-[#43A1F2]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#1b2a4a] text-sm mb-1">Profesionales Verificados</h3>
                  <p className="text-gray-600 text-xs mb-2">Todos los profesionales fueron evaluados y recomendados por la comunidad.</p>
                  <a href="#" className="text-[#43A1F2] text-xs font-semibold hover:underline">Conocer más sobre el proceso →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, especialidad o palabras clave..."
                className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
              />
            </div>

            {/* Filtros desplegables - horizontal scroll en móvil */}
            <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-wrap lg:pb-0">
              <select 
                value={filters.especialidad} 
                onChange={(e) => setFilters({...filters, especialidad: e.target.value})}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent min-w-[180px] flex-shrink-0"
              >
                <option value="">Especialidad</option>
                <option value="Psicología">Psicología</option>
                <option value="Terapia Ocupacional">Terapia Ocupacional</option>
                <option value="Fonoaudiología">Fonoaudiología</option>
                <option value="Psicomotricidad">Psicomotricidad</option>
                <option value="Psicopedagogía">Psicopedagogía</option>
                <option value="Neuropediatría">Neuropediatría</option>
              </select>
              
              <select 
                value={filters.ubicacion} 
                onChange={(e) => setFilters({...filters, ubicacion: e.target.value})}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent min-w-[180px] flex-shrink-0"
              >
                <option value="">Ubicación</option>
                <option value="CABA">CABA</option>
                <option value="Rosario">Rosario</option>
                <option value="Mendoza">Mendoza</option>
                <option value="Córdoba">Córdoba</option>
              </select>
              
              <select 
                value={filters.modalidad} 
                onChange={(e) => setFilters({...filters, modalidad: e.target.value})}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent min-w-[180px] flex-shrink-0"
              >
                <option value="">Modalidad</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="ambas">Mixta</option>
              </select>

              <button className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0">
                <Filter className="w-4 h-4" />
                Más filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Explorar por especialidad */}
      <div className="max-w-7xl mx-auto mb-8 mt-12">
        <h2 className="text-[26px] lg:text-[34px] font-bold text-[#1b2a4a] mb-4 leading-[125%]">Explorar por especialidad</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { icon: Brain, name: 'Psicología', count: 12 },
            { icon: Target, name: 'Terapia Ocupacional', count: 8 },
            { icon: MessageSquare, name: 'Fonoaudiología', count: 6 },
            { icon: Activity, name: 'Psicomotricidad', count: 4 },
            { icon: BookOpen, name: 'Psicopedagogía', count: 5 },
            { icon: Baby, name: 'Neuropediatría', count: 3 }
          ].map((especialidad, index) => {
            const Icon = especialidad.icon;
            return (
              <button
                key={index}
                className="flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-4 hover:border-[#43A1F2] hover:shadow-md transition-all min-w-[180px] flex flex-col items-center text-center"
                onClick={() => setFilters({...filters, especialidad: especialidad.name})}
              >
                <div className="mb-2 flex items-center justify-center">
                  <Icon size={32} className="text-[#43A1F2]" />
                </div>
                <div className="font-semibold text-[#1b2a4a] text-[18px] lg:text-[16px]">{especialidad.name}</div>
                <div className="text-[14px] lg:text-[13px] text-gray-500 mt-1">{especialidad.count} profesionales</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sección de profesionales destacados */}
      <div className="max-w-7xl mx-auto mb-8 mt-12">
        <h2 className="text-[26px] lg:text-[34px] font-bold text-[#1b2a4a] mb-4 leading-[125%]">Profesionales destacados</h2>
        <ProfessionalsList professionals={profesionales} onView={handleView} />
      </div>

      {selected && (
        <div className="fixed inset-0 bg-[rgba(27,42,74,0.5)] backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[1000]" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl max-w-[600px] w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Encabezado del modal con imagen */}
            <div className="relative h-44 sm:h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-3xl overflow-hidden">
              {selected.foto ? (
                <img src={selected.foto} alt={`${selected.nombre} ${selected.apellido}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-[rgba(67,161,242,0.12)] flex items-center justify-center text-[#43A1F2] font-bold text-3xl">
                    {selected.nombre?.[0]}
                  </div>
                </div>
              )}
              
              <button
                className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl font-bold text-gray-700 shadow-lg ring-1 ring-gray-200 transition hover:bg-white"
                onClick={() => setSelected(null)}
                aria-label="Cerrar perfil"
              >
                ✕
              </button>

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-md">
                <CheckCircle className="w-4 h-4 text-[#43A1F2]" />
                <span className="text-xs font-semibold text-[#43A1F2]">Verificado</span>
              </div>
            </div>

            {/* Información del profesional */}
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#1b2a4a] mb-1">{selected.nombre} {selected.apellido}</h3>
                  <div className="text-[#43A1F2] font-semibold">{selected.especialidad}</div>
                </div>
                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg">
                  <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                  <span className="font-bold text-orange-500">{selected.calificacion?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>

              {/* Información clave */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-[#43A1F2] mb-1">Ubicación</p>
                  <p className="text-sm text-gray-700 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selected.ubicacion}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-[#43A1F2] mb-1">Modalidad</p>
                  <p className="text-sm text-gray-700">
                    {selected.modalidad === 'presencial' ? 'Presencial' : selected.modalidad === 'virtual' ? 'Virtual' : 'Mixta'}
                  </p>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <h4 className="font-bold text-[#1b2a4a] mb-2">Sobre mí</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selected.descripcion}</p>
              </div>

              {/* Información adicional */}
              <div className="mb-4 text-sm text-gray-600">
                <p className="mb-2"><strong>Experiencia:</strong> {selected.experiencia}</p>
                <p><strong>Horarios:</strong> {selected.horarios}</p>
              </div>

              {/* Contacto */}
              <div className="mb-6 pb-4">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-sm text-gray-600 mb-2 no-underline hover:text-[#43A1F2] transition-colors">
                  <Mail className="w-4 h-4" />
                  Enviar mensaje
                </a>
                <a href={`tel:${selected.telefono}`} className="flex items-center gap-2 text-sm text-gray-600 no-underline hover:text-[#43A1F2] transition-colors">
                  <Phone className="w-4 h-4" />
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
