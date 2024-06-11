const express = require('express');
const router = express.Router();
const Asistencia = require('../models/modelAsistencia.js'); 
const Funciones = require('../utils/funcionesFecha.js');

// Crear
router.post('/crear', async (req, res) => {
    const { id_pertenece, asistencia } = req.body;
    try {
        
        let asistenciaIn = await Asistencia.findOne({ id_pertenece});

        if (asistenciaIn) {
            
            asistenciaIn.asistencia.push(...asistencia);
        } else {
            
            asistenciaIn = new Asistencia({ id_pertenece, asistencia});
        }
        const asis=await asistenciaIn.save();
        res.status(201).json(asis);
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


// Función para obtener las horas por id_pertenece
const obtenerHorasPorIdPertenece = async (id_pertenece) => {
    try {
        const result = await Asistencia.aggregate([
            { $match: { id_pertenece: id_pertenece } },
            { $unwind: "$asistencia" },
            { $group: {
                _id: "$id_pertenece",
                totalHoras: { $sum: "$asistencia.horas" }
            }}
        ]);

        if (result.length > 0) {
            return result[0].totalHoras;
        } else {
            return 0; // Si no se encuentra el id_pertenece, devolver 0 horas
        }
    } catch (error) {
        console.error('Error al obtener las horas:', error);
        throw new Error('Error al obtener las horas');
    }
};

// Ruta para obtener las horas por id_pertenece
router.get('/getHoras/:id_pertenece', async (req, res) => {
    const { id_pertenece } = req.params;

    try {
        const totalHoras = await obtenerHorasPorIdPertenece(Number(id_pertenece));
        res.status(200).json({ id_pertenece, totalHoras });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;

