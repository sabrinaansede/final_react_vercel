import { useState } from 'react'
import { Menu, X, Download } from 'lucide-react'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '#que-es', label: '¿Qué es?' },
    { href: '#blog', label: 'Blog' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contacto', label: 'Contacto' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="#" className="flex-shrink-0 flex items-center gap-3">
            <img src="/assets/logo.png" alt="AutiSi" className="h-14 w-auto" />
            <span className="hidden sm:block text-xs text-gray-500 leading-tight">
              Tu calma,<br />a tu manera
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-teal transition-colors font-semibold"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#descargar-app"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
            >
              <Download size={16} />
              Descargar App
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-600 hover:text-teal p-2"
            aria-label="Menú"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden py-4 space-y-3 border-t border-gray-100">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-teal font-semibold py-1"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#descargar-app"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold"
            >
              <Download size={16} />
              Descargar App
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
