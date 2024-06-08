import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getSingleNote,
  updateNote,
} from "./notes.controllers.js";
console.log("Se importaron las rutas de notes");
const router = express.Router();

router.route("/").get(getAllNotes).post(createNote);
router.route("/:id_alumno_pk").get(getSingleNote).patch(updateNote).delete(deleteNote);

export default router;
