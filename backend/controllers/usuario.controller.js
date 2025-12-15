//const Usuario = require('../models/UsuarioModel');
import mongoose from 'mongoose';
import Usuario from "../models/usuario.model.js";
import Reseña from "../models/resenas.model.js";
const crearUsuario = async ( request, response) =>{
    const body = request.body;
    const nuevoUsuario =  new Usuario(body);
    const usuario = await nuevoUsuario.save();

    response.json({ msg: "Usuario creado", data: usuario});
}

const listarUsuario = async ( request, response) =>{
    const usuarios = await Usuario.find();
    response.json( {data: usuarios });
}

const getUserById = async ( request, response) => {
    const id = request.params.id;
    const user = await Usuario.findById(id);
    if( user){
        response.status(200).json( {data: user});
    } else {
        response.status(404).json({ msg: 'Usuario no Encontrado'});
    }
}

const deleteUserById = async ( request, response) => {
    const id = request.params.id;
    const user = await Usuario.findByIdAndDelete(id);
    if( user){
        response.status(200).json( {data: user});
    } else {
        response.status(404).json({ msg: 'Usuario no Encontrado'});
    }
}
const updeteUserById = async ( request, response) => {
    const id = request.params.id;
    const body = request.body;

    const user = await Usuario.findByIdAndUpdate(id, body);
    if( user){
        response.status(200).json( {data: user});
    } else {
        response.status(404).json({ msg: 'Usuario no Encontrado'});
    }
}

// Obtener estadísticas del usuario
const obtenerEstadisticas = async (req, res) => {
  try {
    console.log('Obteniendo estadísticas para el usuario:', req.params.id);
    const usuarioId = req.params.id;
    
    // Verificar que el ID del usuario sea válido
    if (!usuarioId || !mongoose.Types.ObjectId.isValid(usuarioId)) {
      console.error('ID de usuario no válido:', usuarioId);
      return res.status(400).json({ error: 'ID de usuario no válido' });
    }

    // Obtener todas las reseñas del usuario
    const reseñas = await Reseña.find({ usuario: usuarioId });
    console.log(`Se encontraron ${reseñas.length} reseñas para el usuario ${usuarioId}`);
    
    // Calcular estadísticas
    const totalReseñas = reseñas.length;
    const totalLikes = await Reseña.countDocuments({ usuario: usuarioId });
    
    // Obtener lugares únicos, manejando el caso donde lugar podría ser null/undefined
    const lugaresUnicos = new Set(
      reseñas
        .map(r => r.lugar?.toString())
        .filter(lugar => lugar)  // Filtrar valores nulos o undefined
    ).size;
    
    const sumaPuntuaciones = reseñas.reduce((sum, r) => sum + (r.puntuacion || 0), 0);
    const promedioRating = totalReseñas > 0 
      ? Number((sumaPuntuaciones / totalReseñas).toFixed(1))
      : 0;

    console.log('Estadísticas calculadas:', {
      totalReseñas,
      totalLikes,
      lugaresUnicos,
      promedioRating
    });

    // Obtener actividades recientes (últimas 5)
    const actividades = await Reseña.find({ usuario: usuarioId })
      .sort({ fechaCreacion: -1 })
      .limit(5)
      .populate('lugar', 'nombre')
      .select('puntuacion comentario lugar fechaCreacion');

    console.log(`Se encontraron ${actividades.length} actividades recientes`);

    const respuesta = {
      data: {
        totalReseñas,
        totalLikes,
        lugaresVisitados: lugaresUnicos,
        promedioRating,
        actividadesRecientes: actividades.map(act => ({
          tipo: 'resena',
          mensaje: `Publicaste una reseña en ${act.lugar?.nombre || 'un lugar'}`,
          fecha: act.fechaCreacion,
          lugar: act.lugar?._id
        }))
      }
    };

    console.log('Respuesta de estadísticas:', JSON.stringify(respuesta, null, 2));
    res.json(respuesta);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas del usuario',
      detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export { 
  crearUsuario, 
  listarUsuario, 
  getUserById, 
  deleteUserById, 
  updeteUserById,
  obtenerEstadisticas 
};
