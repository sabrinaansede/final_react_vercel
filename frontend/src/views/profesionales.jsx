import React, { useState, useEffect } from 'react'
import ProfessionalsList from '../components/ProfessionalsList'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bell, Shield, Search, Filter, Star, CheckCircle, Clock, Heart, Users, MapPin, Mail, Phone } from 'lucide-react'

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
            <h1 className="text-4xl font-extrabold text-[#1b2a4a] mb-3">Profesionales</h1>
            <p className="text-gray-600 text-lg max-w-2xl">Encuentra profesionales especializados en acompañamiento para personas con TEA y sus familias, verificados por nuestra comunidad.</p>
          </div>

          {/* Sector derecho - Tarjeta de verificación y perfil */}
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

            {/* Icono de notificaciones y perfil */}
            <div className="flex items-center gap-3 w-full justify-start lg:justify-end">
              <button className="bg-white border border-gray-200 rounded-full p-2.5 hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-[#43A1F2] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.nombre?.[0] || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.nombre || 'Usuario'}</span>
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, especialidad o palabras clave..."
                className="w-full pl-16 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43A1F2] focus:border-transparent"
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
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-lg font-bold text-[#1b2a4a] mb-4">Explorar por especialidad</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { icon: '🧠', name: 'Psicología', count: 12 },
            { icon: '🎯', name: 'Terapia Ocupacional', count: 8 },
            { icon: '🗣️', name: 'Fonoaudiología', count: 6 },
            { icon: '🏃', name: 'Psicomotricidad', count: 4 },
            { icon: '📚', name: 'Psicopedagogía', count: 5 },
            { icon: '👶', name: 'Neuropediatría', count: 3 }
          ].map((especialidad, index) => (
            <button
              key={index}
              className="flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-4 hover:border-[#43A1F2] hover:shadow-md transition-all min-w-[180px]"
              onClick={() => setFilters({...filters, especialidad: especialidad.name})}
            >
              <div className="text-3xl mb-2">{especialidad.icon}</div>
              <div className="font-semibold text-[#1b2a4a] text-sm">{especialidad.name}</div>
              <div className="text-xs text-gray-500 mt-1">{especialidad.count} profesionales</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sección de profesionales destacados */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-lg font-bold text-[#1b2a4a] mb-4">Profesionales destacados</h2>
        <ProfessionalsList professionals={profesionales} onView={handleView} />
      </div>

      {/* Sección de Beneficios Premium */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-lg font-bold text-[#1b2a4a] mb-4">Beneficios Premium</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: <CheckCircle className="w-5 h-5" />, title: 'Perfiles Verificados', desc: 'Profesionales evaluados por la comunidad' },
            { icon: <Clock className="w-5 h-5" />, title: 'Turnos Más Rápidos', desc: 'Acceso prioritario a agendamiento' },
            { icon: <Users className="w-5 h-5" />, title: 'Especialistas en TEA', desc: 'Expertos en Trastorno del Espectro Autista' },
            { icon: <Star className="w-5 h-5" />, title: 'Recomendados', desc: 'Top rated por familias como tú' }
          ].map((beneficio, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-2.5 hover:shadow-md transition-shadow">
              <div className="bg-blue-50 w-9 h-9 rounded-lg flex items-center justify-center text-[#43A1F2] mb-1.5">
                {beneficio.icon}
              </div>
              <h3 className="font-bold text-[#1b2a4a] mb-0.5 text-sm">{beneficio.title}</h3>
              <p className="text-xs text-gray-600 leading-4">{beneficio.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-[rgba(27,42,74,0.5)] backdrop-blur-sm flex items-center justify-center p-4 z-[1000]" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Encabezado del modal con imagen */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-3xl overflow-hidden">
              {selected.foto ? (
                <img src={selected.foto} alt={`${selected.nombre} ${selected.apellido}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-[rgba(67,161,242,0.12)] flex items-center justify-center text-[#43A1F2] font-bold text-3xl">
                    {selected.nombre?.[0]}
                  </div>
                </div>
              )}
              
              <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-md" onClick={() => setSelected(null)}>
                ✕
              </button>

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-md">
                <CheckCircle className="w-4 h-4 text-[#43A1F2]" />
                <span className="text-xs font-semibold text-[#43A1F2]">Verificado</span>
              </div>
            </div>

            {/* Información del profesional */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
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
              <div className="grid grid-cols-2 gap-3 mb-4">
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
              <div className="mb-4">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-sm text-gray-600 mb-2 no-underline hover:text-[#43A1F2] transition-colors">
                  <Mail className="w-4 h-4" />
                  Enviar mensaje
                </a>
                <a href={`tel:${selected.telefono}`} className="flex items-center gap-2 text-sm text-gray-600 no-underline hover:text-[#43A1F2] transition-colors">
                  <Phone className="w-4 h-4" />
                  {selected.telefono}
                </a>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#43A1F2] text-white font-bold py-3 rounded-xl cursor-pointer hover:bg-[#2e7bb8] transition-colors shadow-md">
                  Solicitar turno
                </button>
                <button className="w-full border-2 border-[#43A1F2] text-[#43A1F2] font-bold py-3 rounded-xl cursor-pointer hover:bg-[#43A1F2] hover:text-white transition-colors">
                  Más información
                </button>
                <button className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => setSelected(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Profesionales
