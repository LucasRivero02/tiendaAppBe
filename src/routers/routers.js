const { Router } = require('express');
const router = new Router();

const { createUser, loginUser, confirmUser } = require('../users/usersController');
const { createProducto, getProductos, deleteProducto, updateProductosById } = require('../productos/productoController');

router.post('/register', createUser.createUser);
router.post('/login', loginUser.loginUser);
router.get('/confirm/:token', [], confirmUser.confirm);

router.post('/producto', createProducto.createProducto);
router.get('/producto', getProductos.getProductos);
router.get('/producto/:id', getProductos.getProductosById);
router.delete('/producto/:id', deleteProducto.deleteProducto);
router.put('/producto/:id', updateProductosById.updateProducto);

module.exports = router;