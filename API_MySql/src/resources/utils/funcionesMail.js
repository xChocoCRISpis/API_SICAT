import dotenv from "dotenv";
import nodemailer from 'nodemailer';

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
