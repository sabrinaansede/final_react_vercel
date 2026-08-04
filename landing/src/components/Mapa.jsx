const Mapa = () => {
  return (
    <section id="mapa" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src="/assets/mapa.png" 
              alt="Mapa de espacios inclusivos" 
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
            />
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Explorá espacios <span className="text-primary">inclusivos</span> con AutiSi
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Descubre lugares amigables y adaptados para personas con autismo en toda la ciudad. 
              Nuestro mapa te ayuda a encontrar espacios seguros, tranquilos y comprensivos donde 
              te sentirás cómodo.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <p className="text-gray-700">Lugares sensor-friendly</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <p className="text-gray-700">Espacios con personal capacitado</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <p className="text-gray-700">Ambientes tranquilos y seguros</p>
              </div>
            </div>

            <a
              href="#descargar"
              className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-300 hover:shadow-lg"
            >
              Ver Mapa Completo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Mapa
