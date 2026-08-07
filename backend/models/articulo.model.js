import mongoose from "mongoose";

const { Schema } = mongoose;

const articuloSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'Info',
  },
  intro: {
    type: String,
    required: true,
  },
  sections: [{
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    list: [{
      type: String,
    }],
  }],
  highlight: {
    type: String,
  },
  related: [{
    type: String,
  }],
  activo: {
    type: Boolean,
    default: true,
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  },
}, { timestamps: true });

const Articulo = mongoose.model("Articulo", articuloSchema);
export default Articulo;
