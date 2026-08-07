import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from './models/usuario.model.js';

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI_PROD);
    console.log('✅ Conectado a MongoDB');

    const admin = await Usuario.findOne({ email: 'admin@autisi.com' });
    
    if (admin) {
      console.log('✅ Usuario admin encontrado');
      console.log('📧 Email:', admin.email);
      console.log('🔑 isAdmin:', admin.isAdmin);
      console.log('👤 Nombre:', admin.nombre);
    } else {
      console.log('❌ Usuario admin NO encontrado');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkAdmin();
