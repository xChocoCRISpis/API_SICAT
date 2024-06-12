import { pool } from "../../db/connect.js";
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";

export const insertarAlumno = async (req, res) => {
    const {
        Id_actividad,
        Num_control,
        Nombre,
        Ap_paterno,
        Ap_materno,
        Sexo,
        Fecha_nac,
        Semestre,
        Nivel,
        Foto,
        Telefono,
        Correo,
        Id_carrera
    } = req.body;

    try {
        const [results] = await pool.query(
            'CALL sp_Insertar_Alumno_Actividad(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [Id_actividad, Num_control, Nombre, Ap_paterno, Ap_materno, Sexo, Fecha_nac, Semestre, Nivel, Foto, Telefono, Correo, Id_carrera]
        );

        // Acceder al mensaje en la estructura correcta
        if (results.length > 0 && results[0].length > 0 && results[0][0].mensaje) {
            res.status(200).json({ mensaje: results[0][0].mensaje });
        } else {
            res.status(500).json({ error: 'No se pudo obtener el mensaje de la base de datos' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarAlumno = async (req, res) => {
    const {
        Id_alumno,
        Id_actividad,
        Horas,
        Activo,
        Num_control,
        Nombre,
        Ap_paterno,
        Ap_materno,
        Sexo,
        Fecha_nac,
        Semestre,
        Nivel,
        Foto,
        Telefono,
        Correo,
        Id_carrera
    } = req.body;

    try {
        const [results] = await pool.query(
            'CALL sp_Modificar_Alumno_Actividad(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [Id_alumno,Id_actividad,Horas,Activo,Num_control,Nombre,Ap_paterno,Ap_materno,
                Sexo,Fecha_nac,Semestre,Nivel,Foto,Telefono,Correo,Id_carrera]
        );

        // Acceder al mensaje en la estructura correcta
        if (results.length > 0 && results[0].length > 0 && results[0][0].mensaje) {
            res.status(200).json({ mensaje: results[0][0].mensaje });
        } else {
            res.status(500).json({ error: 'No se pudo obtener el mensaje de la base de datos' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getActividadesDeportivas = async (req, res) => {
    let sql = "select * from v_activ_dep;";
    const [rows] = await pool.query(sql);
    if (!rows.length) return res.status(204).json({ message: "empty list" });

    return res.status(200).json({ actividades: rows });
};

export const getActividadesCulturales = async (req, res) => {
    let sql = "select * from v_activ_cul;";
    const [rows] = await pool.query(sql);
    if (!rows.length) return res.status(204).json({ message: "empty list" });

    return res.status(200).json({ actividades: rows });
};