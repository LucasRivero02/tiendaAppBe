const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB (recomendado: conectar fuera de la función para reutilizar)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    isConnected = true;
    console.log('Conexión a MongoDB establecida');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err);
    throw err;
  }
};

// Importar repositorio
const productosRepository = require('../repositories/productosRepositories');

// Crear mini-app Express para esta función
const app = express();
app.use(cors());
app.use(express.json());

// Ruta para getProductos
app.get('/producto', async (req, res) => {
  try {
    await connectToDatabase();
    const productos = await productosRepository.getAll();
    const count = await productosRepository.count();
    if (!productos) {
      return res.status(404).json({
        message: 'Not found',
      });
    }
    res.status(200).json({
      message: 'Productos',
      response: productos,
      total: count
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