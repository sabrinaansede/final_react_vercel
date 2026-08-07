import Usuario from "../models/usuario.model.js";

export async function isAdmin(req, res, next) {
  try {
    const usuario = await Usuario.findById(req.user.id);
    
    if (!usuario || !usuario.isAdmin) {
      return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador." });
    }
    
    next();
  } catch (error) {
    console.error("Error verificando permisos de admin:", error);
    res.status(500).json({ message: "Error al verificar permisos" });
  }
}
