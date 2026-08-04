import { Heart } from 'lucide-react'
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <img src="/assets/logo.png" alt="AutiSi" className="h-12 w-auto mb-3 brightness-0 invert" />
            <p className="text-sm text-white/70 leading-relaxed">
              Tu calma, a tu manera. Una app diseñada para la comunidad neurodivergente.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold mb-4 text-sm uppercase tracking-wide text-white/90">Navegación</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#que-es" className="hover:text-white transition-colors">¿Qué es?</a></li>
              <li><a href="#conoce-la-app" className="hover:text-white transition-colors">Funciones</a></li>
              <li><a href="#descargar-app" className="hover:text-white transition-colors">Descargar</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold mb-4 text-sm uppercase tracking-wide text-white/90">Soporte</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold mb-4 text-sm uppercase tracking-wide text-white/90">Seguinos</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="TikTok">
                <FaTiktok size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="YouTube">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © 2026 AutiSi. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-xs text-white/70">
            <Heart size={14} className="text-pink-400" fill="currentColor" />
            Hecho con amor para una sociedad más empática
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
