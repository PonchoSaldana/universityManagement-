const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'escuela_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Connection error:', err);
        process.exit(1);
    }

    connection.query('SELECT * FROM users WHERE role="teacher"', (err, users) => {
        if (err) throw err;
        console.log('Teacher Users:', users);

        connection.query('SELECT * FROM teachers', (err, teachers) => {
            if (err) throw err;
            console.log('Teachers Table:', teachers);

            connection.query('SELECT * FROM classes', (err, classes) => {
                if (err) throw err;
                console.log('Classes Table:', classes);
                connection.end();
            });
        });
    });
});
