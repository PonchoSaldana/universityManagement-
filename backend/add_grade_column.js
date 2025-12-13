const db = require('./db');

const query = "ALTER TABLE enrollments ADD COLUMN grade DECIMAL(5, 2) DEFAULT NULL;";

db.query(query, (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column grade already exists in enrollments table.');
        } else {
            console.error('Error adding column:', err);
        }
    } else {
        console.log('Column grade added to enrollments table.');
    }
    process.exit();
});
