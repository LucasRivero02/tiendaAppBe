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
    console.log('Conexión a MongoDB establecida (getProductosById)');
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

// Ruta para getProductosById
app.get('/producto/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const id = req.params.id;
    const productos = await productosRepository.getOne(id);
    
    if (!productos) {
      return res.status(404).json({
        message: 'Not found',
      });
    }
    
    res.status(200).json({
      response: productos,
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