const express = require('express');
const router = express.Router();
const Asistencia = require('../models/modelAsistencia.js'); 
const Funciones = require('../utils/funcionesFecha.js');

// Crear
router.post('/crear', async (req, res) => {
    const { id_encargado, asistencia } = req.body;

    try {
        // Crear un nuevo documento de asistencia
        const nuevaAsistencia = new Asistencia({ id_encargado, asistencia });
        const savedAsistencia = await nuevaAsistencia.save();
        res.status(201).json(savedAsistencia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Traer todos
router.get('/traer', async (req, res) => {
    try {
        const asistencias = await Asistencia.find();
        res.status(200).json(asistencias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Traer por ID de encargado
router.get('/traer/:id_encargado', async (req, res) => {
    const { id_encargado } = req.params;

    try {
        const asistencia = await Asistencia.findOne({ id_encargado });
        if (!asistencia) return res.status(404).json({ message: "Not found" });
        res.status(200).json(asistencia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar por ID de encargado
router.put('/actualizar/:id_encargado', async (req, res) => {
    const { id_encargado } = req.params;
    const { fecha, hora } = req.body;

    try {
        const asistencia = await Asistencia.findOneAndUpdate(
            { id_encargado },
            { $set: { "asistencia.$[elem].fecha": fecha, "asistencia.$[elem].hora": hora } },
            { arrayFilters: [{ "elem.fecha": fecha, "elem.hora": hora }], new: true }
        );

        if (!asistencia) return res.status(404).json({ message: "Not found" });
        res.status(200).json(asistencia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar por ID de encargado
router.delete('/eliminar/:id_encargado', async (req, res) => {
    const { id_encargado } = req.params;

    try {
        const asistencia = await Asistencia.findOneAndRemove({ id_encargado });
        if (!asistencia) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ message: "Asistencia eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;



module.exports = router;