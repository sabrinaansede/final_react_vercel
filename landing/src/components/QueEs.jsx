import { Heart, Map, Users, Award } from 'lucide-react'

const QueEs = () => {
  const features = [
    {
      icon: (
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">
          <Heart className="w-8 h-8 text-blue-500" fill="currentColor" />
        </div>
      ),
      title: 'Encontrá calma',
      description: 'Descubrí espacios tranquilos adaptados a tus necesidades sensoriales.',
    },
    {
      icon: (
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">
          <Map className="w-8 h-8 text-primary" />
        </div>
      ),
      title: 'Explorá el mapa',
      description: 'Navegá por un mapa interactivo con lugares certificados cerca tuyo.',
    },
    {
      icon: (
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">
          <Users className="w-8 h-8 text-blue-500" />
        </div>
      ),
      title: 'Comunidad',
      description: 'Conectá con otras familias y compartí experiencias en un espacio seguro.',
    },
    {
      icon: (
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">
          <Award className="w-8 h-8 text-blue-500" />
        </div>
      ),
      title: 'Lugares certificados',
      description: 'Accedé a espacios verificados con estándares de accesibilidad sensorial.',
    },
  ]

  return (
    <section id="que-es" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-extrabold text-navy mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default QueEs
