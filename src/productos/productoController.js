const createProducto = require('../productos/createProductos/createProducto');
const getProductos = require('../productos/getProductos/getProductos');
const deleteProducto = require('../productos/deleteProductos/deleteProducto');
const getProductosById = require('../productos/getProductos/getProductos');
const updateProductosById = require('../productos/updateProductos/updateProducto');

module.exports = {
   createProducto,
   getProductos,
   deleteProducto,
   getProductosById,
   updateProductosById,
}