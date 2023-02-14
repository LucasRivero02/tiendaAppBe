const { response } = require('express');
const productoRepository = require ('../../repositories/productosRepositories');
const deleteProducto = async(req, res = response)=>{
   const id = req.params.id;
   try{
      const producto = await productoRepository.deleteOne(id);
      if (!producto){
         return res.status(404).json({
            message: 'Not found',
         })
      }
      res.status(200).json({
         message: 'El producto se borro correctamente',
         data: producto,
      })
   }catch(error){
      res.status(500).json({
         message:'Error interno del Servidor',
         err: error
      })
   }
}

module.exports = {deleteProducto};