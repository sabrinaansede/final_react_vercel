import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoginForm from "./LoginForm.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AuthLanding = ({ initialTab = "login" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

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

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-hero">
          <h1 className="home-title">Bienvenid@ a Lugares Seguros</h1>
          <p className="home-subtitle">
            Iniciá sesión o creá tu cuenta para acceder al mapa y contribuir con la comunidad.
          </p>
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
          {/* Card Login */}
          <div className="card" style={{ opacity: activeTab === "login" ? 1 : 0.6 }}>
            <h2 className="card-title">Ingresá a tu cuenta</h2>
            <LoginForm />
          </div>

          {/* Card Registro */}
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
              <button type="submit" disabled={regLoading} className="btn btn-secondary">
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
      </div>
    </div>
  );
};

export default AuthLanding;


