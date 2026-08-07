import express from 'express';
import multer from 'multer';
import path from 'path';
import { crearPost, listarPosts, eliminarPost } from '../controllers/comunidad.controller.js';

const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g,'_')}`),
});
const upload = multer({ storage });

router.get('/posts', listarPosts);
router.post('/posts', upload.single('image'), crearPost);
router.delete('/posts/:id', eliminarPost);

export default router;
