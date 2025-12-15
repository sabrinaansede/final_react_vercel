import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routerAPI from './routes/index.js';
import cors from 'cors';
dotenv.config();
const PORT = process.env.PORT || 5000;
const URI_DB = process.env.URI_DB;

// Nos conectamos a la DB
if (!URI_DB) {
  console.warn('⚠️  URI_DB no está definido en .env. Configure la cadena de conexión de MongoDB.');
}
mongoose.connect(URI_DB || '', { dbName: process.env.DB_NAME }).catch((e) => {
  console.error('Error inicial al conectar con MongoDB:', e.message);
});

const db = mongoose.connection;

db.on('error', () => { console.error('Error de conexión')});
db.once('open', () => { console.log('Conexión con la DB Correcta 👌')});

const app = express();

// Configuración de CORS para permitir credenciales
const corsOptions = {
  origin: 'http://localhost:5173', // Reemplaza con tu URL de frontend
  credentials: true, // Permite el envío de credenciales
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

//metodo estatico

app.use('/', express.static('public'));

app.use(  (request, response, next) => {
    console.log('Hola soy el middleware ');
    next();
});

app.get('/', (request, response) => {
    response.send('<h1> API 📍 </h1>');
})

routerAPI(app);
app.listen(PORT, () => {
    console.log(`API 📍 en el puerto ${PORT}`);
} )