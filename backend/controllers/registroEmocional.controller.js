import RegistroEmocional from "../models/registroEmocional.model.js";

export const obtenerRegistros = async (req, res) => {
  try {
    const { usuario, lugar } = req.query;
    const filtro = {};
    if (usuario) filtro.usuario = usuario;
    if (lugar) filtro.lugar = lugar;
    
    const registros = await RegistroEmocional.find(filtro)
      .populate('usuario', 'nombre email')
      .populate('lugar', 'nombre direccion')
      .sort({ fecha: -1 });
    
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros emocionales" });
  }
};

export const crearRegistro = async (req, res) => {
  try {
    const {
      usuario,
      lugar,
      emocion,
      fecha,
      notas = ""
    } = req.body || {};

    // Validaciones básicas
    const faltantes = [];
    if (!usuario) faltantes.push("usuario");
    if (!lugar) faltantes.push("lugar");
    if (!emocion) faltantes.push("emocion");
    if (!fecha) faltantes.push("fecha");
    
    if (faltantes.length) {
      return res.status(400).json({ error: `Faltan campos obligatorios: ${faltantes.join(", ")}` });
    }

    const nuevoRegistro = new RegistroEmocional({
      usuario,
      lugar,
      emocion,
      fecha,
      notas
    });

    await nuevoRegistro.save();
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    console.error("Error al crear registro emocional:", error?.message || error);
    res.status(500).json({ error: error?.message || "Error al crear el registro emocional" });
  }
};

export const obtenerRegistroPorId = async (req, res) => {
  try {
    const registro = await RegistroEmocional.findById(req.params.id)
      .populate('usuario', 'nombre email')
      .populate('lugar', 'nombre direccion');
    
    if (!registro) return res.status(404).json({ error: "Registro emocional no encontrado" });
    res.json(registro);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el registro emocional" });
  }
};

export const actualizarRegistro = async (req, res) => {
  try {
    const registro = await RegistroEmocional.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!registro) return res.status(404).json({ error: "Registro emocional no encontrado" });
    res.json(registro);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el registro emocional" });
  }
};

export const eliminarRegistro = async (req, res) => {
  try {
    const registro = await RegistroEmocional.findByIdAndDelete(req.params.id);
    
    if (!registro) return res.status(404).json({ error: "Registro emocional no encontrado" });
    res.json({ message: "Registro emocional eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el registro emocional" });
  }
};

export const obtenerRegistrosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const registros = await RegistroEmocional.find({ usuario: usuarioId })
      .populate('lugar', 'nombre direccion')
      .sort({ fecha: -1 });
    
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los registros del usuario" });
  }
};
