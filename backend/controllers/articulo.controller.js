import Articulo from "../models/articulo.model.js";

export const crearArticulo = async (req, res) => {
  try {
    const nuevoArticulo = new Articulo(req.body);
    await nuevoArticulo.save();
    res.status(201).json({ message: "Artículo creado", data: nuevoArticulo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const listarArticulos = async (req, res) => {
  try {
    const articulos = await Articulo.find({ activo: true }).sort({ createdAt: -1 });
    res.json({ data: articulos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerArticulo = async (req, res) => {
  try {
    const articulo = await Articulo.findById(req.params.id);
    if (!articulo) return res.status(404).json({ message: "Artículo no encontrado" });
    res.json({ data: articulo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarArticulo = async (req, res) => {
  try {
    const articulo = await Articulo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!articulo) return res.status(404).json({ message: "Artículo no encontrado" });
    res.json({ message: "Artículo actualizado", data: articulo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const eliminarArticulo = async (req, res) => {
  try {
    const articulo = await Articulo.findByIdAndDelete(req.params.id);
    if (!articulo) return res.status(404).json({ message: "Artículo no encontrado" });
    res.json({ message: "Artículo eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
