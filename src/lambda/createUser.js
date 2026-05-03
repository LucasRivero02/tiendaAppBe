const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
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
    console.log('Conexión a MongoDB establecida (createUser)');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err);
    throw err;
  }
};

// Importar repositorio y servicios
const userRepository = require('../repositories/userRepositories');
const { getTemplate, sendEmail } = require('../config/config');

// Crear mini-app Express
const app = express();
app.use(cors());
app.use(express.json());

// Ruta para crear usuario
app.post('/register', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { email, password, name } = req.body;
    
    // Validar que los campos requeridos existan
    if (!email || !password || !name) {
      return res.status(400).json({
        message: 'Email, password y name son requeridos'
      });
    }
    
    const existeEmail = await userRepository.validarMail(email);
    if (existeEmail) {
      return res.status(404).json({
        message: 'Ya existe usuario registrado con ese Email',
      });
    }
    
    const user = await userRepository.save(req.body);
    
    // Crear token JWT
    const token = jwt.sign({
      name: user.name,
      email: user.email,
      id: user._id,
    }, process.env.JWT_SECRET);
    
    // Obtener template de email y enviar
    const template = getTemplate(email, token);
    await sendEmail(email, 'Confirmación de Registro', template);
    
    return res.status(201).json({
      message: 'El Usuario se creo correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error interno del servidor',
      err: error.message
    });
  }
});

// Exportar handler para Lambda
module.exports.handler = serverless(app);