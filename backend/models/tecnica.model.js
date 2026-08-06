import mongoose from "mongoose";

const tecnicaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
  categoria: { type: String, required: true },
  tags: [String],
  steps: [String],
  source: String,
});

const Tecnica = mongoose.model("Tecnica", tecnicaSchema);

export default Tecnica;
