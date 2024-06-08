const { default: mongoose } = require('mongoose');
const moongose=require('mongoose');
const BitacoraDetalles = mongoose.Schema({
    fecha: { type: String, required: false },
    hora: { type: String, required: false },
    accion: { type: String, required: false }
});
  
const BitacoraSchema = mongoose.Schema({
    id_usuario: { type: Number, required: false },
    fecha: { type: String, required: false },
    hora: { type: String, required: false },
    accion: { type: String, required: false }
});  

module.exports=mongoose.model('BitacoraSchema',BitacoraSchema,'bitacora',BitacoraDetalles);