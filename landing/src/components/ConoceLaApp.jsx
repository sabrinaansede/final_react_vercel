const screens = [
  {
    num: 1,
    title: 'Inicio',
    content: (
      <div className="p-3 h-full bg-gradient-to-b from-sky to-white">
        <div className="text-xs font-bold text-teal mb-2">¿Cómo te sentís hoy?</div>
        <div className="grid grid-cols-3 gap-1 mb-3">
          {['😊', '😐', '😔'].map((e) => (
            <div key={e} className="bg-white rounded-lg p-1.5 text-center text-lg shadow-sm">{e}</div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-2 shadow-sm mb-2">
          <div className="text-[8px] font-bold text-gray-500 mb-1">RUTINA DE HOY</div>
          {['Desayuno', 'Terapia', 'Paseo'].map((t) => (
            <div key={t} className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-teal" />
              <span className="text-[7px] text-gray-600">{t}</span>
            </div>
          ))}
        </div>
        <div className="bg-primary/10 rounded-xl p-2">
          <div className="text-[7px] font-bold text-primary">Tip del día</div>
          <div className="text-[6px] text-gray-500">Respirá profundo 3 veces</div>
        </div>
      </div>
    ),
  },
  {
    num: 2,
    title: 'Mapa',
    content: (
      <div className="h-full relative">
        <img src="/assets/mapa.png" alt="Mapa" className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 right-2 bg-white/90 rounded-lg px-2 py-1 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="text-[7px] text-gray-400">Buscar lugares...</span>
        </div>
      </div>
    ),
  },
  {
    num: 3,
    title: 'Detalle del lugar',
    content: (
      <div className="p-3 h-full bg-white">
        <div className="bg-teal-light rounded-xl h-16 mb-2 flex items-center justify-center">
          <span className="text-2xl">☕</span>
        </div>
        <div className="text-[9px] font-extrabold text-navy mb-1">Cafetería Armonía</div>
        <div className="flex gap-1 mb-2">
          {['🔇', '💡', '♿'].map((i) => (
            <span key={i} className="text-[8px] bg-sky rounded px-1">{i}</span>
          ))}
        </div>
        <div className="text-[6px] text-gray-500 leading-relaxed">
          Espacio tranquilo con luz tenue y personal capacitado.
        </div>
        <div className="mt-2 bg-primary text-white text-[7px] font-bold rounded-full py-1 text-center">
          Cómo llegar
        </div>
      </div>
    ),
  },
  {
    num: 4,
    title: 'Preparación',
    content: (
      <div className="p-3 h-full bg-gradient-to-b from-sky/50 to-white">
        <div className="text-[9px] font-extrabold text-navy mb-2">Preparate para salir</div>
        {['Auriculares', 'Agua', 'Tarjeta de identificación', 'Objeto de confort'].map((item, i) => (
          <div key={item} className="flex items-center gap-2 mb-1.5 bg-white rounded-lg p-1.5 shadow-sm">
            <div className={`w-3 h-3 rounded border-2 ${i < 2 ? 'bg-teal border-teal' : 'border-gray-300'}`} />
            <span className="text-[7px] text-gray-600">{item}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: 5,
    title: 'Comunidad',
    content: (
      <div className="p-3 h-full bg-gray-50">
        <div className="text-[9px] font-extrabold text-navy mb-2">Comunidad</div>
        {[
          { user: 'María', text: 'Encontramos un parque increíble 🌳' },
          { user: 'Carlos', text: '¿Alguien conoce cafeterías tranquilas?' },
        ].map((post) => (
          <div key={post.user} className="bg-white rounded-xl p-2 mb-2 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-4 h-4 rounded-full bg-primary/20" />
              <span className="text-[7px] font-bold text-navy">{post.user}</span>
            </div>
            <div className="text-[6px] text-gray-500">{post.text}</div>
          </div>
        ))}
      </div>
    ),
  },
]

const ConoceLaApp = () => {
  return (
    <section id="conoce-la-app" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">
            Conocé la app
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {screens.map((screen) => (
            <div key={screen.num} className="flex flex-col items-center">
              <div className="relative border-[6px] border-gray-800 bg-gray-800 rounded-[1.5rem] w-[130px] sm:w-[150px] shadow-xl">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-gray-800 rounded-full z-10" />
                <div className="rounded-[1.1rem] overflow-hidden aspect-[9/17] bg-white">
                  {screen.content}
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs font-extrabold text-teal">{screen.num}.</span>
                <span className="text-xs font-bold text-navy ml-1">{screen.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ConoceLaApp
