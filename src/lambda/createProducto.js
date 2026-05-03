const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Reutilizar conexión a MongoDB (optimización para Lambda)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    isConnected = true;
    console.log('Conexión a MongoDB establecida (createProducto)');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err);
    throw err;
  }
};

// Importar repositorio
const productosRepository = require('../repositories/productosRepositories');

// Crear mini-app Express
const app = express();
app.use(cors());
app.use(express.json());

// Ruta para crear producto
app.post('/producto', async (req, res) => {
  try {
    await connectToDatabase();
    
    // Aquí puedes agregar validación de autenticación si es necesario
    // const token = req.headers.authorization?.split(' ')[1];
    // if (!token) return res.status(401).json({ message: 'No autorizado' });
    
    const producto = await productosRepository.save(req.body);

    return res.status(201).json({
      message: 'El Producto se creo correctamente',
      response: producto
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