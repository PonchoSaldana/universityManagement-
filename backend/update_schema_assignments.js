const mysql = require('mysql2/promise');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://5vMUe5KYHZrEvxY.root:ZaiGtdDH7Adezepl@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/test';

async function updateSchema() {
    console.log('Connecting to TiDB...');
    const connection = await mysql.createConnection({
        uri: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Creating assignments table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS assignments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                class_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                due_date DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
            )
        `);

        console.log('Creating assignment_submissions table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS assignment_submissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                assignment_id INT NOT NULL,
                student_id INT NOT NULL,
                content TEXT,
                file_url VARCHAR(500),
                grade DECIMAL(5,2),
                feedback TEXT,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        `);

        console.log('Schema update complete.');
    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await connection.end();
    }
}

updateSchema();
