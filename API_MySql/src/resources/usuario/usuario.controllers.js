import { pool } from "../../db/connect.js";
import axios from 'axios';
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";
//const axios = require('axios');
import { registrarBitacora } from "../peticionesMongo/apiMongo.js";
import crypto from 'crypto';
import {transporter} from "../utils/funcionesMail.js"


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
// Método para generar y enviar el token, y actualizar la contraseña
export const enviarTokenYActualizarContrasena = async (correo, idUsuario) => {
    try {
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

        // Configurar el contenido del correo
        const mailOptions = {
            from: 'tu_correo@gmail.com',
            to: correo,
            subject: 'Token de Verificación',
            text: `Tu nueva contraseña temporal es: ${token}`
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        return { success: true, message: 'Token enviado correctamente y contraseña actualizada.' };
    } catch (error) {
        console.error('Error al enviar el token por correo', error);
        throw new Error('Error al enviar el token por correo');
    }
};

// Función para manejar la solicitud de envío de token
export const enviarToken = async (req, res) => {
    const { correo, idUsuario } = req.body;

    try {
        const response = await enviarTokenYActualizarContrasena(correo, idUsuario);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};