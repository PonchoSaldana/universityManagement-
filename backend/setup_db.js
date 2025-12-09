const mysql = require('mysql2');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Connect without database selected to create it if needed
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true // Allow multiple statements
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL server:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL server.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // We can execute the whole schema at once if multipleStatements is true
    connection.query(schema, (err, results) => {
        if (err) {
            console.error('Error executing schema:', err);
        } else {
            console.log('Database setup complete. Schema executed.');
        }
        connection.end();
    });
});
