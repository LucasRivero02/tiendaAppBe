const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   archivo_1:   { type: String },
   archivo_2:   { type: String },
   archivo_3:   { type: String },
   archivo_4:   { type: String },
   archivo_5:   { type: String },
   descripcion: { type: String, required: true },
   precio:      { type: Number, required: true },
   
   })
 
 module.exports = mongoose.model('producto', userSchema);