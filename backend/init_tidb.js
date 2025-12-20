const mysql = require('mysql2/promise');

const DATABASE_URL = 'mysql://5vMUe5KYHZrEvxY.root:ZaiGtdDH7Adezepl@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/test';

const schema = `
CREATE DATABASE IF NOT EXISTS escuela_db;
USE test; 

-- Note: TiDB "serverless" usually provides a default DB named "test" or allows creating new ones if privileges allow.
-- The connection string points to "test". We'll use "test" or switch to it.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'student') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    matricula VARCHAR(50) UNIQUE,
    grade VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS glasses_teachers (
    id INT AUTO_INCREMENT PRIMARY KEY 
); 
-- Oops, fixing table name in logic below, standard schema follow-up

CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    time VARCHAR(50),
    room VARCHAR(50),
    teacher_id INT,
    days VARCHAR(50),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    class_id INT,
    p1 DECIMAL(5,2),
    p2 DECIMAL(5,2),
    p3 DECIMAL(5,2),
    final DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    url VARCHAR(255),
    size VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id INT
);
`;

async function initDB() {
    console.log('Connecting to TiDB...');
    const connection = await mysql.createConnection({
        uri: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    console.log('Connected. Initializing schema...');

    // Split schema by known statements (rough split for this specific file content)
    // Actually, let's just run them one by one carefully.

    // We skip CREATE DATABASE since we are connected to 'test' usually

    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'teacher', 'student') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            matricula VARCHAR(50) UNIQUE,
            grade VARCHAR(20),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS teachers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            subject VARCHAR(100),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS classes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            time VARCHAR(50),
            room VARCHAR(50),
            teacher_id INT,
            days VARCHAR(50),
            FOREIGN KEY (teacher_id) REFERENCES teachers(id)
        )`,
        `CREATE TABLE IF NOT EXISTS enrollments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT,
            class_id INT,
            p1 DECIMAL(5,2),
            p2 DECIMAL(5,2),
            p3 DECIMAL(5,2),
            final DECIMAL(5,2),
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (class_id) REFERENCES classes(id)
        )`,
        `CREATE TABLE IF NOT EXISTS materials (
            id INT AUTO_INCREMENT PRIMARY KEY,
            class_id INT,
            title VARCHAR(255) NOT NULL,
            type VARCHAR(50),
            url VARCHAR(255),
            size VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (class_id) REFERENCES classes(id)
        )`,
        `CREATE TABLE IF NOT EXISTS announcements (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            content TEXT NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            author_id INT
        )`,
        // Create Admin User if not exists
        `INSERT IGNORE INTO users (id, name, username, email, password, role) 
         VALUES (1, 'Administrador', 'admin', 'admin@escuela.edu', 'admin123', 'admin')`
    ];

    for (const query of queries) {
        try {
            await connection.query(query);
            console.log('Executed query successfully.');
        } catch (err) {
            console.error('Error executing query:', err.message);
        }
    }

    console.log('Database initialization complete.');
    await connection.end();
}

initDB().catch(console.error);
