const DiseñadoPara = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          
          <div className="lg:col-span-2 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-teal/20 rounded-[2.5rem] blur-xl opacity-80 pointer-events-none" />
            <img
              src="/assets/chica_autismo.jpg"
              alt="Niña con autismo"
              className="relative w-full rounded-2xl shadow-lg object-cover aspect-[3/4]"
            />
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-5xl sm:text-6xl font-bold text-navy mb-8 leading-tight">
              Un mundo pensado para cada
              <br />
              <span className="text-primary">forma de sentir y vivir.</span>
            </h2>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-12 max-w-2xl">
              AutiSi entiende que cada persona percibe el entorno de manera diferente. 
              Trabajamos para crear espacios donde todos puedan sentirse seguros, 
              comprendidos y acompañados en cada experiencia.
            </p>

            <a
              href="#"
              className="inline-block px-8 py-4 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Descubrir lugares seguros
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}

export default DiseñadoPara
