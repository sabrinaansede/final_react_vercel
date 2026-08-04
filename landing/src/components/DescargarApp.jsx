const DescargarApp = () => {
  return (
    <section id="descargar-app" className="py-20 bg-gray-100 relative overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 items-center max-w-7xl mx-auto">
            
            {/* Código QR - Izquierda */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:scale-105 transition-transform duration-300">
                <img
                  src="/assets/qr-code.png"
                  alt="Código QR para descargar AutiSi"
                  className="w-40 h-40 object-contain"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 font-semibold tracking-wide text-center">
                Escaneá para descargar
              </p>
            </div>

            {/* Información central */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
                Descargá la app
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Escaneá el código QR o utilizá los botones de descarga para obtener AutiSi en tu dispositivo.
              </p>
            </div>

            {/* Botones de descarga - Derecha */}
            <div className="flex flex-col gap-4 items-center md:items-start">
              <a 
                href="#" 
                className="inline-flex items-center gap-4 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg duration-300 group hover:-translate-y-0.5 w-full md:w-auto justify-center"
              >
                <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12M20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-300 font-medium uppercase tracking-wider leading-none">Disponible en</div>
                  <div className="text-base font-bold tracking-wide mt-0.5">Google Play</div>
                </div>
              </a>

              <a 
                href="#" 
                className="inline-flex items-center gap-4 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg duration-300 group hover:-translate-y-0.5 w-full md:w-auto justify-center"
              >
                <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0--2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5-1.07 1.28-1.07 1.28-1.07 1.28.73.83 1.94 1.46 2.94 1.5-.73.83-1.94 1.46-2.94 1.5-.73-.83-1.94-1.46-2.94-1.5.73-.83 1.94-1.46 2.94-1.5-.73-.83 1.94-1.46 2.94-1.5z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-300 font-medium uppercase tracking-wider leading-none">Descargar en</div>
                  <div className="text-base font-bold tracking-wide mt-0.5">App Store</div>
                </div>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default DescargarApp
