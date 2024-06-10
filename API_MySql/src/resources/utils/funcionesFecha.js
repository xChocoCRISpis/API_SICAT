// Función para normalizar las fechas al formato YYYY-MM-DD
export const obtenerDiaYHoraActual = () => {
    const diaSemana = ['D', 'L', 'M', 'X', 'J', 'V', 'S']; // Asumiendo que domingo es 0
    const now = new Date();
    const dia = diaSemana[now.getDay()]; // Día de la semana
    const hora = now.toTimeString().split(' ')[0]; // Hora actual en formato HH:MM:SS

    let periodo = '';
    const mes = now.getMonth() + 1; // Obtener el mes (de 0 a 11, por eso sumamos 1)

    if (mes >= 1 && mes <= 6) {
        periodo = 'EJ';
    } else if (mes >= 8 && mes <= 12) {
        periodo = 'AD';
    }

    const anio = now.getFullYear().toString().slice(-2); // Obtener los últimos dos dígitos del año

    const diaYPeriodo = `${dia}-${periodo}-${anio}`;

    return { diaYPeriodo, hora };
};
