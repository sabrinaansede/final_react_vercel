import Profesional from "../models/profesional.model.js";

const escapeRegex = (text) => {
  if (!text) return ''
  return text.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const crearProfesional = async (req, res) => {
  try {
    const nuevoProfesional = new Profesional(req.body);
    await nuevoProfesional.save();
    res.status(201).json({ message: "Profesional creado", data: nuevoProfesional });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const listarProfesionales = async (req, res) => {
  try {
    const { especialidad, ubicacion, modalidad } = req.query;
    const filtro = {
      $or: [
        { activo: true },
        { activo: { $exists: false } },
      ],
    };
    
    if (especialidad) filtro.especialidad = { $regex: `^${escapeRegex(especialidad)}$`, $options: 'i' };
    if (ubicacion) filtro.ubicacion = { $regex: `^${escapeRegex(ubicacion)}$`, $options: 'i' };
    if (modalidad) filtro.modalidad = { $regex: `^${escapeRegex(modalidad)}$`, $options: 'i' };
    
    const profesionales = await Profesional.find(filtro)
      .populate("resenas")
      .sort({ calificacion: -1, creadoEn: -1 });
    res.json({ data: profesionales });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerProfesional = async (req, res) => {
  try {
    const profesional = await Profesional.findById(req.params.id)
      .populate("resenas");
    if (!profesional) return res.status(404).json({ message: "Profesional no encontrado" });
    res.json({ data: profesional });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarProfesional = async (req, res) => {
  try {
    const profesional = await Profesional.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!profesional) return res.status(404).json({ message: "Profesional no encontrado" });
    res.json({ message: "Profesional actualizado", data: profesional });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const eliminarProfesional = async (req, res) => {
  try {
    const profesional = await Profesional.findByIdAndDelete(req.params.id);
    if (!profesional) return res.status(404).json({ message: "Profesional no encontrado" });
    res.json({ message: "Profesional eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerEspecialidades = async (req, res) => {
  try {
    const especialidades = await Profesional.distinct("especialidad");
    res.json({ data: especialidades });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerUbicaciones = async (req, res) => {
  try {
    const ubicaciones = await Profesional.distinct("ubicacion");
    res.json({ data: ubicaciones });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
