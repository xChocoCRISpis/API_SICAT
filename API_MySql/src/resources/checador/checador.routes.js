import express from 'express';
import { insertarAlumno,
    getActividadesDeportivas,
    getActividadesCulturales,
    editarAlumno
} from "./checador.controllers.js";

console.log('Se importaron las rutas de actividades');
const router = express.Router();

router.post('/insertarAlumno', insertarAlumno);
router.get('/getActDep',getActividadesDeportivas);
router.get('/getActCul',getActividadesCulturales);
router.post('/editarAlumno', editarAlumno);
export default router;

