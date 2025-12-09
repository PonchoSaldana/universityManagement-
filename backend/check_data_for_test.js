const db = require('./db');

async function checkData() {
    try {
        const studentsPromise = new Promise((resolve, reject) => {
            db.query('SELECT * FROM students', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const classesPromise = new Promise((resolve, reject) => {
            db.query('SELECT * FROM classes', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const [students, classes] = await Promise.all([studentsPromise, classesPromise]);

        console.log('Students:', students.length);
        if (students.length > 0) console.log('First student:', students[0]);

        console.log('Classes:', classes.length);
        if (classes.length > 0) console.log('First class:', classes[0]);

        if (students.length > 0 && classes.length > 0) {
            console.log('Can test enrollment with Student ID:', students[0].id, 'and Class ID:', classes[0].id);
        } else {
            console.log('Not enough data to test enrollment.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // db.end(); // db might not support end() if it's a pool, or might hang. checking db.js to be sure.
        process.exit();
    }
}

checkData();
