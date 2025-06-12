const { response } = require('express');
const productosRepository = require ('../../repositories/productosRepositories');
// consulto todas los productos existentes
const getProductos = async(req, res = response)=>{
   try{
      const productos = await productosRepository.getAll();
      const count = await productosRepository.count();
      if (!productos){
         return res.status(404).json({
            message: 'Not found',
         })
      }
      res.status(200).json({
         message: 'Productos',
         response: productos,
         total: count
      })
   }catch(error){
      res.status(500).json({
         message:'Error interno del Servidor',
         err: error
      })
   }
}

const getProductosById = async(req, res = response)=>{
   try{
      const id = req.params.id;
      const productos = await productosRepository.getOne(id);
      const count = await productosRepository.count();
      if (!productos){
         return res.status(404).json({
            message: 'Not found',
         })
      }
      res.status(200).json({
         response: productos,
      })
   }catch(error){
      res.status(500).json({
         message:'Error interno del Servidor',
         err: error
      })
   }
}

module.exports = {
   getProductos,
   getProductosById,
}