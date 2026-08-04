import Agenda from "../models/agenda.model.js";

// Crear evento de agenda
const crearEvento = async (req, res) => {
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
};

// Listar todos los eventos de agenda
const listarEventos = async (req, res) => {
  try {
    const eventos = await Agenda.find()
      .populate("usuario", "nombre email")
      .sort({ fecha: 1, hora: 1 });
    res.json({ data: eventos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener eventos de un usuario específico
const obtenerEventosUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const eventos = await Agenda.find({ usuario: usuarioId })
      .populate("usuario", "nombre email")
      .sort({ fecha: 1, hora: 1 });
    res.json({ data: eventos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener evento por ID
const obtenerEvento = async (req, res) => {
  try {
    const evento = await Agenda.findById(req.params.id)
      .populate("usuario", "nombre email");
    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });
    res.json({ data: evento });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar evento
const actualizarEvento = async (req, res) => {
  try {
    const evento = await Agenda.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });
    res.json({ message: "Evento actualizado", data: evento });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar evento
const eliminarEvento = async (req, res) => {
  try {
    const evento = await Agenda.findByIdAndDelete(req.params.id);
    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });
    res.json({ message: "Evento eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { crearEvento, listarEventos, obtenerEventosUsuario, obtenerEvento, actualizarEvento, eliminarEvento };
