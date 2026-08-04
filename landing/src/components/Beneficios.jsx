import { Volume2, Sun, Accessibility, Award, Heart, Users } from 'lucide-react'

const Beneficios = () => {
  const sensoryItems = [
    { icon: Volume2, label: 'Ruido', color: 'bg-blue-100 text-blue-500' },
    { icon: Sun, label: 'Iluminación', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Accessibility, label: 'Accesibilidad', color: 'bg-green-100 text-green-600' },
    { icon: Award, label: 'Certificación', color: 'bg-orange-100 text-orange-500' },
  ]

  const floatingIcons = [
    { icon: Volume2, color: 'bg-blue-100 text-blue-500', pos: 'top-8 left-8' },
    { icon: Heart, color: 'bg-pink-100 text-pink-500', pos: 'top-4 right-12' },
    { icon: Users, color: 'bg-teal-light text-teal', pos: 'bottom-20 left-4' },
    { icon: Award, color: 'bg-yellow-100 text-yellow-600', pos: 'bottom-12 right-8' },
  ]

  return (
    <section id="beneficios" className="py-20 bg-sky/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-6 leading-tight">
              Diseñado para cada
              <br />
              <span className="text-teal">forma de sentir.</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed max-w-md">
              Cada persona experimenta el mundo de manera única. AutiSi se adapta
              a tus preferencias sensoriales para que encuentres espacios donde
              realmente te sientas cómodo.
            </p>

            <div id="funciones" className="grid grid-cols-2 gap-4 max-w-sm">
              {sensoryItems.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-100"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="font-bold text-sm text-navy">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: illustration */}
          <div className="relative flex justify-center">
            <div className="relative w-72 h-80 sm:w-80 sm:h-96">
              {/* Background circle */}
              <div className="absolute inset-4 bg-gradient-to-br from-teal-light to-sky rounded-full opacity-60" />

              {/* Person illustration (SVG) */}
              <svg viewBox="0 0 200 240" className="relative z-10 w-full h-full">
                <ellipse cx="100" cy="220" rx="50" ry="8" fill="#000" opacity="0.06" />
                {/* Body */}
                <ellipse cx="100" cy="130" rx="45" ry="55" fill="#5BB5E8" />
                {/* Head */}
                <circle cx="100" cy="75" r="35" fill="#F5CBA0" />
                {/* Hair */}
                <path d="M68 70 Q65 45 100 42 Q135 45 132 70 Q130 55 100 52 Q70 55 68 70" fill="#4A3728" />
                {/* Closed eyes (calm) */}
                <path d="M82 72 Q88 76 94 72" stroke="#4A3728" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M106 72 Q112 76 118 72" stroke="#4A3728" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Smile */}
                <path d="M88 88 Q100 96 112 88" stroke="#4A3728" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Hand on heart */}
                <ellipse cx="88" cy="125" rx="12" ry="8" fill="#F5CBA0" transform="rotate(-20 88 125)" />
                <path d="M88 118 Q92 110 96 118 Q100 110 104 118 Q108 110 112 118 Q112 128 100 135 Q88 128 88 118" fill="#E74C3C" opacity="0.7" />
                {/* Arms */}
                <ellipse cx="58" cy="140" rx="10" ry="18" fill="#5BB5E8" transform="rotate(20 58 140)" />
                <ellipse cx="142" cy="140" rx="10" ry="18" fill="#5BB5E8" transform="rotate(-20 142 140)" />
                {/* Legs */}
                <rect x="82" y="175" width="16" height="40" rx="8" fill="#2E6B9E" />
                <rect x="102" y="175" width="16" height="40" rx="8" fill="#2E6B9E" />
                {/* Connection lines */}
                <path d="M40 60 Q60 80 80 90" stroke="#43A1F2" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="4 4" />
                <path d="M160 50 Q140 70 120 85" stroke="#43A1F2" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="4 4" />
                <path d="M30 160 Q60 150 75 135" stroke="#1A8A7D" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="4 4" />
                <path d="M170 170 Q140 155 125 140" stroke="#1A8A7D" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="4 4" />
              </svg>

              {/* Floating icons around illustration */}
              {floatingIcons.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={i}
                    className={`absolute ${item.pos} w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${item.color} animate-float`}
                    style={{ animationDelay: `${i * 0.5}s` }}
                  >
                    <Icon size={18} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Wave to white */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12">
          <path fill="#ffffff" d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  )
}

export default Beneficios
