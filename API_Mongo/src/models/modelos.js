const { default: mongoose } = require('mongoose');
const moongose=require('mongoose');
/*const BitacoraDetalles = mongoose.Schema({
    fecha: { type: String, required: false },
    hora: { type: String, required: false },
    accion: { type: String, required: false }
});*/
  
/*const bitacora = mongoose.Schema({
    id_usuario: { type: Number, required: true },
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    accion: { type: String, required: true }
}, { collection: 'bitacora' });
*/

// Definición del esquema de detalles de la bitacora
const detallesBitacoraSchema = new mongoose.Schema({
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    accion: { type: String, required: true }
},{ _id: false });

// Definición del esquema principal de la bitacora
const bitacoraSchema = new mongoose.Schema({
    id_usuario: { type: Number, required: true },
    detalles_bitacora: [detallesBitacoraSchema] // Array de detalles de la bitacora
}, { collection: 'bitacora' }); // Especifica el nombre de la colección

module.exports = mongoose.model('bitacora', bitacoraSchema);

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

const detallesAsistencia = new mongoose.Schema({
    fecha : {type:String,required:true},
    hora : {type:String,required:true}
},{_id:false});

const asistenciaSchema = new mongoose.Schema({
    id_encargado : {type:Number, required:true},
    asistencia:[detallesAsistencia]
},{collection:'asistencia'});

module.exports = mongoose.model('asistencia',asistenciaSchema);
//module.exports=mongoose.model('bitacora',bitacora);