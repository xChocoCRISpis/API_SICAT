import express from 'express';
import { insertarAsistencia
} from "./asistencia.controllers.js";

console.log('Se importaron las rutas de asistencia');
const router = express.Router();

router.post('/insertarAsistencia', insertarAsistencia);
export default router;

