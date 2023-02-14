const { response } = require('express');
const jwt = require('jsonwebtoken');
const userRepository = require ('../../repositories/userRepositories');
const {getTemplate, sendEmail} = require('../../config/config')
const createUser = async (req, res = response) => {
   try{
      const {email, password, name} = req.body;
      const existeEmail = await userRepository.validarMail(email);
      if (existeEmail){
         return res.status(404).json({
            message: 'Ya existe usuario registrado con ese Email',
         })
      }
      
      const user = await userRepository.save(req.body);
      // se crea el token, se pasa el payload
      const token = jwt.sign({
         name: user.name,
         email: user.email,
         id: user._id,
      }, process.env.SECRET_KEY)
      // Obtener un template
      const template = getTemplate(email, token);

      // Enviar el email
      await sendEmail(email, 'Este es un email de prueba', template);
      
      return res.status(201).json({
         message: 'El Usuario se creo correctamente'
      })
   }catch (error){
      return res.status(500).json({
         message: 'Error interno del servidor',
         err: error
      })
   }
}

module.exports = {createUser};