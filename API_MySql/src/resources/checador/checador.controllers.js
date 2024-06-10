import { pool } from "../../db/connect.js";
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";
import { obtenerDiaYHoraActual} from "../utils/funcionesFecha.js";

export const registrarChecador = async (idEncargado) => {
    try {
        const { diaYPeriodo, hora } = obtenerDiaYHoraActual();

        console.log("Datos enviados al SP:", idEncargado, diaYPeriodo, hora);

        // Llamar al procedimiento almacenado para validar el horario
        await pool.query(
            'CALL sp_ValidarHorarioProfesor(?, ?, ?, @es_valido);', 
            [idEncargado, diaYPeriodo, hora]
        );

        const [results] = await pool.query('SELECT @es_valido AS es_valido;');

        const esValido = results[0].es_valido;

        console.log("Resultado del SP:", esValido);

        
        if (esValido) {
            return { success: true, message: 'Registro insertado correctamente.' };
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