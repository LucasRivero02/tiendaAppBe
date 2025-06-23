const { response } = require('express');
const path = require('path');
const fs = require('fs');
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
    const filePath = path.join(__dirname, 'confirm.html'); // Ajustá si está en otra carpeta
    fs.readFile(filePath, 'utf8', (err, html) => {
      if (err) {
        console.error('Error al leer confirm.html:', err);
        return res.status(500).send('Error al cargar la página de confirmación');
      }

      const frontendUrl = process.env.FRONTEND_URL;
      const updatedHtml = html.replace(/\$\{FRONTEND_URL\}/g, frontendUrl);

      res.send(updatedHtml);
    });
       
   } catch (error) {
        console.error('Error al confirmar usuario:', error);
       return res.json({
           success: false,
           msg: 'Error al confirmar usuario'
       });
   }
}

module.exports = {
    confirm
}