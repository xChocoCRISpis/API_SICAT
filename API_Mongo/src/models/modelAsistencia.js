const { default: mongoose } = require('mongoose');
const moongose=require('mongoose');

const detallesAsistencia = new mongoose.Schema({
    id_encargado : {type:Number, required:true},
    fecha : {type:String,required:true},
    horas : {type:Number,required:true}
},{_id:false});

const asistenciaSchema = new mongoose.Schema({
    id_pertenece : {type:Number, require:true},
    asistencia:[detallesAsistencia]
},{collection:'asistencia'});

module.exports = mongoose.model('asistencia',asistenciaSchema);