import { useState } from 'react'
import {
  MapPin,
  Video,
  Building2,
  Star,
  X,
  Clock,
  Mail,
  Phone,
  Brain,
  HeartHandshake,
  Stethoscope,
  GraduationCap,
} from 'lucide-react'

const specialtyIcons = {
  'Psicología TEA': Brain,
  'Terapia Ocupacional': HeartHandshake,
  'Neurología Infantil': Stethoscope,
  'Psicopedagogía': GraduationCap,
}

const professionals = [
  {
    id: 1,
    name: 'Dra. Laura Méndez',
    specialty: 'Psicología TEA',
    location: 'Palermo, CABA',
    modality: 'Presencial y virtual',
    modalityType: 'both',
    rating: 4.9,
    reviews: 128,
    initials: 'LM',
    color: 'bg-primary/15 text-primary',
    description:
      'Psicóloga especializada en intervención temprana y acompañamiento familiar en el espectro autista. Trabajo con enfoque basado en evidencia y respeto por las diferencias neurológicas.',
    experience: '12 años de experiencia clínica',
    schedule: 'Lunes a viernes · 9:00 a 18:00',
    email: 'l.mendez@autisi.com',
    phone: '+54 11 4567-8901',
  },
  {
    id: 2,
    name: 'Lic. Martín Ríos',
    specialty: 'Terapia Ocupacional',
    location: 'Belgrano, CABA',
    modality: 'Presencial',
    modalityType: 'in-person',
    rating: 4.8,
    reviews: 94,
    initials: 'MR',
    color: 'bg-turquoise/15 text-turquoise',
    description:
      'Terapeuta ocupacional con foco en integración sensorial, habilidades de vida diaria y adaptación de entornos para niñas, niños y adolescentes neurodivergentes.',
    experience: '8 años de experiencia',
    schedule: 'Martes a sábado · 10:00 a 19:00',
    email: 'm.rios@autisi.com',
    phone: '+54 11 4567-8902',
  },
  {
    id: 3,
    name: 'Dra. Carolina Vega',
    specialty: 'Neurología Infantil',
    location: 'Recoleta, CABA',
    modality: 'Virtual',
    modalityType: 'virtual',
    rating: 5.0,
    reviews: 76,
    initials: 'CV',
    color: 'bg-orange/15 text-orange',
    description:
      'Neuróloga infantil con experiencia en diagnóstico diferencial, seguimiento del desarrollo y coordinación con equipos interdisciplinarios de salud.',
    experience: '15 años de experiencia',
    schedule: 'Lunes a jueves · 14:00 a 20:00',
    email: 'c.vega@autisi.com',
    phone: '+54 11 4567-8903',
  },
]

const ModalityBadge = ({ modality, type }) => {
  const Icon = type === 'virtual' ? Video : type === 'in-person' ? Building2 : MapPin
  return (
    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
      <Icon size={14} className="text-turquoise shrink-0" />
      {modality}
    </span>
  )
}

const ProfessionalCard = ({ professional, onViewProfile }) => {
  const SpecialtyIcon = specialtyIcons[professional.specialty] || Brain

  return (
    <article className="bg-card rounded-3xl p-6 shadow-sm border border-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="flex flex-col items-center text-center mb-5">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-extrabold mb-4 ${professional.color}`}
        >
          {professional.initials}
        </div>
        <h3 className="text-lg font-extrabold text-navy">{professional.name}</h3>
        <div className="flex items-center gap-1.5 mt-1 text-sm text-primary font-semibold">
          <SpecialtyIcon size={16} />
          {professional.specialty}
        </div>
      </div>

      <div className="space-y-2 mb-5 flex-grow">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <MapPin size={15} className="text-turquoise shrink-0" />
          {professional.location}
        </div>
        <ModalityBadge modality={professional.modality} type={professional.modalityType} />
        <div className="flex items-center gap-1.5 pt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(professional.rating) ? 'text-orange fill-orange' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-navy">{professional.rating}</span>
          <span className="text-xs text-text-muted">({professional.reviews})</span>
        </div>
      </div>

      <button
        onClick={() => onViewProfile(professional)}
        className="w-full bg-primary text-white py-3 rounded-full font-bold text-sm hover:bg-primary-dark transition-colors"
      >
        Ver perfil
      </button>
    </article>
  )
}

const ProfileModal = ({ professional, onClose }) => {
  if (!professional) return null

  const SpecialtyIcon = specialtyIcons[professional.specialty] || Brain

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-card px-6 pt-8 pb-6 rounded-t-3xl text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted hover:text-navy transition-colors"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center text-3xl font-extrabold mx-auto mb-4 ${professional.color}`}
          >
            {professional.initials}
          </div>
          <h2 className="text-2xl font-extrabold text-navy">{professional.name}</h2>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-primary font-semibold">
            <SpecialtyIcon size={18} />
            {professional.specialty}
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Star size={16} className="text-orange fill-orange" />
            <span className="font-bold text-navy">{professional.rating}</span>
            <span className="text-sm text-text-muted">· {professional.reviews} reseñas</span>
          </div>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div>
            <h4 className="text-sm font-extrabold text-navy mb-2">Sobre el profesional</h4>
            <p className="text-sm text-text-muted leading-relaxed">{professional.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-card rounded-2xl p-4">
              <p className="text-xs font-extrabold text-turquoise mb-1">Experiencia</p>
              <p className="text-sm text-text-muted">{professional.experience}</p>
            </div>
            <div className="bg-card rounded-2xl p-4">
              <p className="text-xs font-extrabold text-turquoise mb-1">Horarios</p>
              <p className="text-sm text-text-muted flex items-start gap-1.5">
                <Clock size={14} className="shrink-0 mt-0.5 text-turquoise" />
                {professional.schedule}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-navy mb-2">Contacto</h4>
            <div className="space-y-2">
              <a
                href={`mailto:${professional.email}`}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
              >
                <Mail size={15} className="text-primary" />
                {professional.email}
              </a>
              <a
                href={`tel:${professional.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
              >
                <Phone size={15} className="text-primary" />
                {professional.phone}
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button className="flex-1 bg-primary text-white py-3 rounded-full font-bold text-sm hover:bg-primary-dark transition-colors">
              Solicitar turno
            </button>
            <button
              onClick={onClose}
              className="flex-1 border-2 border-orange text-orange py-3 rounded-full font-bold text-sm hover:bg-orange/5 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Profesionales = () => {
  const [selected, setSelected] = useState(null)

  return (
    <section id="profesionales" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-turquoise/15 text-turquoise text-xs font-extrabold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Red de Profesionales
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            Especialistas en <span className="text-primary">TEA</span> cerca tuyo
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">
            Accedé a una red de profesionales certificados en Trastorno del Espectro Autista
            y disciplinas relacionadas. Encontrá el acompañamiento que necesitás con confianza.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {professionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              onViewProfile={setSelected}
            />
          ))}
        </div>

        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3.5 rounded-full font-bold hover:bg-primary hover:text-white transition-all"
          >
            Ver todos los profesionales
          </a>
          <p className="text-xs text-text-muted mt-3">
            Filtrá por especialidad, ubicación y modalidad de atención
          </p>
        </div>
      </div>

      <ProfileModal professional={selected} onClose={() => setSelected(null)} />
    </section>
  )
}

export default Profesionales
