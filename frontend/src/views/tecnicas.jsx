import React, { useState } from "react";

const initialTecnicas = [
  {
    id: "respiracion",
    titulo: "Respiración 4-7-8",
    desc: "Inhalá 4s, retené 7s, exhalá 8s para reducir ansiedad.",
    img: "https:",
    tags: ["respiración", "calma"],
    steps: [
      "Encontrá un lugar cómodo y apoyá la espalda.",
      "Inhalá por la nariz contando 4.",
      "Retené el aire contando 7.",
      "Exhalá suave por la boca contando 8.",
      "Repetí 4 ciclos.",
    ],
    source: "https://undraw.co/illustrations",
  },
  {
    id: "presion-profunda",
    titulo: "Presión profunda",
    desc: "Usá mantas pesadas o un chaleco para aportar contención.",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
    tags: ["sensorial", "propiocepción"],
    steps: [
      "Elegí una manta pesada adecuada (10% del peso aprox).",
      "Cubrí hombros y tronco de forma uniforme.",
      "Mantené 10–15 minutos observando confort.",
      "Retirá si hay incomodidad o calor.",
    ],
    source: "https://storyset.com/",
  },
  {
    id: "ruido-blanco",
    titulo: "Ruido blanco",
    desc: "Auriculares con ruido blanco o sonidos suaves.",
    img: "https://images.unsplash.com/photo-1518441902110-9f89f7e83cd0?q=80&w=1200&auto=format&fit=crop",
    tags: ["auditivo", "calma"],
    steps: [
      "Colocá auriculares cómodos.",
      "Elegí ruido blanco/lluvia/olas a volumen bajo.",
      "Probá 5–10 minutos y ajustá si es necesario.",
    ],
    source: "https://www.freepik.com/vectors/illustrations",
  },
  {
    id: "rincon-calmo",
    titulo: "Rincón calmo",
    desc: "Espacio con luz tenue, texturas suaves y pocos estímulos.",
    img: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop",
    tags: ["ambiente", "regulación"],
    steps: [
      "Elegí un rincón lejos de ruidos y paso.",
      "Sumá almohadones y manta suave.",
      "Iluminación cálida y tenue.",
      "Guardá allí juguetes sensoriales favoritos.",
    ],
    source: "https://undraw.co/illustrations",
  },
  {
    id: "juguetes-sensoriales",
    titulo: "Juguetes sensoriales",
    desc: "Pelotas antiestrés, fidget spinners o masas táctiles.",
    img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1200&auto=format&fit=crop",
    tags: ["táctil", "sensorial"],
    steps: [
      "Seleccioná 2–3 juguetes preferidos.",
      "Usalos 3–5 minutos para descargar tensión.",
      "Guardalos en una caja accesible.",
    ],
    source: "https://storyset.com/",
  },
  {
    id: "rutinas-visuales",
    titulo: "Rutinas visuales",
    desc: "Secuencias con pictogramas para anticipar actividades.",
    img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
    tags: ["visual", "estructura"],
    steps: [
      "Elegí 3–5 actividades del día.",
      "Representalas con pictogramas o dibujos.",
      "Mostrá el orden e id marcando las realizadas.",
    ],
    source: "https://www.freepik.com/vectors/illustrations",
  },
];

const Tecnicas = () => {
  const [tecnicas] = useState(initialTecnicas);
  const [favs, setFavs] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("fav_tecnicas") || "[]"));
    } catch {
      return new Set();
    }
  });
  const [openTec, setOpenTec] = useState(null);

  const toggleFav = (id) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("fav_tecnicas", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const openGuide = (t) => setOpenTec(t);
  const closeGuide = () => setOpenTec(null);

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-hero" style={{ marginBottom: 32 }}>
          <h1 className="home-title">Técnicas de autorregulación</h1>
          <p className="home-subtitle">
            Un espacio seguro para encontrar ideas simples y visuales que ayuden a regular el cuerpo y las emociones.
          </p>
        </div>

        <div className="pinterest-section">
          <div className="pinterest-grid">
            {tecnicas.map((t) => (
              <div key={t.id} className="coach-card">
                <div className="coach-card-header">
                  <div className="coach-card-main">
                    <div className="coach-card-icon">🧠</div>
                    <div>
                      <div className="coach-card-title">{t.titulo}</div>
                      <div className="coach-card-tags">
                        {(t.tags || []).map((tag) => (
                          <span key={tag} className="coach-card-tag">
                            #{tag}
                          </span>
                        ))}
                        <span className="coach-card-tag">#bienestar</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="coach-card-fav"
                    aria-label="Favorito"
                    onClick={() => toggleFav(t.id)}
                  >
                    <svg
                      className="heart"
                      viewBox="0 0 24 24"
                      fill={favs.has(t.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 21s-6.716-4.297-9.428-7.009C.86 12.28.5 10.5 1.343 9.172 2.186 7.844 3.9 7 5.657 7c1.2 0 2.357.39 3.292 1.11L12 11l3.051-2.89C15.986 7.39 17.143 7 18.343 7c1.757 0 3.47.844 4.314 2.172.843 1.328.482 3.108-1.229 4.819C18.716 16.703 12 21 12 21z" />
                    </svg>
                  </button>
                </div>
                <div className="coach-card-body">{t.desc}</div>
                <div className="coach-card-footer">
                  <button
                    type="button"
                    className="coach-card-button"
                    onClick={() => openGuide(t)}
                  >
                    Ver guía paso a paso
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {openTec && (
          <div className="modal-backdrop" onClick={closeGuide}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">{openTec.titulo}</div>
                <button className="modal-close" onClick={closeGuide}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <img className="modal-img" src={openTec.img} alt={openTec.titulo} />
                <div>
                  <p
                    className="pin-desc"
                    style={{ display: "block", color: "#475569", margin: "0 0 10px" }}
                  >
                    {openTec.desc}
                  </p>
                  <div className="pin-tags" style={{ marginBottom: 10 }}>
                    {(openTec.tags || []).map((tag) => (
                      <span key={tag} className="pin-tag pin-teal">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="modal-section-title">Pasos</h4>
                  <ol className="steps">
                    {(openTec.steps || []).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                  {openTec.source && (
                    <div>
                      <a
                        className="source-link"
                        href={openTec.source}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Fuente / Ilustración
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tecnicas;


