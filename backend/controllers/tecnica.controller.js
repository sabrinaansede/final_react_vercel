import Tecnica from "../models/tecnica.model.js";

export const obtenerTecnicas = async (req, res) => {
  try {
    const tecnicas = await Tecnica.find();
    res.json(tecnicas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las técnicas" });
  }
};

export const crearTecnica = async (req, res) => {
  try {
    const {
      titulo,
      desc,
      img,
      categoria,
      tags = [],
      steps = [],
      source = "",
    } = req.body || {};

    // Validaciones básicas
    const faltantes = [];
    if (!titulo) faltantes.push("titulo");
    if (!desc) faltantes.push("desc");
    if (!img) faltantes.push("img");
    if (!categoria) faltantes.push("categoria");
    if (faltantes.length) {
      return res.status(400).json({ error: `Faltan campos obligatorios: ${faltantes.join(", ")}` });
    }

    const nuevaTecnica = new Tecnica({
      titulo,
      desc,
      img,
      categoria,
      tags,
      steps,
      source,
    });

    await nuevaTecnica.save();
    res.status(201).json(nuevaTecnica);
  } catch (error) {
    console.error("Error al crear la técnica:", error?.message || error);
    res.status(500).json({ error: error?.message || "Error al crear la técnica" });
  }
};

export const obtenerTecnicaPorId = async (req, res) => {
  try {
    const tecnica = await Tecnica.findById(req.params.id);
    if (!tecnica) return res.status(404).json({ error: "Técnica no encontrada" });
    res.json(tecnica);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la técnica" });
  }
};

export const actualizarTecnica = async (req, res) => {
  try {
    const tecnica = await Tecnica.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tecnica) return res.status(404).json({ error: "Técnica no encontrada" });
    res.json(tecnica);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la técnica" });
  }
};

export const eliminarTecnica = async (req, res) => {
  try {
    const tecnica = await Tecnica.findByIdAndDelete(req.params.id);
    if (!tecnica) return res.status(404).json({ error: "Técnica no encontrada" });
    res.json({ message: "Técnica eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la técnica" });
  }
};
