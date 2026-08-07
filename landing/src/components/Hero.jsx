import { Download } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/assets/autismo.jpg"
          alt="Fondo AutiSi"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white">
            <span className="text-teal">Tu calma,</span>
            <br />
            <span className="text-primary">a tu manera.</span>
          </h1>

          <p className="text-lg text-white/90 mb-8 max-w-lg leading-relaxed">
            AutiSi te ayuda a encontrar espacios sensor-friendly para personas
            con autismo y sus familias. Explorá, preparate y disfrutá con tranquilidad.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href="#descargar-app"
              className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Download size={18} />
              Descargar App
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
