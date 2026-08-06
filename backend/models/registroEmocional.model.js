import mongoose from "mongoose";

const registroEmocionalSchema = new mongoose.Schema({
  usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario", 
    required: true 
  },
  lugar: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Lugar", 
    required: true 
  },
  emocion: { 
    type: String, 
    required: true,
    enum: ['😊 Muy bien', '🙂 Bien', '😐 Regular', '😕 Mal', '😞 Muy mal']
  },
  fecha: { 
    type: Date, 
    required: true 
  },
  notas: { 
    type: String, 
    default: "" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const RegistroEmocional = mongoose.model("RegistroEmocional", registroEmocionalSchema);

export default RegistroEmocional;
