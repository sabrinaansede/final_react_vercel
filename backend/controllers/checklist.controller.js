import Checklist from "../models/checklist.model.js";
import Usuario from "../models/usuario.model.js";

// Obtener todos los checklists de un usuario
export const getChecklistsByUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const checklists = await Checklist.find({ usuario: usuarioId }).sort({ createdAt: -1 });
    res.json(checklists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo checklist
export const createChecklist = async (req, res) => {
  try {
    const { usuarioId, nombre, descripcion, items } = req.body;
    
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const newChecklist = new Checklist({
      usuario: usuarioId,
      nombre,
      descripcion,
      items: items || [],
    });

    const savedChecklist = await newChecklist.save();
    res.status(201).json(savedChecklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un checklist
export const updateChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, items } = req.body;

    const updatedChecklist = await Checklist.findByIdAndUpdate(
      id,
      { nombre, descripcion, items },
      { new: true }
    );

    if (!updatedChecklist) {
      return res.status(404).json({ message: "Checklist no encontrado" });
    }

    res.json(updatedChecklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un checklist
export const deleteChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChecklist = await Checklist.findByIdAndDelete(id);

    if (!deletedChecklist) {
      return res.status(404).json({ message: "Checklist no encontrado" });
    }

    res.json({ message: "Checklist eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un checklist por ID
export const getChecklistById = async (req, res) => {
  try {
    const { id } = req.params;
    const checklist = await Checklist.findById(id);

    if (!checklist) {
      return res.status(404).json({ message: "Checklist no encontrado" });
    }

    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
