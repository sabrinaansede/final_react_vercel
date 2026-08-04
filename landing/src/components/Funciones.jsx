import { MapPin, Heart, Users, Brain } from 'lucide-react'

const Funciones = () => {
  const features = [
    {
      icon: <MapPin className="w-12 h-12 text-primary mx-auto" />,
      title: 'Mapas Sensoriales',
      description: 'Encuentra lugares tranquilos y amigables en tu entorno.'
    },
    {
      icon: <Heart className="w-12 h-12 text-primary mx-auto" />,
      title: 'Rutinas Calmantes',
      description: 'Ejercicios y actividades diseñadas para reducir la ansiedad.'
    },
    {
      icon: <Users className="w-12 h-12 text-primary mx-auto" />,
      title: 'Profesionales',
      description: 'Acceso a médicos, terapeutas y especialistas en autismo certificados.'
    },
    {
      icon: <Brain className="w-12 h-12 text-primary mx-auto" />,
      title: 'Terapias',
      description: 'Sesiones de terapia adaptadas y recursos de intervención profesional.'
    }
  ]

  return (
    <section id="funciones" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Funciones
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Todo lo que necesitas para tu bienestar en una sola aplicación.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Funciones
