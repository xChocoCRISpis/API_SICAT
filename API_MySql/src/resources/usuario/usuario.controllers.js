import { pool } from "../../db/connect.js";
import axios from 'axios';
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";
//const axios = require('axios');
import { registrarBitacora } from "../peticionesMongo/apiMongo.js";
import crypto from 'crypto';
import {transporter, enviarCorreoUsuario} from "../utils/funcionesMail.js"


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

/*
// Configurar el transportador de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL, // Reemplaza con tu correo
        pass: process.env.GMAIL_PASSWORD,       // Reemplaza con tu contraseña
    },
});
*/

// Función para manejar la solicitud de envío de token
export const enviarToken = async (req, res) => {
    const { correo, idUsuario } = req.body;

    // Generar un token aleatorio
    const token = crypto.randomBytes(20).toString('hex');

     // Actualizar la contraseña en la base de datos asociada al correo
    const [results] = await pool.query(
        'UPDATE tb_usuarios SET Contrasena = ? WHERE Correo = ? AND Id_usuario_pk = ?',
        [token, correo, idUsuario]
    );

    if (results.affectedRows === 0) {
        throw new Error('Correo o usuario no encontrado en la base de datos');
    }
    try {
        const response = await enviarCorreoUsuario(correo,idUsuario,'Token de Verificación',`Tu nueva contraseña temporal es: ${token}`);;
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const cambiarConstrasena = tryCatchWrapper(async (req, res, next) => {
    const { idUsuario, contrasenaVieja, contrasenaNueva } = req.body;

    if (!idUsuario || !contrasenaVieja || !contrasenaNueva) {
        return next(createCustomError("Username and password are required", 400));
    }
    try{
    const [result] = await pool.query("UPDATE tb_usuarios SET Contrasena = ? WHERE id_usuario_pk = ? AND Contrasena = ?;", [contrasenaNueva, idUsuario, contrasenaVieja]);

        // Verificar si se afectó alguna fila
        if (result.affectedRows === 0) {
            return next(createCustomError("User not found or password not changed", 404));
        }

        // Registrar la acción en la bitácora
        await registrarBitacora(idUsuario, 'Cambio de contraseña');

        // Enviar la respuesta después de completar la solicitud a la API de MongoDB
        res.status(200).json({
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(createCustomError("Database query failed", 500));
    }
});

// Función para obtener datos del perfil
export const getDatosPerfil = tryCatchWrapper(async (req, res, next) => {
    const { idUsuario } = req.params;
    if (!idUsuario) {
        return next(createCustomError("User ID is required", 400));
    }

    try {
        const [rows] = await pool.query("CALL sp_Datos_Perfil(?);", [idUsuario]);

        if (rows.length === 0) {
            return next(createCustomError("No data found for the given user ID", 404));
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        next(createCustomError("Database query failed", 500));
    }
});


export const getHorariosPerfil = tryCatchWrapper(async (req, res, next) => {
    const { idUsuario } = req.params;

    if (!idUsuario) {
        return next(createCustomError("User ID is required", 400));
    }

    try {
        const [rows] = await pool.query("CALL sp_Horarios_perfil(?);", [idUsuario]);

        if (rows.length === 0) {
            return next(createCustomError("No data found for the given user ID", 404));
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        next(createCustomError("Database query failed", 500));
    }
});