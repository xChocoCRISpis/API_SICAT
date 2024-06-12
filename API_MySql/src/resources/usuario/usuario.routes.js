import express from 'express';
import { login,
enviarToken,
cambiarConstrasena,
getDatosPerfil,
getHorariosPerfil
} from "./usuario.controllers.js";

console.log('Se importaron las rutas de usuario');
const router = express.Router();

router.post('/login', login);
router.post('/enviarToken', enviarToken);
router.post('/cambiarContrasena', cambiarConstrasena);
router.get('/datosPerfil/:idUsuario',getDatosPerfil);
router.get('/horariosPerfil/:idUsuario',getHorariosPerfil);

export default router;

