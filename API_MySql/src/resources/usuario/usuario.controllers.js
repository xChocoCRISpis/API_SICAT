import { pool } from "../../db/connect.js";
import { createCustomError } from "../../errors/customErrors.js";
import { tryCatchWrapper } from "../../middlewares/tryCatchWrapper.js";

export const login = tryCatchWrapper(async (req, res, next) => {
    console.log("Se intentó hacer un login");
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return next(createCustomError("Username and password are required", 400));
    }

    try {
        const [rows] = await pool.query("CALL sp_login(?, ?, @tipo, @idUsuario);", [usuario, contrasena]);
        const [result] = await pool.query("SELECT @tipo AS tipo, @idUsuario AS idUsuario");
        try {
            const response = await axios.get('http://localhost:9000/api/crear?id_usuario=' + idUsuario + '&fecha=08/06/2024&hora=4:14&accion=login');
            const mongoItems = response.data;
            res.json(mongoItems);
        } catch (error) {
            res.status(500).send('Error al consumir la API de MongoDB');
        }
        if (result[0].idUsuario === -1) {
            return next(createCustomError("Invalid credentials", 401));
        }

        res.status(200).json({
            idUsuario: result[0].idUsuario,
            tipo: result[0].tipo
        });
        
    }
    
    catch (error) {
        next(createCustomError(`Database query failed: ${error.message}`, 500));
    }
});