import express from 'express';
import { insertarAlumno,
    getActividadesDeportivas,
    getActividadesCulturales
} from "./actividades.controllers.js";

console.log('Se importaron las rutas de actividades');
const router = express.Router();

router.post('/insertarAlumno', insertarAlumno);
router.get('/getActDep',getActividadesDeportivas);
router.get('/getActCul',getActividadesCulturales);

export default router;

