import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from './models/usuario.model.js';

async function fixAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI_PROD);
    console.log('✅ Conectado a MongoDB');

    const admin = await Usuario.findOne({ email: 'admin@autisi.com' });
    
    if (admin) {
      console.log('Usuario admin encontrado:', admin.email);
      console.log('isAdmin actual:', admin.isAdmin);
      
      admin.isAdmin = true;
      await admin.save();
      
      console.log('✅ Usuario admin actualizado con isAdmin: true');
    } else {
      console.log('❌ Usuario admin no encontrado');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixAdmin();
