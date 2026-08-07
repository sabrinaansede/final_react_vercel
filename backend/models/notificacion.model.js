import mongoose from "mongoose";

const { Schema } = mongoose;

const notificacionSchema = new Schema({
  titulo: {
    type: String,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['info', 'success', 'warning', 'emergency'],
    default: 'info',
  },
  url: {
    type: String,
    default: '/',
  },
  targetAudience: {
    type: String,
    enum: ['all', 'registered', 'specific'],
    default: 'all',
  },
  targetUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  }],
  enviadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  enviadoAt: {
    type: Date,
    default: Date.now,
  },
  recipientsCount: {
    type: Number,
    default: 0,
  },
  readCount: {
    type: Number,
    default: 0,
  },
  leidoPor: [{
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    leidoAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, { timestamps: true });

const Notificacion = mongoose.model("Notificacion", notificacionSchema);
export default Notificacion;
