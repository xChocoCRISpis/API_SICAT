import { pool } from "../../db/connect.js";
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";

//Función para insertar un encargado
export const insertarEncargado = async (req, res) => {
    const { nombre, apPaterno, apMaterno, idUsuario} = req.body;

    if (!nombre || !apPaterno || !apMaterno || !idUsuario) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    try {
        const [result] = await pool.query(
            "INSERT INTO tb_encargados (Nombre, Ap_paterno, Ap_materno, Id_usuario_fk) VALUES (?, ?, ?, ?)",
            [nombre, apPaterno, apMaterno, idUsuario]
        );

        res.status(201).json({ message: "Encargado insertado correctamente", idEncargado: result.insertId });
    } catch (error) {
        console.error("Error al insertar encargado:", error);
        res.status(500).json({ message: "Error al insertar encargado" });
    }
};


//Inserta un nuevo usuario
export const insertarUsuario = async (req, res) => {
    const { nombre, contrasena, tipo, cadenaQr, imagenQr, correo } = req.body;

    if (!nombre || !contrasena || !tipo || !correo) {
        return res.status(400).json({ message: "Nombre, contraseña, tipo y correo son obligatorios" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO tb_usuarios (Nombre, Contrasena, Tipo, Cadena_qr, Imagen_qr, Correo) VALUES (?, ?, ?, ?, ?, ?)",
            [nombre, contrasena, tipo, cadenaQr, imagenQr, correo]
        );

        res.status(201).json({ message: "Usuario insertado correctamente", idUsuario: result.insertId });
    } catch (error) {
        console.error("Error al insertar usuario:", error);
        res.status(500).json({ message: "Error al insertar usuario" });
    }
};

//Crea un horario nuevo
export const insertarHorario = async (req, res) => {
    const { dia, semestre, year, horaInicio, horaFin } = req.body;

    if (!dia || !horaInicio || !horaFin || !semestre || !year) {
        return res.status(400).json({ message: "Faltan valores" });
    }

    const diaCode = dia+semestre+year;

    try {
        const [result] = await pool.query(
            "INSERT INTO tb_horarios (Dia, Hora_inicio, Hora_fin) VALUES (?, ?, ?)",
            [diaCode, horaInicio, horaFin]
        );

        res.status(201).json({ message: "Horario insertado correctamente", idHorario: result.insertId });
    } catch (error) {
        console.error("Error al insertar horario:", error);
        res.status(500).json({ message: "Error al insertar horario" });
    }
};

//Agrega a un encargado en un horario
export const agregarHorario = async (req, res) => {
    const { idEncargado, idHorario, idActividad } = req.body;

    if (!idEncargado || !idHorario || !idActividad) {
        return res.status(400).json({ message: "ID de encargado, ID de horario e ID de actividad son obligatorios" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO tb_encargados_detalle (Id_encargado_fk, Id_horario_fk, Id_actividad_fk) VALUES (?, ?, ?)",
            [idEncargado, idHorario, idActividad]
        );

        res.status(201).json({ message: "Horario agregado al encargado correctamente" });
    } catch (error) {
        console.error("Error al agregar horario al encargado:", error);
        res.status(500).json({ message: "Error al agregar horario al encargado" });
    }
};



