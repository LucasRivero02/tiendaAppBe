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
    console.log('Conexión a MongoDB establecida (confirmUser)');
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

// HTML de confirmación (alternativa a leer de archivo)
const CONFIRM_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Confirmación Exitosa</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
    .container { background: #f0f0f0; padding: 30px; border-radius: 10px; }
    h1 { color: #28a745; }
    p { color: #666; }
    a { color: #007bff; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>✓ Confirmación Exitosa</h1>
    <p>Tu cuenta ha sido confirmada correctamente.</p>
    <p><a href="\${FRONTEND_URL}">Volver al inicio</a></p>
  </div>
</body>
</html>
`;

// Ruta para confirmar usuario
app.get('/confirm/:token', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { token } = req.params;
    
    // Verificar y decodificar el JWT
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(400).json({
        success: false,
        msg: 'Error al obtener data'
      });
    }
    
    const email = verified.email;
    const id = verified.id;
    
    // Verificar existencia del usuario
    const existeEmail = await userRepository.validarMail(email);
    
    if (!existeEmail) {
      return res.status(404).json({
        success: false,
        msg: 'Usuario no existe'
      });
    }
    
    // Actualizar estado del usuario
    existeEmail.status = true;
    await userRepository.updateOne(id, existeEmail);
    
    // Retornar HTML de confirmación
    const frontendUrl = process.env.FRONTEND_URL || 'https://tu-frontend.com';
    const html = CONFIRM_HTML.replace(/\$\{FRONTEND_URL\}/g, frontendUrl);
    
    res.set('Content-Type', 'text/html');
    res.send(html);
    
  } catch (error) {
    console.error('Error al confirmar usuario:', error);
    
    // Manejar errores específicos de JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        success: false,
        msg: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        msg: 'Token expirado'
      });
    }
    
    return res.status(500).json({
      success: false,
      msg: 'Error al confirmar usuario'
    });
  }
});

// Exportar handler para Lambda
module.exports.handler = serverless(app);