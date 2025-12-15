import React, { useState } from "react";

const Contacto = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    tipo: "consulta",
    mensaje: "",
  });
  const [estado, setEstado] = useState({ ok: false, msg: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora solo simulamos el envío y mostramos un mensaje
    setEstado({ ok: true, msg: "Gracias por escribirnos, te responderemos a la brevedad." });
    setForm({ nombre: "", email: "", tipo: "consulta", mensaje: "" });
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-hero">
          <h1 className="home-title">Contacto</h1>
          <p className="home-subtitle">
            ¿Tenés dudas, sugerencias de mejoras o querés colaborar con el proyecto? Escribinos.
          </p>
        </div>

        <div className="home-grid">
          <div className="card">
            <h2 className="card-title">Escribinos un mensaje</h2>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Nombre</label>
                <input
                  className="input"
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Motivo</label>
                <select
                  className="select"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                >
                  <option value="consulta">Consulta general</option>
                  <option value="sugerencia">Sugerencia de mejora</option>
                  <option value="nuevo-lugar">Sugerir un lugar / ciudad nueva</option>
                  <option value="colaboracion">Quiero colaborar</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Mensaje</label>
                <textarea
                  className="input"
                  name="mensaje"
                  rows={4}
                  value={form.mensaje}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Enviar mensaje
              </button>
            </form>
            {estado.msg && (
              <p className={`msg ${estado.ok ? "msg-success" : "msg-error"}`}>{estado.msg}</p>
            )}
          </div>

          <div className="card">
            <h2 className="card-title">Sobre el proyecto</h2>
            <p className="text-secondary">
              Lugares Seguros es una herramienta creada para que familias, personas autistas y
              comercios puedan compartir información sobre espacios amigables con la neurodiversidad.
            </p>
            <p className="text-secondary mt-2">
              Podés usar este formulario para:
            </p>
            <ul className="text-secondary" style={{ paddingLeft: 20, marginTop: 8 }}>
              <li>Reportar problemas con el mapa o el registro.</li>
              <li>Proponer nuevas funcionalidades.</li>
              <li>Contarnos tu experiencia usando la plataforma.</li>
              <li>Ofrecerte para colaborar (diseño, contenido, desarrollo, etc.).</li>
            </ul>
            <p className="text-muted mt-2">
              Si preferís, también podés escribirnos a{" "}
              <a href="mailto:contacto@lugaresseseguros.app">contacto@lugaresseseguros.app</a>
              {" "}indicando tu nombre y motivo de contacto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;


