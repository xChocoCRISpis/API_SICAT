'use strict';
module.exports = function (app) {
  const bitacora = require('../controllers/BitacoraController');
  app.route('/bitacoras')
    .get(bitacora.ListarTodasLasBitacoras)
    .post(bitacora.crearBitacora);
  app.route('/bitacoras/:bitacoraId')
    .get(bitacora.leerBitacora)
    .put(bitacora.actualizarBitacora)
    .delete(bitacora.borrarBitacora);
};