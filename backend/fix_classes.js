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
    console.log('Connected to database.');

    // 1. Get all teachers
    connection.query('SELECT * FROM teachers', (err, teachers) => {
        if (err) {
            console.error('Error fetching teachers:', err);
            connection.end();
            return;
        }

        if (teachers.length === 0) {
            console.log('No teachers found. Please create a teacher first.');
            connection.end();
            return;
        }

        console.log(`Found ${teachers.length} teachers.`);
        const firstTeacherId = teachers[0].id;

    

        connection.query('SELECT * FROM classes', (err, classes) => {
            if (err) {
                console.error('Error fetching classes:', err);
                connection.end();
                return;
            }

            if (classes.length === 0) {
                console.log('No classes found. Creating sample classes...');
                const sampleClasses = [
                    { name: 'Matemáticas I', time: '08:00 - 09:30', room: 'A-101', days: 'Lun, Mie' },
                    { name: 'Historia Universal', time: '10:00 - 11:30', room: 'B-202', days: 'Mar, Jue' },
                    { name: 'Ciencias Naturales', time: '12:00 - 13:30', room: 'Lab-1', days: 'Vie' }
                ];

                let completed = 0;
                sampleClasses.forEach((cls, index) => {
                    // Assign to teachers in round-robin
                    const teacher = teachers[index % teachers.length];
                    const query = 'INSERT INTO classes (name, time, room, teacher_id, days) VALUES (?, ?, ?, ?, ?)';
                    connection.query(query, [cls.name, cls.time, cls.room, teacher.id, cls.days], (err, result) => {
                        if (err) console.error('Error creating class:', err);
                        else console.log(`Created class ${cls.name} assigned to teacher ID ${teacher.id}`);

                        completed++;
                        if (completed === sampleClasses.length) connection.end();
                    });
                });
            } else {
                console.log(`Found ${classes.length} classes. Updating assignments...`);
                
                let completed = 0;
                classes.forEach((cls, index) => {
                    const teacher = teachers[index % teachers.length];
                    const query = 'UPDATE classes SET teacher_id = ? WHERE id = ?';
                    connection.query(query, [teacher.id, cls.id], (err, result) => {
                        if (err) console.error('Error updating class:', err);
                        else console.log(`Updated class ${cls.name} (ID: ${cls.id}) to teacher ID ${teacher.id}`);

                        completed++;
                        if (completed === classes.length) connection.end();
                    });
                });
            }
        });
    });
});
