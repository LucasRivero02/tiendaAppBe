const Producto = require('../models/productos');

const deleteOne = async(id) => await Producto.findByIdAndDelete(id);
const getAll = async ()     => await Producto.find();
const getOne = async (id)   => await Producto.findById(id);
const count  = async ()     => await Producto.count();
// guardo el nuevo usuario
const save   = async (body) => {
   const {descripcion, precio, archivo_1, archivo_2, archivo_3, archivo_4, archivo_5} = body;
   const producto = new Producto({
      descripcion,
      precio,
      archivo_1,
      archivo_2,
      archivo_3,
      archivo_4,
      archivo_5
   })
   await producto.save();
   return producto;
}

const updateOne = async (id, body)  => await Producto.findByIdAndUpdate(id, body);

module.exports = {
   getAll,
   getOne,
   count,
   save,
   deleteOne,
   updateOne,
}