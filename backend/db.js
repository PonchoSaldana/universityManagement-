const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const config = {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
};

if (process.env.DATABASE_URL) {
    config.uri = process.env.DATABASE_URL;
} else {
    config.host = process.env.DB_HOST;
    config.user = process.env.DB_USER;
    config.password = process.env.DB_PASSWORD;
    config.database = process.env.DB_NAME;
    config.port = process.env.DB_PORT || 3306;
}

const pool = mysql.createPool(config);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL (Pool)');
        connection.release();
    }
});

module.exports = pool;
