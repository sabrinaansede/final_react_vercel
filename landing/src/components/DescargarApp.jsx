import { useEffect, useState } from 'react';

const DescargarApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
    }
  };

  return (
    <section id="descargar-app" className="py-20 bg-gray-100 relative overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 items-center max-w-7xl mx-auto">
            
            {/* Código QR - Izquierda */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:scale-105 transition-transform duration-300">
                <img
                  src="/assets/QR.png"
                  alt="Código QR para descargar AutiSi"
                  className="w-40 h-40 object-contain"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 font-semibold tracking-wide text-center">
                Escaneá para abrir la app de AutiSi
              </p>
            </div>

            {/* Información central */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
                Descargá AutiSi
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Escaneá el código QR o utilizá las opciones de instalación para abrir la app oficial de AutiSi en tu dispositivo.
              </p>
            </div>

            {/* Botón de acción - Derecha */}
            <div className="flex flex-col gap-4 items-center md:items-start">
              <button
                type="button"
                onClick={handleInstall}
                className="inline-flex items-center gap-4 bg-[#43A1F2] text-white px-6 py-3 rounded-xl hover:bg-[#2f7fc9] transition-all shadow-md hover:shadow-lg duration-300 group hover:-translate-y-0.5 w-full md:w-auto justify-center"
              >
                <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 20h14v2H5zm7-18l6 6h-4v6h-4v-6H6z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-white/80 font-medium uppercase tracking-wider leading-none">Instalar</div>
                  <div className="text-base font-bold tracking-wide mt-0.5">AutiSi en tu dispositivo</div>
                </div>
              </button>
              {!canInstall && (
                <p className="text-sm text-gray-600 text-center md:text-left">
                  Si el navegador no muestra la opción, abrí esta página en Chrome o Safari y elegí “Agregar a pantalla de inicio”.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default DescargarApp
