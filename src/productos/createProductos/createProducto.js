const { response } = require('express');
const productoRepository = require ('../../repositories/productosRepositories');
const createProducto = async (req, res = response) => {
   try{
      const producto = await productoRepository.save(req.body);

      return res.status(201).json({
         message: 'El Producto se creo correctamente'
      })
   }catch (error){
      return res.status(500).json({
         message: 'Error interno del servidor',
         err: error
      })
   }
}

module.exports = {createProducto};