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
    console.log('Conexión a MongoDB establecida (updateProducto)');
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

// Ruta para actualizar producto
app.put('/producto/:id', async (req, res) => {
  try {
    await connectToDatabase();
    
    // Aquí puedes agregar validación de autenticación si es necesario
    // const token = req.headers.authorization?.split(' ')[1];
    // if (!token) return res.status(401).json({ message: 'No autorizado' });
    
    const id = req.params.id;
    const body = req.body;
    const producto = await productosRepository.updateOne(id, body);
    
    if (!producto) {
      return res.status(404).json({
        message: 'Not found',
      });
    }
    
    res.status(200).json({
      message: 'El producto se actualizo correctamente',
      response: producto,
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