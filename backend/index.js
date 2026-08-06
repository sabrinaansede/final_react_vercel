// index.js
import 'dotenv/config'; // Carga variables de entorno desde .env
import express from "express";
import connectDB from "./config/db.js";
import routerAPI from "./routes/index.js";
import Profesional from "./models/profesional.model.js";
import Tecnica from "./models/tecnica.model.js";

await connectDB();

await seedProfesionales();
await seedTecnicas();

const app = express();

import cors from 'cors';

async function seedProfesionales() {
  try {
    const count = await Profesional.countDocuments();
    if (count === 0) {
      await Profesional.create([
        {
          nombre: 'María',
          apellido: 'Pérez',
          especialidad: 'Psicología',
          ubicacion: 'CABA',
          modalidad: 'presencial',
          descripcion: 'Psicóloga especializada en TEA y apoyo familiar.',
          experiencia: '10 años atendiendo a niños y adolescentes.',
          horarios: 'Lunes a viernes, 9:00 a 17:00',
          email: 'maria.perez@example.com',
          telefono: '+54 9 11 1234 5678'
        },
        {
          nombre: 'Lucía',
          apellido: 'Fernández',
          especialidad: 'Terapia Ocupacional',
          ubicacion: 'Rosario',
          modalidad: 'virtual',
          descripcion: 'Terapia ocupacional con enfoque sensorial y de autonomía.',
          experiencia: '8 años de experiencia en entornos educativos.',
          horarios: 'Martes y jueves, 14:00 a 19:00',
          email: 'lucia.fernandez@example.com',
          telefono: '+54 9 341 987 6543'
        },
        {
          nombre: 'Carlos',
          apellido: 'Gómez',
          especialidad: 'Fonoaudiología',
          ubicacion: 'Mendoza',
          modalidad: 'ambas',
          descripcion: 'Fonoaudiólogo con experiencia en comunicación aumentativa.',
          experiencia: '12 años en diagnóstico y rehabilitación.',
          horarios: 'Miércoles y viernes, 10:00 a 18:00',
          email: 'carlos.gomez@example.com',
          telefono: '+54 9 261 555 1234'
        }
      ]);
      console.log('✅ Seed inicial de profesionales creada.');
    }
  } catch (error) {
    console.error('❌ Error al crear seed de profesionales:', error);
  }
}

async function seedTecnicas() {
  try {
    const count = await Tecnica.countDocuments();
    if (count === 0) {
      await Tecnica.create([
        {
          titulo: "Respiración 4-7-8",
          desc: "Inhalá 4s, retené 7s, exhalá 8s para reducir ansiedad.",
          img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
          categoria: "respiración",
          tags: ["respiración", "calma"],
          steps: [
            "Encontrá un lugar cómodo y apoyá la espalda.",
            "Inhalá por la nariz contando 4.",
            "Retené el aire contando 7.",
            "Exhalá suave por la boca contando 8.",
            "Repetí 4 ciclos.",
          ],
          source: "https://undraw.co/illustrations",
        },
        {
          titulo: "Presión profunda",
          desc: "Usá mantas pesadas o un chaleco para aportar contención.",
          img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
          categoria: "sensorial",
          tags: ["sensorial", "propiocepción"],
          steps: [
            "Elegí una manta pesada adecuada (10% del peso aprox).",
            "Cubrí hombros y tronco de forma uniforme.",
            "Mantené 10–15 minutos observando confort.",
            "Retirá si hay incomodidad o calor.",
          ],
          source: "https://storyset.com/",
        },
        {
          titulo: "Ruido blanco",
          desc: "Auriculares con ruido blanco o sonidos suaves.",
          img: "https://images.unsplash.com/photo-1518441902110-9f89f7e83cd0?q=80&w=1200&auto=format&fit=crop",
          categoria: "sensorial",
          tags: ["auditivo", "calma"],
          steps: [
            "Colocá auriculares cómodos.",
            "Elegí ruido blanco/lluvia/olas a volumen bajo.",
            "Probá 5–10 minutos y ajustá si es necesario.",
          ],
          source: "https://www.freepik.com/vectors/illustrations",
        },
        {
          titulo: "Estiramientos suaves",
          desc: "Movimientos lentos para liberar tensión muscular.",
          img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
          categoria: "movimiento",
          tags: ["movimiento", "relajación"],
          steps: [
            "Estirá los brazos hacia arriba lentamente.",
            "Rotá los hombros en círculos suaves.",
            "Incliná el cuello suavemente a cada lado.",
            "Estirá las piernas con movimientos controlados.",
          ],
          source: "https://undraw.co/illustrations",
        },
        {
          titulo: "Foco en un objeto",
          desc: "Concentrá la atención en un solo objeto visual.",
          img: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1200&auto=format&fit=crop",
          categoria: "enfoque",
          tags: ["visual", "atención"],
          steps: [
            "Elegí un objeto cercano.",
            "Observá sus colores y texturas.",
            "Notá detalles que antes no veías.",
            "Mantené el foco por 2-3 minutos.",
          ],
          source: "https://storyset.com/",
        },
        {
          titulo: "Caminata consciente",
          desc: "Caminá prestando atención a cada paso.",
          img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1200&auto=format&fit=crop",
          categoria: "movimiento",
          tags: ["movimiento", "atención"],
          steps: [
            "Caminá a paso lento y constante.",
            "Sentí el contacto del pie con el suelo.",
            "Observá el entorno sin juzgar.",
            "Respirá en sincronía con los pasos.",
          ],
          source: "https://www.freepik.com/vectors/illustrations",
        },
      ]);
      console.log('✅ Seed inicial de técnicas creada.');
    }
  } catch (error) {
    console.error('❌ Error al crear seed de técnicas:', error);
  }
}

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://final-react-vercel.vercel.app',
  'https://autisi-backend.onrender.com',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/.*\.netlify\.app$/,
  /^https:\/\/.*\.github\.dev$/
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((entry) =>
      entry instanceof RegExp ? entry.test(origin) : entry === origin
    );

    if (isAllowed) return callback(null, true);

    if (process.env.ALLOW_ALL_ORIGINS === 'true' || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    console.log('❌ Origen no permitido por CORS:', origin);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

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
