import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import routerAPI from "./routes/index.js";

dotenv.config();
connectDB();

const app = express();

// -------------------- CORS --------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        origin === "http://localhost:5173" ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// -------------------- Middlewares --------------------
app.use(express.json());

// -------------------- Rutas --------------------
app.use('/api', routerAPI);

// -------------------- 404 --------------------
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// -------------------- Error handler --------------------
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    message: "Error interno del servidor",
    error: {},
  });
});

// -------------------- Servidor --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
