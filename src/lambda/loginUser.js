const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

// Reutilizar conexión a MongoDB
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    isConnected = true;
    console.log('Conexión a MongoDB establecida (loginUser)');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err);
    throw err;
  }
};

// Importar repositorio
const userRepository = require('../repositories/userRepositories');

// Crear mini-app Express
const app = express();
app.use(cors());
app.use(express.json());

// Ruta para login
app.post('/login', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { email, password } = req.body;
    
    // Validar que los campos requeridos existan
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y password son requeridos'
      });
    }
    
    const user = await userRepository.loginUser(email);
    
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: 'No existe usuario',
      });
    }
    
    // Verificar que el usuario esté confirmado
    if (!user.status) {
      return res.status(400).json({
        ok: false,
        message: 'Usuario no verificado',
      });
    }
    
    // Validar contraseña
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: 'Contraseña incorrecta',
      });
    }
    
    // Crear JWT token
    const token = jwt.sign({
      name: user.name,
      email: user.email,
      id: user._id,
      rol: user.rol,
    }, process.env.JWT_SECRET);

    res.status(200).json({
      ok: true,
      message: `Bienvenido, ${user.name}`,
      token,
      rol: user.rol
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del Servidor',
      err: error.message
    });
  }
});

// Exportar handler para Lambda
module.exports.handler = serverless(app);