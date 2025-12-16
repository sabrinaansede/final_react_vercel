import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI_PROD || process.env.URI_DB;
  if (!mongoUri) {
    console.error("❌ No se encontró MONGO_URI_PROD ni URI_DB en las variables de entorno");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error de conexión a MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
