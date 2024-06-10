import { pool } from "../../db/connect.js";
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";


export const registrarChecador = async (idEncargado, dia, hora) => {
    try {
        // Llamar al procedimiento almacenado para validar el horario
        const [results] = await pool.query(
            'CALL sp_ValidarHorarioProfesor(?, ?, ?, @es_valido); SELECT @es_valido AS es_valido;', 
            [idEncargado, dia, hora]
        );
        
        const esValido = results[1][0].es_valido;

        if (esValido) {
            // Crear un nuevo registro en MongoDB
            const nuevoRegistro = {
                id_encargado: idEncargado,
                checador: [{ fecha: dia, hora, id_horario: 1 }] // Ajusta id_horario según sea necesario
            };

            const registro = new Checador(nuevoRegistro);
            await registro.save();
            
            return { success: true, message: 'Registro insertado correctamente.' };
        } else {
            return { success: false, message: 'Fuera del horario permitido.' };
        }
    } catch (error) {
        console.error('Error al registrar en checador', error);
        throw new Error('Error al registrar en checador');
    }
};