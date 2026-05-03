require('dotenv').config();
const mongoose = require('mongoose');

// Conectar a MongoDB
const mongoUri = process.env.MONGO_URI || process.env.MONGODB || 'mongodb://localhost:27017/tiendaAppBe';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Conexión a MongoDB establecida');

    const db = mongoose.connection.db;

    // Lista de colecciones a eliminar
    const collections = ['users', 'productos'];

    for (const collectionName of collections) {
      try {
        await db.dropCollection(collectionName);
        console.log(`Colección '${collectionName}' eliminada exitosamente`);
      } catch (error) {
        if (error.code === 26) {
          console.log(`La colección '${collectionName}' no existe, omitiendo`);
        } else {
          console.error(`Error al eliminar la colección '${collectionName}':`, error);
        }
      }
    }

    console.log('Proceso completado. Las colecciones han sido recreadas (se crearán automáticamente al insertar datos).');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });