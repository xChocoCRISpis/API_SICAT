import axios from 'axios';

// Función para registrar una acción en la bitácora
export const registrarBitacora = async (idUsuario, accion) => {
    try {
        // Obtener la fecha y hora actual
        const now = new Date();
        const fecha = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const hora = now.toTimeString().split(' ')[0]; // Formato HH:MM:SS

        // Realizar la solicitud a la API de MongoDB
        const response = await axios.post('http://localhost:9000/bitacora/crear', {
            id_usuario: idUsuario,
            detalles_bitacora: [{
                fecha: fecha,
                hora: hora,
                accion: accion
            }]
        });

        return response.data;
    } catch (error) {
        console.error('Error al consumir la API de MongoDB', error);
        throw new Error('Error al consumir la API de MongoDB');
    }
};


// Función para hacer un checkout
export const registrarCheck = async (idUsuario, accion) => {
    try {
        // Obtener la fecha y hora actual
        const now = new Date();
        const fecha = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const hora = now.toTimeString().split(' ')[0]; // Formato HH:MM:SS

        // Realizar la solicitud a la API de MongoDB
        const response = await axios.post('http://localhost:9000/bitacora/crear', {
            id_usuario: idUsuario,
            detalles_bitacora: [{
                fecha: fecha,
                hora: hora,
                accion: accion
            }]
        });

        return response.data;
    } catch (error) {
        console.error('Error al consumir la API de MongoDB', error);
        throw new Error('Error al consumir la API de MongoDB');
    }
};

