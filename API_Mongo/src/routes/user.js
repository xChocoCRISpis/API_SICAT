const express = require('express');
const router = express.Router();
const bitacora = require('../models/user');

// Crear
router.post('/crear', (req, res) => {
    const user = new bitacora(req.body);
    user.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Traer todos
router.get('/traer', (req, res) => {
    bitacora.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Traer por ID
router.get('/traer/:id', (req, res) => {
    const { id } = req.params;
    bitacora.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Actualizar por ID
router.put('/traer/:id', (req, res) => {
    const { id } = req.params;
    const { fecha, hora, accion } = req.body;
    bitacora.updateOne({ _id: id }, { $set: { fecha, hora, accion } })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Eliminar por ID
router.delete('/traer/:id', (req, res) => {
    const { id } = req.params;
    bitacora.remove({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
