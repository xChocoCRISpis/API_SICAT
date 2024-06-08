'use strict';
const mongoose = require('mongoose');
const Bitacora = mongoose.model('Bitacora'); 
console.log("Nombres de modelos Mongoose: ",mongoose.modelNames());

exports.ListarTodasLasBitacoras = async (req, res) => {
  try {
    const bitacoras = await Bitacora.find();
    console.log("Datos de ListarTodasLasBitacoras", bitacoras); // Verificar los datos en la consola
    if (bitacoras.length === 0) {
      console.log("No se encontraron registros en la colección bitacora.");
    }
    res.json(bitacoras);
  } catch (err) {
    console.log("Error al listar las bitacoras:", err);
    res.status(500).send(err);
  }
};

exports.crearBitacora = async (req, res) => {
  try {
    const newBitacora = new Bitacora(req.body);
    const bitacora = await newBitacora.save();
    res.json(bitacora);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.leerBitacora = async (req, res) => {
  try {
    const bitacora = await Bitacora.findById(req.params.bitacoraId);
    if (!bitacora) {
      return res.status(404).send('Bitacora no encontrada');
    }
    res.json(bitacora);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.actualizarBitacora = async (req, res) => {
  try {
    const bitacora = await Bitacora.findOneAndUpdate({ _id: req.params.bitacoraId }, req.body, { new: true });
    if (!bitacora) {
      return res.status(404).send('Bitacora no encontrada');
    }
    res.json(bitacora);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.borrarBitacora = async (req, res) => {
  try {
    const bitacora = await Bitacora.remove({ _id: req.params.bitacoraId });
    if (!bitacora) {
      return res.status(404).send('Bitacora no encontrada');
    }
    res.json({ message: 'Bitacora Borrada Exitosamente' });
  } catch (err) {
    res.status(500).send(err);
  }
};
