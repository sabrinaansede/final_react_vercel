import { useState } from 'react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: '¿AutiSi es gratuita?',
      answer: 'AutiSi ofrece una versión gratuita con funciones básicas. También tenemos una versión premium con características adicionales y soporte personalizado.'
    },
    {
      question: '¿En qué dispositivos está disponible?',
      answer: 'Actualmente AutiSi está disponible para iOS y Android. Planeamos expandir a otras plataformas en el futuro.'
    },
    {
      question: '¿Necesito diagnóstico para usar la app?',
      answer: 'No, AutiSi está diseñada para cualquier persona que busque herramientas para gestionar su bienestar emocional y sensorial.'
    },
    {
      question: '¿Mis datos están seguros?',
      answer: 'Sí, tomamos la privacidad muy seriamente. Todos tus datos están encriptados y nunca compartimos información personal con terceros sin tu consentimiento.'
    },
    {
      question: '¿Puedo usarla offline?',
      answer: 'Muchas funciones de AutiSi funcionan sin conexión a internet. Solo necesitas conexión para sincronizar datos y acceder a la comunidad.'
    },
    {
      question: '¿Hay soporte técnico?',
      answer: 'Sí, ofrecemos soporte por email y chat. Los usuarios premium tienen acceso a soporte prioritario.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-navy mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Todo lo que necesitás saber sobre AutiSi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-base font-bold text-navy pr-4">
                  {faq.question}
                </span>
                <span className="text-primary text-2xl font-light flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
