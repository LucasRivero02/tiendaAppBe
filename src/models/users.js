const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name:       { type: String, required: true },
   email:      { type: String, unique: true, required: true, lowercase: true },
   password:   { type: String, required: true, minlength: 6 },
   status:     { type: Boolean, default: false},
   rol :       { type: String, default: 'usuario'},
   })
 
 module.exports = mongoose.model('user', userSchema);