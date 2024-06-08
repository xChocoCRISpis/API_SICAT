'use strict';
/*
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LibroSchema = new Schema({
  title: {
    type: String,
    required: 'Titulos del Libro'
  },
  isbn: {
    type: String,
    required: 'Identificador del Libro'
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
});
module.exports = mongoose.model('Libros', LibroSchema);
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BitacoraDetalles = new Schema({
  fecha: { type: String, required: 'Fecha' },
  hora: { type: String, required: 'Hora' },
  accion: { type: String, required: 'Accion' }
});

const BitacoraSchema = new Schema({
  id_usuario: { type: Number, required: 'Id de usuario' },
  bitacora: [BitacoraDetalles]
});

module.exports = mongoose.model('Bitacora', BitacoraSchema);