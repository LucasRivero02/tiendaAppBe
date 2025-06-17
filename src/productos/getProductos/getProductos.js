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

const getPaginatedProductos = async (req, res = response) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { items, totalItems } = await productosRepository.getPaginated(limit, offset);

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'No hay productos' });
    }

    return res.status(200).json({
      message: 'Productos paginados',
      response: items,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.error('Error al paginar productos:', error);
    return res.status(500).json({
      message: 'Error interno del servidor',
      err: error,
    });
  }
};

module.exports = {
   getProductos,
   getProductosById,
   getPaginatedProductos,
}