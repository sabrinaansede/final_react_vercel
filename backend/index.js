// index.js
import 'dotenv/config'; // Carga variables de entorno desde .env
import express from "express";
import connectDB from "./config/db.js";
import routerAPI from "./routes/index.js";

connectDB();

const app = express();

import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173', // desarrollo local
  'https://final-react-vercel.vercel.app', // producción
  /^https:\/\/final-react-vercel-.*\.vercel\.app$/ // previews de Vercel
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman / server-side requests
    const isAllowed = allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin);
    if (isAllowed) return callback(null, true);
    console.log('❌ Origen no permitido por CORS:', origin);
    callback(new Error('No permitido por CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

app.use('/api', routerAPI);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`🔥 Servidor corriendo en puerto ${PORT}`));
