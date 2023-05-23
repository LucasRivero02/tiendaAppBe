const User = require('../models/users');
const bcryptjs = require('bcryptjs');

const getAll = async ()     => await User.find();
const getOne = async (id)   => await User.findById(id);
const count  = async ()     => await User.count();
const validarMail = async(email)  => await User.findOne({email: email}); 
const loginUser = async(email)  => await User.findOne({email: email}); 
const updateOne = async (id, body)  => await User.findByIdAndUpdate(id, body);
// guardo el nuevo usuario
const save   = async (body) => {
   const {name, email, password, status} = body;
   const user = new User({
      name,
      email,
      password,
      status,
   })
   //encripto la contraseña
   const salt = bcryptjs.genSaltSync();
   user.password = bcryptjs.hashSync(password, salt);
   await user.save();
   return user;
}

module.exports = {
   getAll,
   getOne,
   count,
   save,
   validarMail,
   loginUser,
   updateOne
}