const express = require('express');
const router = express.Router();
const Bitacora = require('../models/modelBitacora.js'); 
const Funciones = require('../funciones.js');


// Crear
router.post('/crear', async (req, res) => {
    const { id_usuario, detalles_bitacora } = req.body;

    try {
        // Buscar si ya existe un documento con el id_usuario dado
        let bitacora = await Bitacora.findOne({ id_usuario });

        if (bitacora) {
            // Si existe, agregar los nuevos detalles al array de detalles_bitacora
            bitacora.detalles_bitacora.push(...detalles_bitacora);
        } else {
            // Si no existe, crear un nuevo documento
            bitacora = new Bitacora({ id_usuario, detalles_bitacora });
        }

        // Guardar el documento (sea nuevo o actualizado)
        const savedBitacora = await bitacora.save();
        res.json(savedBitacora);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Traer todos
router.get('/traer', async (req, res) => {
    try {
        const bitacoras = await Bitacora.find();
        res.status(200).json(bitacoras);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Traer por ID de usuario
router.get('/traer/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const bitacora = await Bitacora.findOne({ id_usuario: parseInt(id_usuario) });
        if (!bitacora) return res.status(404).json({ message: "Not found" });
        res.json(bitacora);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar por ID de usuario
router.put('/traer/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    const { fecha, hora, accion } = req.body;

    try {
        const bitacora = await Bitacora.findOneAndUpdate(
            { id_usuario: parseInt(id_usuario) },
            { $set: { "detalles_bitacora.$[elem].fecha": fecha, "detalles_bitacora.$[elem].hora": hora, "detalles_bitacora.$[elem].accion": accion } },
            { arrayFilters: [{ "elem.fecha": fecha, "elem.hora": hora, "elem.accion": accion }], new: true }
        );
        if (!bitacora) return res.status(404).json({ message: "Not found" });
        res.json(bitacora);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar por ID de usuario
router.delete('/traer/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const bitacora = await Bitacora.findOneAndRemove({ id_usuario: parseInt(id_usuario) });
        if (!bitacora) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Bitacora eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para buscar por rango de fechas
router.get('/buscar/fecha', async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    const normalizedFechaInicio = Funciones.normalizarFecha(fechaInicio);
    const normalizedFechaFin = Funciones.normalizarFecha(fechaFin);
    console.log("FechaInicio: ", normalizedFechaInicio, "FechaFin: ", normalizedFechaFin)

    try {
        const registros = await Bitacora.aggregate([
            { $unwind: "$detalles_bitacora" },
            { $match: { 
                "detalles_bitacora.fecha": { 
                    $gte: normalizedFechaInicio, 
                    $lte: normalizedFechaFin 
                } 
            }},
            { $group: {
                _id: "$_id",
                id_usuario: { $first: "$id_usuario" },
                detalles_bitacora: { $push: "$detalles_bitacora" }
            }}
        ]);
        res.status(200).json(registros);
    } catch (error) {
        console.error('Error al buscar por fecha', error);
        res.status(500).json({ message: 'Error al buscar por fecha' });
    }
});

// Ruta para buscar por acción
router.get('/buscar/:accion', async (req, res) => {
    const { accion } = req.params;

    try {
        const registros = await Bitacora.find({
            'detalles_bitacora.accion': accion
        });

        res.status(200).json(registros);
    } catch (error) {
        console.error('Error al buscar por acción', error);
        res.status(500).json({ message: 'Error al buscar por acción' });
    }
});

// Ruta para buscar por usuario, acción y rango de fechas
router.get('/buscar', async (req, res) => {
    const { id_usuario, accion, fechaInicio, fechaFin } = req.query;
    const normalizedFechaInicio = Funciones.normalizarFecha(fechaInicio);
    const normalizedFechaFin = Funciones.normalizarFecha(fechaFin);
    console.log("FechaInicio: ", normalizedFechaInicio, "FechaFin: ", normalizedFechaFin);

    try {
        const registros = await Bitacora.aggregate([
            { $match: { id_usuario: parseInt(id_usuario) } },
            { $unwind: "$detalles_bitacora" },
            { $match: { 
                "detalles_bitacora.accion": accion,
                $expr: {
                    $and: [
                        { $gte: [ "$detalles_bitacora.fecha", normalizedFechaInicio ] },
                        { $lte: [ "$detalles_bitacora.fecha", normalizedFechaFin ] }
                    ]
                }
            }},
            { $group: {
                _id: "$_id",
                id_usuario: { $first: "$id_usuario" },
                detalles_bitacora: { $push: "$detalles_bitacora" }
            }}
        ]);

        res.status(200).json(registros);
    } catch (error) {
        console.error('Error al buscar por usuario, acción y fechas', error);
        res.status(500).json({ message: 'Error al buscar por usuario, acción y fechas' });
    }
});

module.exports = router;