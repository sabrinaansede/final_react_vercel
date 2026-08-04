import mongoose from "mongoose";
const { Schema } = mongoose;

const agendaSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  nombre: { type: String, required: true },
  profesional: { type: String },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  lugar: { type: String },
  notas: { type: String },
  recordatorio: { type: Boolean, default: false },
  creadoEn: { type: Date, default: Date.now }
});

export default mongoose.model("Agenda", agendaSchema);
