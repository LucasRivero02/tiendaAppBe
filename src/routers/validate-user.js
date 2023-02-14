module.exports = (schema) => {
   return async (req, res, next) => {
      try {
         // si todo esta bien continuo, de lo contrario entra por el catch
         await schema.validateAsync(req.body);
         next();
      }catch(error){
         return res.status(500).json({
            message: 'Error al validar',
         })
      }
   }
}