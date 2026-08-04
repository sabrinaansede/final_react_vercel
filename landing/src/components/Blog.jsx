const Blog = () => {
  const features = [
    {
      title: 'Confianza y Resolución de Problemas',
      description: 'Desarrollo de habilidades para enfrentar desafíos con seguridad.',
      image: '/assets/confianza_resolucion.jpg'
    },
    {
      title: 'Una Misión que Inspira',
      description: 'Transformando vidas a través de la comprensión y el apoyo.',
      image: '/assets/digital.webp'
    },
    {
      title: 'Futuro Inclusivo',
      description: 'Construyendo un mundo donde todos puedan participar plenamente.',
      image: '/assets/futuro_inclusivo.jpg'
    },
    {
      title: 'Aprendizaje Práctico',
      description: 'Experiencias reales y hands-on para el desarrollo integral.',
      image: '/assets/aprendizaje_practico.jpg'
    }
  ]

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            Nuestro Impacto
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Historias y experiencias que transforman vidas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {features.slice(0, 2).map((feature, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-sky/50 to-teal/30">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/90">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="aspect-[16/9] bg-gradient-to-br from-sky/50 to-teal/30">
              <img
                src={features[2].image}
                alt={features[2].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl font-bold text-white mb-3">{features[2].title}</h3>
              <p className="text-white/90 text-lg">{features[2].description}</p>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="aspect-square bg-gradient-to-br from-primary/50 to-teal/30">
              <img
                src={features[3].image}
                alt={features[3].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-bold text-white mb-2">{features[3].title}</h3>
              <p className="text-white/90 text-sm">{features[3].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Blog
