const express = require('express');
const router = express.Router();
const Checador = require('../models/modelChecador.js'); 
const Funciones = require('../utils/funcionesFecha.js');

// Crear
router.post('/crear', async (req, res) => {
    const { id_encargado, checador } = req.body;

    try {
        
        let checadorIn = await Checador.findOne({ id_encargado });

        if (checadorIn) {
            
            checadorIn.checador.push(...checador);
        } else {
            
            checadorIn = new Checador({ id_encargado, checador});
        }
        const savedChecador = await checadorIn.save();
        res.status(201).json("Checkout insertado correctamente");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Traer todos
router.get('/traer', async (req, res) => {
    try {
        const checadores = await Checador.find();
        res.status(200).json(checadores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Traer por ID de encargado
router.get('/traer/:id_encargado', async (req, res) => {
    const { id_encargado } = req.params;

    try {
        const checador = await Checador.findOne({ id_encargado: parseInt(id_encargado) });
        if (!checador) return res.status(404).json({ message: "Not found" });
        res.status(200).json(checador);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Actualizar por ID de encargado
router.put('/actualizar/:id_encargado', async (req, res) => {
    const { id_encargado } = req.params;
    const { hora, fecha, id_horario } = req.body;

    try {
        const checador = await Checador.findOneAndUpdate(
            { id_encargado: parseInt(id_encargado), "checador.fecha": fecha, "checador.hora": hora, "checador.id_horario": id_horario },
            { $set: { "checador.$.hora": hora, "checador.$.fecha": fecha, "checador.$.id_horario": id_horario } },
            { new: true }
        );
        if (!checador) return res.status(404).json({ message: "Not found" });
        res.status(200).json(checador);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Eliminar por ID de encargado
router.delete('/eliminar/:id_encargado', async (req, res) => {
    const { id_encargado } = req.params;

    try {
        const checador = await Checador.findOneAndUpdate(
            { id_encargado: parseInt(id_encargado) },
            { $pull: { checador: { id_encargado: parseInt(id_encargado) } } },
            { new: true }
        );
        if (!checador) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ message: "Checador eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
