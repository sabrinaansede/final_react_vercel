import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoginForm from "./LoginForm.jsx";

const API_URL = import.meta.env.VITE_API_URL || "https://autisi-backend.onrender.com";

const AuthLanding = ({ initialTab = "login" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, enterGuestMode } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab);

  // Estados Registro
  const [regForm, setRegForm] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    tipoUsuario: "padre",
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regMsg, setRegMsg] = useState("");

  const onRegChange = (e) => {
    const { name, value } = e.target;
    setRegForm((p) => ({ ...p, [name]: value }));
  };

  const submitRegistro = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegMsg("");
    try {
      console.log('Enviando solicitud de registro a:', `${API_URL}/api/usuarios/register`);
      console.log('Datos del formulario:', regForm);
      
      const res = await axios({
        method: 'post',
        url: `${API_URL}/api/usuarios/register`,
        data: regForm,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Respuesta del servidor:', res);
      
      if (res.status === 201) {
        setRegMsg("Cuenta creada. Ingresando...");
        // Auto-login con las mismas credenciales usando el contexto
        try {
          const { data } = await axios.post(`${API_URL}/api/usuarios/login`, {
            email: regForm.email,
            password: regForm.password,
          });
          login(data.user, data.token);
          const redirectTo = location.state?.from?.pathname || "/";
          setTimeout(() => navigate(redirectTo, { replace: true }), 500);
        } catch (loginErr) {
          console.error('Error en auto-login:', loginErr);
          setRegMsg("Cuenta creada, pero hubo un error al iniciar sesión automáticamente. Por favor inicia sesión manualmente.");
        }
      }
    } catch (err) {
      console.error('Error en el registro:', err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Error al crear cuenta. Por favor intenta de nuevo.";
      setRegMsg(errorMessage);
    } finally {
      setRegLoading(false);
    }
  };

  const handleGuestAccess = () => {
    enterGuestMode();
    navigate("/", { replace: true });
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-hero">
          <h1 className="home-title">Bienvenid@ a Lugares Seguros</h1>
        </div>

        <div className="home-tabs">
          <div className="home-tabs-inner">
            <button
              className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Iniciar sesión
            </button>
            <button
              className={`tab-btn ${activeTab === "registro" ? "active" : ""}`}
              onClick={() => setActiveTab("registro")}
            >
              Crear cuenta
            </button>
          </div>
        </div>

        <div className="home-grid">
          <div className="card" style={{ opacity: activeTab === "login" ? 1 : 0.6 }}>
            <h2 className="card-title">Ingresá a tu cuenta</h2>
            <LoginForm />
          </div>

          <div className="card" style={{ opacity: activeTab === "registro" ? 1 : 0.6 }}>
            <h2 className="card-title">Creá tu cuenta</h2>
            <form onSubmit={submitRegistro} className="form">
              <div className="form-group">
                <label className="label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={regForm.nombre}
                  onChange={onRegChange}
                  required
                  className="input"
                />
              </div>
              <div className="form-group">
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={regForm.email}
                  onChange={onRegChange}
                  required
                  className="input"
                />
              </div>
              <div
                className="form-group"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
              >
                <div className="form-group">
                  <label className="label">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={regForm.password}
                    onChange={onRegChange}
                    required
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={regForm.telefono}
                    onChange={onRegChange}
                    className="input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Tipo de usuario</label>
                <select
                  name="tipoUsuario"
                  value={regForm.tipoUsuario}
                  onChange={onRegChange}
                  className="select"
                >
                  <option value="padre">Padre</option>
                  <option value="persona">Persona</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <button type="submit" disabled={regLoading} className="w-full bg-[#43A1F2] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#2E7BB8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {regLoading ? "Creando..." : "Crear cuenta"}
              </button>
            </form>
            {regMsg && (
              <p
                className={`msg ${
                  regMsg.includes("cuenta") || regMsg.includes("Ingresando")
                    ? "msg-success"
                    : "msg-error"
                }`}
              >
                {regMsg}
              </p>
            )}
          </div>
        </div>

        <div className="card" style={{ marginTop: 16, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
          <h3 className="card-title" style={{ textAlign: "center", marginBottom: 16 }}>Funciones disponibles sin cuenta</h3>
          <div className="grid gap-3">
            <button type="button" onClick={() => { handleGuestAccess(); setTimeout(() => navigate('/centro-informacion'), 100); }} className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-[#43A1F2] hover:bg-[#f8fbff] transition-colors">
              <div className="font-semibold text-[#1b2a4a]">📚 Centro de Información</div>
              <div className="text-sm text-gray-600 mt-1">Artículos y recursos sobre autismo</div>
            </button>
            <button type="button" onClick={() => { handleGuestAccess(); setTimeout(() => navigate('/mapa'), 100); }} className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-[#43A1F2] hover:bg-[#f8fbff] transition-colors">
              <div className="font-semibold text-[#1b2a4a]">🗺️ Mapa de Lugares</div>
              <div className="text-sm text-gray-600 mt-1">Espacios adaptados y accesibles</div>
            </button>
            <button type="button" onClick={() => { handleGuestAccess(); setTimeout(() => navigate('/tecnicas'), 100); }} className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-[#43A1F2] hover:bg-[#f8fbff] transition-colors">
              <div className="font-semibold text-[#1b2a4a]">🎯 Técnicas y Recursos</div>
              <div className="text-sm text-gray-600 mt-1">Herramientas de apoyo sensorial</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;


