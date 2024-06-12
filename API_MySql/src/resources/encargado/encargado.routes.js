import express from 'express';
import {insertarEncargado,
    insertarUsuario,
    insertarHorario,
    agregarHorario
} from "./encargado.controllers.js";

console.log('Se importaron las rutas de encargado');
const router = express.Router();

router.post("/insertarEncargado", insertarEncargado);
router.post("/insertarUsuario", insertarUsuario);
router.post("/insertarHorario", insertarHorario);
router.post("/agregarHorario", agregarHorario);


export default router;

