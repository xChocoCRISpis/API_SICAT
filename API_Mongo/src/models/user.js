const { default: mongoose } = require('mongoose');
const moongose=require('mongoose');
/*const BitacoraDetalles = mongoose.Schema({
    fecha: { type: String, required: false },
    hora: { type: String, required: false },
    accion: { type: String, required: false }
});*/
  
const bitacora = mongoose.Schema({
    id_usuario: { type: Number, required: true },
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    accion: { type: String, required: true }
});  

module.exports=mongoose.model('bitacora',bitacora);