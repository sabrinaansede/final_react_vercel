import { Router } from 'express';
import usuarioRouter from './UsuarioRouter.js';
import lugarRouter from './lugar.router.js';
import resenaRouter from './resenas.router.js';
import profesionalRouter from './profesional.router.js';
import tecnicaRouter from './tecnica.router.js';
import registroEmocionalRouter from './registroEmocional.router.js';

const router = Router();

// Mount routes
router.use('/usuarios', usuarioRouter);
router.use('/lugares', lugarRouter);
router.use('/resenas', resenaRouter);
router.use('/profesionales', profesionalRouter);
router.use('/tecnicas', tecnicaRouter);
router.use('/registros-emocionales', registroEmocionalRouter);

export default router;
