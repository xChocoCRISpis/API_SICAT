import { pool } from "../../db/connect.js";
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";
import { obtenerDiaYHoraActual} from "../utils/funcionesFecha.js";
import axios from "axios";

export const registrarChecador = async (idEncargado) => {
    try {
        const { diaYPeriodo, hora } = obtenerDiaYHoraActual();

        console.log("Datos enviados al SP:", idEncargado, diaYPeriodo, hora);

        // Llamar al procedimiento almacenado para validar el horario
        await pool.query(
            'CALL sp_ValidarHorarioProfesor(?, ?, ?, @es_valido, @horario);', 
            [idEncargado, diaYPeriodo, hora]
        );

        const [results] = await pool.query('SELECT @es_valido AS es_valido, @horario as horario;');
        const esValido = results[0].es_valido;
        

        console.log("Resultado del SP:", esValido);

        if (esValido) {
            // Crear un nuevo registro en MongoDB
            const nuevoRegistro = {
                id_encargado: idEncargado,
                checador: [{ fecha: diaYPeriodo, hora, id_horario: results[0].horario }] // Ajusta id_horario según sea necesario
            };

            // Hacer la petición a la API de MongoDB
            const response = await axios.post('http://localhost:9000/checador/crear', nuevoRegistro);

            return { success: true, message: 'Registro insertado correctamente.', data: response.data };
        } else {
            return { success: false, message: 'Fuera del horario permitido.' };
        }
    } catch (error) {
        console.error('Error al registrar en checador:', error);
        throw new Error('Error al registrar en checador');
    }
};


// Función de prueba
export const pruebaRegistrarChecador = async (req, res) => {
    const { id_encargado } = req.body;

    try {
        const resultado = await registrarChecador(id_encargado);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};