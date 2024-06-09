const express = require('express');
const router = express.Router();
const Bitacora = require('../models/user'); 

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
router.get('/traer', (req, res) => {
    Bitacora.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Traer todos
router.get('/traer', (req, res) => {
    Bitacora.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Traer por ID de usuario
router.get('/traer/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    Bitacora.findOne({ id_usuario })
        .then((data) => {
            if (!data) return res.status(404).json({ message: "Not found" });
            res.json(data);
        })
        .catch((error) => res.status(500).json({ message: error }));
});

// Actualizar por ID de usuario
router.put('/traer/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const { fecha, hora, accion } = req.body;

    Bitacora.findOneAndUpdate(
        { id_usuario },
        { $set: { "detalles_bitacora.$[elem].fecha": fecha, "detalles_bitacora.$[elem].hora": hora, "detalles_bitacora.$[elem].accion": accion } },
        { arrayFilters: [{ "elem.fecha": fecha, "elem.hora": hora, "elem.accion": accion }], new: true }
    )
        .then((data) => {
            if (!data) return res.status(404).json({ message: "Not found" });
            res.json(data);
        })
        .catch((error) => res.status(500).json({ message: error }));
});

// Eliminar por ID de usuario
router.delete('/traer/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    Bitacora.findOneAndRemove({ id_usuario })
        .then((data) => {
            if (!data) return res.status(404).json({ message: "Not found" });
            res.json(data);
        })
        .catch((error) => res.status(500).json({ message: error }));
});

module.exports = router;
