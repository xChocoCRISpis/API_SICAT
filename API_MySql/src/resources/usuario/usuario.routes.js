import express from 'express';
import { login,
enviarToken

} from "./usuario.controllers.js";

console.log('Se importaron las rutas de usuario');
const router = express.Router();

router.post('/login', login);
router.post('/enviarToken', enviarToken)

export default router;

