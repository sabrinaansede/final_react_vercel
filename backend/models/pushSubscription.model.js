import mongoose from "mongoose";

const { Schema } = mongoose;

const pushSubscriptionSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
  userAgent: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Índice compuesto para evitar suscripciones duplicadas por usuario
pushSubscriptionSchema.index({ usuario: 1, endpoint: 1 });

const PushSubscription = mongoose.model("PushSubscription", pushSubscriptionSchema);
export default PushSubscription;
