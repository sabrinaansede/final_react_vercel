const NuestraMision = () => {
  return (
    <section id="nuestra-mision" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/assets/familia-feliz-caballito.jpg"
          alt="Familia disfrutando de un momento al aire libre"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/60 to-navy/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Nuestra misión
          </h2>
          
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            Salir debería ser una experiencia, no una preocupación.
          </h3>
          
          <p className="text-lg text-white/90 mb-10 leading-relaxed">
            En AutiSi trabajamos para que cada familia pueda planificar sus salidas, descubrir espacios seguros y disfrutar más momentos juntos con tranquilidad y confianza.
          </p>
          
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Conocé nuestra historia
          </a>
        </div>
      </div>
    </section>
  )
}

export default NuestraMision
