import React, { useMemo, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';

const CONTENT = [
  {
    id: 'que-es-autismo',
    title: '¿Qué es el autismo?',
    icon: '🧠',
    intro: 'El autismo es una forma de desarrollo neurológico que influye en la forma de percibir, comunicar y relacionarse con el entorno.',
    sections: [
      {
        title: 'Idea clave',
        text: 'Cada persona autista tiene características propias. Algunas necesitan apoyo en la comunicación, otras en la regulación sensorial o en la interacción social.',
      },
      {
        title: 'Qué puede ayudar',
        list: [
          'Hablar con respeto y claridad.',
          'Respetar los ritmos y preferencias de cada persona.',
          'Brindar espacios predecibles y acompañados.',
        ],
      },
    ],
    highlight: 'El autismo no es una enfermedad, sino una forma de desarrollo distinta.',
    related: ['Cómo apoyar a una persona autista', 'Mitos y realidades'],
  },
  {
    id: 'apoyar-persona-autista',
    title: '¿Cómo apoyar a una persona autista?',
    icon: '🤝',
    intro: 'El apoyo más útil suele ser cercano, respetuoso y adaptado a las necesidades individuales.',
    sections: [
      {
        title: 'Recomendaciones prácticas',
        list: [
          'Ofrecer información concreta y sencilla.',
          'Permitir pausas o tiempos de regulación.',
          'Evitar presiones innecesarias cuando la persona está sobrecargada.',
        ],
      },
      {
        title: 'En la vida cotidiana',
        text: 'Un ambiente predecible, con rutinas claras y un lenguaje comprensible, suele ayudar mucho a sentir seguridad.',
      },
    ],
    highlight: 'Escuchar antes de interpretar facilita la conexión.',
    related: ['Familias', 'Escuelas e inclusión'],
  },
  {
    id: 'familias',
    title: 'Familias',
    icon: '👨‍👩‍👧',
    intro: 'Las familias suelen ser parte esencial del acompañamiento, y también necesitan información, contención y redes de apoyo.',
    sections: [
      {
        title: 'Qué puede ayudar',
        list: [
          'Buscar apoyo emocional y educativo.',
          'Conectar con otros familiares y profesionales.',
          'Reconocer los propios límites y necesidades.',
        ],
      },
    ],
    highlight: 'No estás solo/a: pedir ayuda es una forma de cuidado.',
    related: ['Profesionales', 'Consejos para el día a día'],
  },
  {
    id: 'escuelas-inclusion',
    title: 'Escuelas e inclusión',
    icon: '🏫',
    intro: 'La inclusión escolar mejora cuando hay adaptación, comprensión y acompañamiento activo.',
    sections: [
      {
        title: 'Para docentes y equipos',
        list: [
          'Proponer rutinas claras.',
          'Utilizar lenguaje simple y visual.',
          'Trabajar en colaboración con la familia.',
        ],
      },
    ],
    highlight: 'Las adaptaciones pequeñas pueden generar grandes cambios.',
    related: ['Derechos y recursos', 'Mitos y realidades'],
  },
  {
    id: 'profesionales',
    title: 'Profesionales',
    icon: '🧑‍⚕️',
    intro: 'Los profesionales de la salud, educación y acompañamiento pueden aportar herramientas valiosas al desarrollo de la persona.',
    sections: [
      {
        title: 'Enfoque recomendado',
        text: 'La mirada integral, la escucha activa y la colaboración interdisciplinaria fortalecen el acompañamiento.',
      },
    ],
    highlight: 'La información confiable y la actualización constante mejoran la calidad del apoyo.',
    related: ['Qué es el autismo?', 'Familias'],
  },
  {
    id: 'mitos-realidades',
    title: 'Mitos y realidades',
    icon: '🌟',
    intro: 'Muchos prejuicios sobre el autismo surgen de ideas incompletas o erróneas.',
    sections: [
      {
        title: 'Realidad',
        list: [
          'No todas las personas autistas se comportan igual.',
          'El autismo no implica falta de inteligencia.',
          'La inclusión requiere adaptación y respeto.',
        ],
      },
    ],
    highlight: 'Conocer para comprender, y comprender para incluir.',
    related: ['Qué es el autismo?', 'Escuelas e inclusión'],
  },
  {
    id: 'derechos-recursos',
    title: 'Derechos y recursos',
    icon: '⚖️',
    intro: 'El acceso a información, salud, educación y servicios es un derecho que debe promoverse en todos los espacios.',
    sections: [
      {
        title: 'Recursos útiles',
        list: [
          'Organizaciones de apoyo y defensa.',
          'Programas educativos y comunitarios.',
          'Herramientas de acompañamiento y orientación.',
        ],
      },
    ],
    highlight: 'La información también es una forma de protección y acceso.',
    related: ['Profesionales', 'Familias'],
  },
  {
    id: 'consejos-dia-dia',
    title: 'Consejos para el día a día',
    icon: '💡',
    intro: 'Pequeños cambios en la rutina y en el entorno pueden mejorar mucho la tranquilidad y el bienestar.',
    sections: [
      {
        title: 'A tener en cuenta',
        list: [
          'Mantener rutinas simples y claras.',
          'Reducir estímulos innecesarios.',
          'Acompañar con paciencia y flexibilidad.',
        ],
      },
    ],
    highlight: 'La sostenibilidad del apoyo también depende del cuidado de quien acompaña.',
    related: ['Cómo apoyar a una persona autista', 'Escuelas e inclusión'],
  },
];

const CentroInformacion = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONTENT;
    return CONTENT.filter((item) =>
      `${item.title} ${item.intro} ${item.related.join(' ')}`.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f7faff] px-4 pb-24 pt-5 sm:px-5">
      <div className="mx-auto max-w-6xl">
        {!selected ? (
          <>
            <section className="mb-4 rounded-[24px] border border-[#dfefff] bg-gradient-to-br from-[#eef7ff] to-[#f9fcff] p-5 shadow-[0_10px_24px_rgba(67,161,242,0.08)] sm:p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e7f3ff] px-3 py-1 text-[0.78rem] font-bold uppercase tracking-[0.04em] text-[#2b7fd6]">
                Centro de Información
              </div>
              <h1
                className="mb-2 font-extrabold leading-tight text-[#1b2a4a]"
                style={{ fontSize: '1.05rem' }}
              >
                Encontrá información confiable, consejos y recursos para comprender mejor el autismo.
              </h1>
              <p className="m-0 text-[0.95rem] leading-6 text-[#5b6882]">
                Esta sección educativa de AutiSi ofrece contenidos claros y accesibles para personas autistas, familias, docentes, profesionales y la comunidad.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-full border border-[#e2ebf7] bg-white px-4 py-2.5">
                <Search size={18} color="#43A1F2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar artículos por palabra clave"
                  className="flex-1 border-none bg-transparent text-[0.95rem] text-[#1f2937] outline-none placeholder:text-[#94a3b8]"
                />
              </div>
            </section>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filtered.map((item) => (
                <button key={item.id} className="cursor-pointer rounded-[18px] border border-[#e7eef7] bg-white p-4 text-left shadow-[0_6px_16px_rgba(17,24,39,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#43A1F2] hover:shadow-[0_10px_24px_rgba(67,161,242,0.12)]" type="button" onClick={() => setSelected(item)}>
                  <div className="mb-2 grid h-11 w-11 place-items-center rounded-[12px] bg-gradient-to-br from-[#e8f4ff] to-[#d8efff] text-[1.2rem]">
                    {item.icon}
                  </div>
                  <h3 className="mb-1.5 text-[1rem] font-bold text-[#1b2a4a]">{item.title}</h3>
                  <p className="m-0 text-[0.9rem] leading-6 text-[#64748b]">{item.intro}</p>
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-4 rounded-[20px] border border-dashed border-[#dbe8f7] bg-white p-7 text-center text-[#64748b]">
                No encontramos artículos para esa búsqueda. Probá con otra palabra.
              </div>
            )}
          </>
        ) : (
          <section className="overflow-hidden rounded-[24px] border border-[#e7eef7] bg-white shadow-[0_10px_24px_rgba(17,24,39,0.05)]">
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex min-h-[140px] items-end justify-between rounded-[18px] bg-[#43A1F2] p-5 text-white">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[0.78rem] font-bold uppercase tracking-[0.04em] text-white">
                    Centro de Información
                  </div>
                  <h2 className="m-0 text-[1.25rem] font-extrabold text-white sm:text-[1.35rem]">{selected.title}</h2>
                </div>
                <span className="text-[2rem]">{selected.icon}</span>
              </div>
              <div className="px-1 pb-1">
                <button className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d7ebff] bg-[#f3f8ff] px-3 py-2 text-[0.88rem] font-bold text-[#2b7fd6]" type="button" onClick={() => setSelected(null)}>
                  <ArrowLeft size={16} /> Volver
                </button>
                <p className="mb-4 text-[0.95rem] leading-7 text-[#5f6b7a]">{selected.intro}</p>
                {selected.sections.map((section) => (
                  <div key={section.title} className="mb-3">
                    <h3 className="mb-2 text-[1rem] font-extrabold text-[#1b2a4a]">{section.title}</h3>
                    {section.text && <p className="text-[0.94rem] leading-7 text-[#5b6678]">{section.text}</p>}
                    {section.list && <ul className="ml-5 list-disc space-y-2 text-[0.94rem] leading-7 text-[#5b6678]">{section.list.map((item) => <li key={item}>{item}</li>)}</ul>}
                  </div>
                ))}
                <div className="my-4 rounded-[14px] border border-[#dceeff] bg-[#f7fbff] p-3 text-[0.95rem] text-[#3b5a79]">{selected.highlight}</div>
                <div className="mt-4">
                  <h3 className="mb-2 text-[1rem] font-extrabold text-[#1b2a4a]">También te puede interesar</h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.related.map((item) => (
                      <span key={item} className="rounded-full border border-[#d7ebff] bg-[#f0f8ff] px-2.5 py-1 text-[0.8rem] font-bold text-[#2b7fd6]">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CentroInformacion;
