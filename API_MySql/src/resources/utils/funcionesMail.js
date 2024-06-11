import dotenv from "dotenv";
import nodemailer from 'nodemailer';
import { pool } from "../../db/connect.js";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Configurar el transportador de nodemailer
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL, 
        pass: process.env.GMAIL_PASSWORD,
    },
});


// Método para enviar un correo electrónico registrado en la tabla de tb_usuarios
export const enviarCorreoUsuario = async (correo, idUsuario, asunto , mensaje) => {
    try {

        const [results] = await pool.query(
            'SELECT Correo FROM tb_usuarios WHERE correo = ? AND Id_usuario_pk= ?;',
            [correo, idUsuario]
        );

        if (results.affectedRows === 0) {
            throw new Error('Correo o usuario no encontrado en la base de datos');
        }

        // Configurar el contenido del correo
        const mailOptions = {
            from: 'tu_correo@gmail.com',
            to: correo,
            subject: asunto,
            text: mensaje
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        return { success: true, message: `Correo de: '${asunto} enviado correctamente` };
    } catch (error) {
        console.error('Error al enviar  el  correo', error);
        throw new Error('Error al enviar el correo');
    }
};


/*
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

*/