import { pool } from "../../db/connect.js";
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";

/**
 * @returns note object
 */
async function getNote(id_alumno_pk) {
  console.log("Solicitud datos de un alumno");
  let sql = "call sp_Seleccionar_alumno(?)";
  const [rows] = await pool.query(sql, [id_alumno_pk]);
  return rows[0];
}

/**
 * @description Get All notes
 * @route GET /notes
 */
export const getAllNotes = tryCatchWrapper(async function (req, res, next) {
  let sql = "select * from v_TodosLosAlumnos;";
  console.log("Traje a todos los alumnos bro");
  const [rows] = await pool.query(sql);
  if (!rows.length) return res.status(204).json({ message: "empty list" });

  return res.status(200).json({ notes: rows });
});

/**
 * @description Get Single note
 * @route GET /notes/:id_alumno_pk
 */
export const getSingleNote = tryCatchWrapper(async function (req, res, next) {
  const { id_alumno_pk } = req.params;

  const note = await getNote(id_alumno_pk);
  if (!note) return next(createCustomError("note not found", 404));

  return res.status(200).json(note);
});

/**
 * @description Create note
 * @route POST /notes
 */
export const createNote = tryCatchWrapper(async function (req, res, next) {
  const { id_alumno_pk, num_control, nombre, ap_paterno, ap_materno, sexo, fecha_nac, semestre, nivel, foto, telefono, correo, id_carrera_fk } = req.body;
  console.log('Los valores son: ', req.body);
  if (!id_alumno_pk || !num_control || !nombre || !ap_paterno || !ap_materno || !sexo || !fecha_nac || !semestre || !nivel || !foto || !telefono || !correo || !id_carrera_fk)
    return next(createCustomError("All fields are required", 400));

  let sql = "call sp_Insertar_Alumno (?,?,?,?,?,?,?,?,?,?,?,?,?)";
  await pool.query(sql, [id_alumno_pk, num_control, nombre, ap_paterno, ap_materno, sexo, fecha_nac, semestre, nivel, foto, telefono, correo, id_carrera_fk]);

  return res.status(201).json({ message: "note has been created" });
});

/**
 * @description Update note
 * @route PATCH /notes/:id_alumno_pk
 */
export const updateNote = tryCatchWrapper(async function (req, res, next) {
  const { id_alumno_pk } = req.params;
  const { num_control, nombre, ap_paterno, ap_materno, sexo, fecha_nac, semestre, nivel, foto, telefono, correo, id_carrera_fk } = req.body;

  if (!num_control || !nombre || !ap_paterno || !ap_materno || !sexo || !fecha_nac || !semestre || !nivel || !foto || !telefono || !correo || !id_carrera_fk)
    return next(createCustomError("All fields are required", 400));

  const note = await getNote(id_alumno_pk);
  if (!note) return next(createCustomError("note not found", 404));

  let sql = "CALL sp_Actualizar_Alumno (?,?,?,?,?,?,?,?,?,?,?,?,?)";
  await pool.query(sql, [id_alumno_pk, num_control, nombre, ap_paterno, ap_materno, sexo, fecha_nac, semestre, nivel, foto, telefono, correo, id_carrera_fk]);

  return res.status(201).json({ message: "note has been updated" });
});

/**
 * @description Delete note
 * @route DELETE /notes/:id_alumno_pk
 */
export const deleteNote = tryCatchWrapper(async function (req, res, next) {
  const { id_alumno_pk } = req.params;

  if (!id_alumno_pk) return next(createCustomError("Id is required", 400));

  const note = await getNote(id_alumno_pk);
  if (!note) return next(createCustomError("note not found", 404));

  let sql = "call sp_eliminar_alumno (?)";
  await pool.query(sql, [id_alumno_pk]);

  return res.status(200).json({ message: "note has been deleted" });
});
