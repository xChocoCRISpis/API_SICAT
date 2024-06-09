const { default: mongoose } = require('mongoose');
const moongose=require('mongoose');

const detallesChecador = new mongoose.Schema({
    hora:{type: String,required: true},
    fecha:{type: String,required: true},
    id_horario :{ type: Number, required: true }
},{_id:false});

const checadorSchema = new mongoose.Schema({
    id_encargado: { type: Number, required: true },
    checador:[detallesChecador]
},{collection:'checador'});

module.exports = mongoose.model('checador',checadorSchema);