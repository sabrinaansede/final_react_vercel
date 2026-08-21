import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";
import "./AuthLanding.css";

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

  // Estados Login
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");

  const onRegChange = (e) => {
    const { name, value } = e.target;
    setRegForm((p) => ({ ...p, [name]: value }));
  };

  const onLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((p) => ({ ...p, [name]: value }));
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
          setTimeout(() => navigate('/onboarding/profile-type', { replace: true }), 500);
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

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMsg("");
    try {
      const { data } = await axios.post(`${API_URL}/api/usuarios/login`, {
        email: loginForm.email,
        password: loginForm.password,
      });
      login(data.user, data.token);
      
      // Check if user has completed onboarding
      const hasProfileType = localStorage.getItem('userProfileType');
      const redirectTo = location.state?.from?.pathname || 
                        (hasProfileType ? "/" : "/onboarding/profile-type");
      
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error('Error en login:', err);
      const errorMessage = err.response?.data?.message || 
                         "Email o contraseña incorrectos";
      setLoginMsg(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGuestAccess = () => {
    enterGuestMode();
    navigate("/", { replace: true });
  };

  return (
    <div className="auth-landing-container">
      <div className="auth-landing-wrapper">
        {/* Logo */}
        <div className="auth-logo-section">
          <img 
            src={logo} 
            alt="AutiSi Logo" 
            className="auth-logo"
          />
          <h1 className="auth-title">
            {activeTab === "registro" ? "Comenzá tu experiencia en AutiSi" : "Bienvenido de nuevo"}
          </h1>
        </div>

        {/* Card */}
        <div className="auth-card">
          {activeTab === "registro" ? (
            <form onSubmit={submitRegistro} className="auth-form">
              <div className="auth-form-group">
                <label className="auth-label">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={regForm.nombre}
                  onChange={onRegChange}
                  required
                  className="auth-input"
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={regForm.email}
                  onChange={onRegChange}
                  required
                  className="auth-input"
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={regForm.password}
                  onChange={onRegChange}
                  required
                  className="auth-input"
                />
              </div>

              <button 
                type="submit" 
                disabled={regLoading}
                className="auth-button"
              >
                {regLoading ? "Creando cuenta..." : "Crear cuenta"}
              </button>

              {regMsg && (
                <p className={`auth-message ${
                  regMsg.includes("cuenta") || regMsg.includes("Ingresando")
                    ? "success"
                    : "error"
                }`}>
                  {regMsg}
                </p>
              )}
            </form>
          ) : (
            <form onSubmit={submitLogin} className="auth-form">
              <div className="auth-form-group">
                <label className="auth-label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={onLoginChange}
                  required
                  className="auth-input"
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={onLoginChange}
                  required
                  className="auth-input"
                />
              </div>

              <button 
                type="submit" 
                disabled={loginLoading}
                className="auth-button"
              >
                {loginLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>

              {loginMsg && (
                <p className="auth-message error">
                  {loginMsg}
                </p>
              )}
            </form>
          )}

          {/* Switch between login/register */}
          <div className="auth-switch">
            <p className="auth-switch-text">
              {activeTab === "registro" ? "¿Ya tenés una cuenta?" : "¿No tenés una cuenta?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab(activeTab === "registro" ? "login" : "registro");
                setRegMsg("");
                setLoginMsg("");
              }}
              className="auth-switch-button"
            >
              {activeTab === "registro" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          </div>
        </div>

        {/* Guest access */}
        <div className="auth-guest-access">
          <button
            onClick={handleGuestAccess}
            className="auth-guest-button"
          >
            Explorar sin cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;


