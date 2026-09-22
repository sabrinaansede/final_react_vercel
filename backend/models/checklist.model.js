import mongoose from "mongoose";

const { Schema } = mongoose;

const checklistSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  items: [{
    id: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
    },
    completado: {
      type: Boolean,
      default: false,
    },
  }],
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Checklist = mongoose.model("Checklist", checklistSchema);
export default Checklist;
