const cron = require('node-cron');
const db = require('../db');

// Tarea programada para ejecutarse cada hora
// Verifica y elimina anuncios creados hace más de 72 horas
cron.schedule('0 * * * *', () => {
    console.log('Ejecutando limpieza de anuncios expirados...');

    // La consulta elimina registros donde la diferencia de fecha es mayor a 72 horas
    const query = `
        DELETE FROM announcements 
        WHERE date < DATE_SUB(NOW(), INTERVAL 72 HOUR)
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al limpiar anuncios expirados:', err);
        } else {
            if (result.affectedRows > 0) {
                console.log(`Se eliminaron ${result.affectedRows} anuncios expirados.`);
            } else {
                console.log('No se encontraron anuncios expirados para eliminar.');
            }
        }
    });
});

console.log('Servicio de limpieza de anuncios iniciado (cron).');

module.exports = cron;
