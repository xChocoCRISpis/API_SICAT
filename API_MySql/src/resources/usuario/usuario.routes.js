import express from 'express';
import { login

} from "./usuario.controllers.js";

console.log('Se importaron las rutas de usuario');
const router = express.Router();

router.post('/login', login);

export default router;

