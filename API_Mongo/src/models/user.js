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

//module.exports=mongoose.model('bitacora',bitacora);