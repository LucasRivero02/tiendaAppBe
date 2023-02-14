const {response} = require('express');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const sendEmail = require('../../config/config')
const userRepository = require('../../repositories/userRepositories');


// consulto todos los clientes que existen
const loginUser = async(req, res = response)=>{
   try{
      const {email, password} = req.body;
      const user = await userRepository.loginUser(email);
      if (!user){
         return res.status(400).json({
            ok: false,
            message: 'No existe usuario',
         });
      }
      const status = user.status;
      if(!status){
         return res.status(400).json({
            ok: false,
            message: 'Usuario no verificado',
         });
      }
      const validPassword = await bcryptjs.compare(password, user.password);
      // if (!validPassword){
      //    return res.status(404).json({
      //       ok: false,
      //       message: 'Contraseña incorrecta',
      //    })
      // }
      const rol = user.rol;
      // se crea el token, se pasa el payload
      const token = jwt.sign({
         name: user.name,
         email: user.email,
         id: user._id,
         rol: user.rol,
      }, process.env.SECRET_KEY)

      res.status(200).json({
         ok: true,
         message: `Bienvenido, ${user.name}`,
         token,
         rol
      })
   }catch(error){
      res.status(500).json({
         message:'Error interno del Servidor',
         err: error
      })
   }
}

module.exports = {
   loginUser,
}