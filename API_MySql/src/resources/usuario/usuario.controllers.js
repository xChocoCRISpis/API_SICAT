import { pool } from "../../db/connect.js";
import axios from 'axios';
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";
//const axios = require('axios');
import { registrarBitacora } from "../peticionesMongo/apiMongo.js";

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

        
       // Registrar la acción en la bitácora
         await registrarBitacora(result[0].idUsuario, 'login');

       // Enviar la respuesta después de completar la solicitud a la API de MongoDB
        res.status(200).json({
            idUsuario: result[0].idUsuario,
            tipo: result[0].tipo
        });
    } catch (error) {
        next(createCustomError("Database query failed", 500));
    }
});