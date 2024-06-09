// Función para normalizar las fechas al formato YYYY-MM-DD
const normalizarFecha = (fecha) => {
    const partes = fecha.split(/[-\/]/);
    if (partes.length === 3) {
        if (partes[0].length === 4) {
            return fecha; // Ya está en formato YYYY-MM-DD
        } else {
            return `${partes[2]}-${partes[1]}-${partes[0]}`; // Convertir de DD/MM/YYYY a YYYY-MM-DD
        }
    }
    return fecha;
};

// Exportar la función
module.exports = {
    normalizarFecha
};