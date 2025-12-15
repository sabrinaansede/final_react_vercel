import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// 🔥 URL correcta del backend
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://final-react-vercel.onrender.com";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const { data } = await axios.post(
        `${API_URL}/api/usuarios/login`,
        form,
        {
          withCredentials: true, // 🔥 CLAVE
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      login(data.user, data.token);
      setMensaje("Inicio de sesión exitoso");

      const redirectTo = location.state?.from?.pathname || "/";
      setTimeout(() => navigate(redirectTo, { replace: true }), 400);
    } catch (err) {
      if (err.response?.data?.message) {
        setMensaje(err.response.data.message);
      } else {
        setMensaje("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-group">
          <label className="label">Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      {mensaje && (
        <p
          className={`msg ${
            mensaje.includes("exitoso") ? "msg-success" : "msg-error"
          }`}
        >
          {mensaje}
        </p>
      )}
    </>
  );
};

export default LoginForm;
