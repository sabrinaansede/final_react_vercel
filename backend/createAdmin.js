import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Usuario from './models/usuario.model.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI_PROD);
    console.log('✅ Conectado a MongoDB');

    // Datos del administrador
    const nombre = 'Admin';
    const email = 'admin@autisi.com';
    const password = 'Autisi2024!'; // Cambiar por una contraseña segura

    // Verificar si ya existe
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      console.log('⚠️ El usuario admin ya existe');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hashear contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('✅ Contraseña hasheada');

    // Crear usuario administrador
    const adminUser = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      isAdmin: true,
      tipoUsuario: 'persona',
    });

    await adminUser.save();
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email:', email);
    console.log('🔑 Contraseña:', password);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear administrador:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();
