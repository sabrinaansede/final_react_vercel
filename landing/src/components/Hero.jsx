import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

const Hero = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installMessage, setInstallMessage] = useState('')

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
      setInstallMessage('')
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setInstallMessage('Abrí esta página en Chrome o Safari y elegí “Agregar a pantalla de inicio”.')
      return
    }

    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

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
            <button
              type="button"
              onClick={handleInstall}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
            >
              <Download size={18} />
              Instalar App
            </button>
          </div>
          {installMessage && (
            <p className="text-sm text-white/80 max-w-md">{installMessage}</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
