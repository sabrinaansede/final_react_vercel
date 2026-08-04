import { Download, Play } from 'lucide-react'

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
            <a
              href="#conoce-la-app"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-7 py-3.5 rounded-full font-bold hover:bg-white/10 transition-all"
            >
              <Play size={18} fill="currentColor" />
              Ver cómo funciona
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#descargar-app" className="opacity-80 hover:opacity-100 transition-opacity">
              <svg className="h-10" viewBox="0 0 120 40" fill="none">
                <rect width="120" height="40" rx="8" fill="#1B2A4A" />
                <text x="48" y="16" fill="white" fontSize="8" fontFamily="Nunito">Disponible en</text>
                <text x="48" y="28" fill="white" fontSize="12" fontWeight="bold" fontFamily="Nunito">App Store</text>
                <path d="M28 12c0-2 1-3 2-3.5-.5 1.5-1.5 2.5-2.5 3 1-.5 2-1.5 2.5-3-.5 0-1.5.5-2 1.5-.5-1.5-2-2.5-3.5-2.5 2.5 0 4 1.5 4.5 3.5-2 1-3.5 3-3.5 5.5 0 1 .5 2 1 2.5 1.5-1 2.5-3 2.5-5 0-1.5-.5-2.5-1.5-3.5z" fill="white" transform="translate(8,8) scale(1.2)" />
              </svg>
            </a>
            <a href="#descargar-app" className="opacity-80 hover:opacity-100 transition-opacity">
              <svg className="h-10" viewBox="0 0 120 40" fill="none">
                <rect width="120" height="40" rx="8" fill="#1B2A4A" />
                <text x="48" y="16" fill="white" fontSize="8" fontFamily="Nunito">Disponible en</text>
                <text x="48" y="28" fill="white" fontSize="12" fontWeight="bold" fontFamily="Nunito">Google Play</text>
                <path d="M12 10 L12 30 L22 20 Z M24 18 L34 12 L34 28 L24 22 Z M36 12 L46 20 L36 28 Z" fill="#34A853" transform="translate(0,0)" />
                <path d="M12 10 L22 20 L12 30 Z" fill="#EA4335" />
                <path d="M22 20 L34 12 L24 18 Z" fill="#FBBC04" />
                <path d="M22 20 L24 22 L34 28 L34 12 Z" fill="#4285F4" transform="translate(-2,0)" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
