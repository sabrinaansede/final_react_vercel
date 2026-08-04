import express from "express";
import Usuario from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { obtenerEstadisticas } from "../controllers/usuario.controller.js";
import Agenda from "../models/agenda.model.js";

const router = express.Router();

// Ruta de registro
router.post("/register", async (req, res) => {
  if (req.method === 'GET') {
    return res.status(405).json({ message: 'Método no permitido. Use POST para registrarse.' });
  }
  const { nombre, email, password, telefono, tipoUsuario } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email y password son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      telefono,
      tipoUsuario,
    });
    await nuevoUsuario.save();

    const { _id, nombre: nombreGuardado, telefono: telGuardado, tipoUsuario: tipoGuardado } = nuevoUsuario;
    const payload = { id: _id.toString(), email, tipoUsuario: tipoGuardado };
    const secret = process.env.JWT_SECRET || "dev_secret_autisi";
    const token = jwt.sign(payload, secret, { expiresIn: "8h" });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        _id,
        nombre: nombreGuardado,
        email,
        telefono: telGuardado,
        tipoUsuario: tipoGuardado,
      },
      token,
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Error de validación',
        errors 
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'El correo electrónico ya está en uso' 
      });
    }

    res.status(500).json({ 
      message: 'Error al registrar usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email y password son obligatorios" });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }
    const { _id, nombre, telefono, tipoUsuario } = usuario;
    const payload = { id: _id.toString(), email, tipoUsuario };
    const secret = process.env.JWT_SECRET || "dev_secret_autisi";
    const token = jwt.sign(payload, secret, { expiresIn: "8h" });

    res.json({
      message: "Login exitoso",
      user: { _id, nombre, email, telefono, tipoUsuario },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

// Ruta para obtener estadísticas del usuario
router.get('/:id/estadisticas', obtenerEstadisticas);

// Rutas de Agenda integradas en UsuarioRouter
router.get('/agenda/usuario/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const eventos = await Agenda.find({ usuario: usuarioId })
      .populate("usuario", "nombre email")
      .sort({ fecha: 1, hora: 1 });
    res.json({ data: eventos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/agenda', async (req, res) => {
  try {
    const { usuario, nombre, profesional, fecha, hora, lugar, notas, recordatorio } = req.body || {};
    if (!usuario || !nombre || !fecha || !hora) {
      return res.status(400).json({ error: "Faltan campos obligatorios (usuario, nombre, fecha, hora)" });
    }
    const nuevoEvento = new Agenda({
      usuario,
      nombre,
      profesional: profesional || "",
      fecha,
      hora,
      lugar: lugar || "",
      notas: notas || "",
      recordatorio: recordatorio || false
    });
    await nuevoEvento.save();
    res.status(201).json({ message: "Evento creado", data: nuevoEvento });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/agenda', async (req, res) => {
  try {
    const eventos = await Agenda.find()
      .populate("usuario", "nombre email")
      .sort({ fecha: 1, hora: 1 });
    res.json({ data: eventos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/agenda/:id', async (req, res) => {
  try {
    const evento = await Agenda.findById(req.params.id)
      .populate("usuario", "nombre email");
    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });
    res.json({ data: evento });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/agenda/:id', async (req, res) => {
  try {
    const evento = await Agenda.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });
    res.json({ message: "Evento actualizado", data: evento });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/agenda/:id', async (req, res) => {
  try {
    const evento = await Agenda.findByIdAndDelete(req.params.id);
    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });
    res.json({ message: "Evento eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
