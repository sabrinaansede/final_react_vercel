import SECTION_IMAGE from '../assets/mision_emocional.png'

const MisionEmocional = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-teal-light/20 to-white relative overflow-hidden">
      {/* Decorative background lights */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-light/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Inspiring Message (taking 6 cols) */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <span className="text-teal font-extrabold text-sm tracking-widest uppercase mb-3 block">
              NUESTRO PROPÓSITO
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-navy mb-6 leading-tight">
              Por un mundo donde cada salida sea un <span className="text-primary">reencuentro con la calma</span>.
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-teal rounded-full mx-auto lg:mx-0 mb-8" />
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              En AutiSi entendemos que cada salida en familia requiere planificación, empatía y el espacio adecuado. No es solo cuestión de accesibilidad, sino de pertenencia.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed font-semibold italic text-teal/80">
              "Nuestra misión es construir puentes hacia entornos seguros y amigables, donde las personas con autismo y sus seres queridos puedan disfrutar con total tranquilidad."
            </p>
          </div>

          {/* Right Column: High-Quality Image (taking 6 cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* Artistic background blur frame */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-teal/10 rounded-[2.5rem] blur-2xl opacity-90 pointer-events-none" />
              
              {/* Frame borders */}
              <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-[2rem] transform rotate-2 pointer-events-none scale-105" />
              
              <img
                src={SECTION_IMAGE}
                alt="Familia compartiendo un momento de calma y conexión con AutiSi"
                className="relative z-10 w-full rounded-[2rem] shadow-2xl border-4 border-white object-cover aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default MisionEmocional
