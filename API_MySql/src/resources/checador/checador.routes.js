import express from 'express';
import { pruebaRegistrarChecador
} from "./checador.controllers.js";

console.log('Se importaron las rutas de checador');
const router = express.Router();

router.post('/registrar', pruebaRegistrarChecador);

export default router;

