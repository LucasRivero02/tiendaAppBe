const { response } = require('express');
const productoRepository = require ('../../repositories/productosRepositories');
const updateProducto = async(req, res = response)=>{
   console.log('req.body: ', req.body)
   const id = req.body._id;
   const body = req.body;
   try{
      const producto = await productoRepository.updateOne(id, body);
      if (!producto){
         return res.status(404).json({
            message: 'Not found',
         })
      }
      res.status(200).json({
         message: 'El producto se actualizo correctamente',
         data: producto,
      })
   }catch(error){
      res.status(500).json({
         message:'Error interno del Servidor',
         err: error
      })
   }
}

module.exports = {updateProducto};