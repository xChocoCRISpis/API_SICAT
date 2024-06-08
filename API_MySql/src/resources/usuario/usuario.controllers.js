import { pool } from "../../db/connect.js";
import axios from 'axios';
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";

export const login = tryCatchWrapper(async (req, res, next) => {
    console.log("Se intentó hacer un login");
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return next(createCustomError("Username and password are required", 400));
    }

    try {
        const [rows] = await pool.query("CALL sp_login(?, ?, @tipo, @idUsuario);", [usuario, contrasena]);
        const [result] = await pool.query("SELECT @tipo AS tipo, @idUsuario AS idUsuario");

        if (result[0].idUsuario === -1) {
            return next(createCustomError("Invalid credentials", 401));
        }

        // Enviar la respuesta inicial
        res.status(200).json({
            idUsuario: result[0].idUsuario,
            tipo: result[0].tipo
        });

        // Realizar la solicitud a la API de MongoDB después de enviar la respuesta inicial
        try {
            const response = await axios.post('http://localhost:9000/crear?id_usuario=' + result[0].idUsuario + '&fecha=08/06/2024&hora=4:14&accion=login');
            // No es necesario enviar otra respuesta, pero puedes registrar la respuesta de MongoDB si lo deseas
            console.log(response.data);
        } catch (error) {
            console.error('Error al consumir la API de MongoDB', error);
        }
    } catch (error) {
        next(createCustomError("Database query failed", 500));
    }
});