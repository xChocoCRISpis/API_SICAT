import express from "express";
import dotenv from "dotenv";
import { notFound } from "./src/middlewares/notFound.js";
import { handleError } from "./src/middlewares/handleError.js";
import notesRoute from "./src/resources/notes/notes.routes.js";
import usuarioRoute from "./src/resources/usuario/usuario.routes.js";
import actividadesRoute from "./src/resources/actividades/actividades.routes.js";

import { testConnection } from "./test-db-connection.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());

//Verificar conexión a DB
testConnection();
// api routes
app.use("/notes", notesRoute);
app.use("/usuario",usuarioRoute);
app.use("/actividades",actividadesRoute);


app.use(notFound);
app.use(handleError);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});