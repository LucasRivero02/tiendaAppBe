const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/users');
const verifyToken = require('../../routers/validate-token');
const userRepository = require ('../../repositories/userRepositories');

const confirm = async (req, res) => {
   try {
      // Obtener el token
      const { token } = req.params;
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      if(verified === null) {
        return res.json({
            success: false,
            msg: 'Error al obtener data'
        });
      }
      const email  = verified.email;
      const id     = verified.id
      // Verificar existencia del usuario
      const existeEmail = await userRepository.validarMail(email);
    
      if(existeEmail === null) {
         return res.json({
            success: false,
            msg: 'Usuario no existe'
         });
      }
      existeEmail.status = true;
      // Actualizar usuario
      const user = await userRepository.updateOne(id, existeEmail);
      // Redireccionar a la confirmación
      return res.redirect('/confirm.html');
       
   } catch (error) {
       return res.json({
           success: false,
           msg: 'Error al confirmar usuario'
       });
   }
}

module.exports = {
    confirm
}