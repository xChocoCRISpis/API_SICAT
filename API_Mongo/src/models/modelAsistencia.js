const { default: mongoose } = require('mongoose');
const moongose=require('mongoose');

const detallesAsistencia = new mongoose.Schema({
    fecha : {type:String,required:true},
    hora : {type:String,required:true}
},{_id:false});

const asistenciaSchema = new mongoose.Schema({
    id_encargado : {type:Number, required:true},
    asistencia:[detallesAsistencia]
},{collection:'asistencia'});

module.exports = mongoose.model('asistencia',asistenciaSchema);