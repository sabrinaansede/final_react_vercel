import mongoose from "mongoose";

const lugarSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
  latitud: Number,
  longitud: Number,
  tipo: String,
  provincia: String,
  descripcion: String,
  certificacion: String,
  etiquetasSensoriales: [String],
  foto: { type: String, default: '' },
});

const Lugar = mongoose.model("Lugar", lugarSchema);

export default Lugar;
