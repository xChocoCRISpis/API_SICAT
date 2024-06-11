import { pool } from "../../db/connect.js";
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";
import axios from 'axios';
import { obtenerDiaYHoraActual} from "../utils/funcionesFecha.js";


// Función para obtener horas por id_pertenece
const obtenerHorasPorIdPertenece = async (id_pertenece) => {
    const response = await axios.get(`http://localhost:9000/asistencia/getHoras/${id_pertenece}`);
    return response.data.totalHoras;
};

// Función para insertar y actualizar horas
export const insertarAsistencia = async (req, res) => {
    const { id_encargado, id_pertenece, horas, id_alumno } = req.body;

    try {
        // Verificar que el id_alumno pertenezca a la actividad y el encargado esté autorizado
        const [verificacion] = await pool.query(
            `SELECT td.Id_actividad_fk FROM tb_encargados_detalle td
            JOIN tb_pertenece tp ON td.Id_actividad_fk = tp.Id_actividad_fk
            WHERE td.Id_encargado_fk = ? AND tp.Id_pertenece_pk = ? AND tp.Id_alumnos_fk = ?`,
            [id_encargado, id_pertenece, id_alumno]
        );

        if (verificacion.length === 0) {
            return res.status(400).json({ message: 'El encargado no pertenece a la actividad o el alumno no está registrado.' });
        }

        // Obtener las horas actuales de MongoDB
        const totalHoras = await obtenerHorasPorIdPertenece(id_pertenece);

        // Llamar al procedimiento almacenado con las horas actuales + nuevas horas
        await pool.query('CALL sp_ActualizarHoras(?, ?, ?)', [id_encargado, id_pertenece, totalHoras + horas]);

        // Obtener la fecha y hora actual
        const now = new Date();
        const fecha = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD

        // Crear un nuevo registro de asistencia en MongoDB
        const nuevaAsistencia = {
            id_pertenece,
            asistencia: [{ id_encargado, fecha: fecha, horas }]
        };

        // Hacer la petición POST a la API de MongoDB para insertar la asistencia
        await axios.post('http://localhost:9000/asistencia/crear', nuevaAsistencia);

        res.status(201).json({ success: true, message: 'Horas insertadas y actualizadas correctamente.' });
    } catch (error) {
        console.error('Error al insertar horas:', error);
        res.status(500).json({ message: error.message });
    }
};