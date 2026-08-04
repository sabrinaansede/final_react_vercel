import mongoose from "mongoose";
const { Schema } = mongoose;

const profesionalSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  especialidad: { type: String, required: true },
  ubicacion: { type: String, required: true },
  modalidad: { type: String, enum: ['presencial', 'virtual', 'ambas'], required: true },
  foto: { type: String, default: '' },
  descripcion: { type: String, required: true },
  experiencia: { type: String, required: true },
  horarios: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
  calificacion: { type: Number, default: 0, min: 0, max: 5 },
  resenas: [{ type: Schema.Types.ObjectId, ref: "Resena" }],
  activo: { type: Boolean, default: true },
  creadoEn: { type: Date, default: Date.now }
});

export default mongoose.model("Profesional", profesionalSchema);
