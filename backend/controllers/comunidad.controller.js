import Post from '../models/post.model.js';
import path from 'path';

export const crearPost = async (req, res) => {
  try {
    const { author, category, text } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newPost = new Post({ author: author || 'Anónimo', category, text, imageUrl });
    await newPost.save();

    // Emitir via Socket.IO si está disponible
    try {
      const io = req.app && req.app.get && req.app.get('io');
      if (io) io.emit('nuevo-post', newPost);
    } catch (e) {
      console.warn('No se pudo emitir evento socket (crearPost):', e.message);
    }

    res.status(201).json({ message: 'Post creado', data: newPost });
  } catch (err) {
    console.error('Error crear post:', err);
    res.status(500).json({ message: 'Error al crear post' });
  }
};

export const listarPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(200);
    res.status(200).json({ data: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar posts' });
  }
};

export const eliminarPost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Intentando eliminar post con ID:', id);
    
    const post = await Post.findByIdAndDelete(id);
    
    if (!post) {
      console.log('Post no encontrado:', id);
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    console.log('Post eliminado exitosamente:', id);
    res.status(200).json({ message: 'Post eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar post:', err);
    res.status(500).json({ message: 'Error al eliminar post' });
  }
};
