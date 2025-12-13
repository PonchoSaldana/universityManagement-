const db = require('./db');

const queries = [
    "ALTER TABLE enrollments ADD COLUMN p1 DECIMAL(4, 1) DEFAULT NULL;",
    "ALTER TABLE enrollments ADD COLUMN p2 DECIMAL(4, 1) DEFAULT NULL;",
    "ALTER TABLE enrollments ADD COLUMN p3 DECIMAL(4, 1) DEFAULT NULL;",
    "ALTER TABLE enrollments ADD COLUMN final DECIMAL(4, 1) DEFAULT NULL;"
];

const runQueries = async () => {
    for (const query of queries) {
        await new Promise((resolve) => {
            db.query(query, (err) => {
                if (err && err.code !== 'ER_DUP_FIELDNAME') {
                    console.error('Error:', err.message);
                } else {
                    console.log('Query executed or column exists.');
                }
                resolve();
            });
        });
    }
    console.log('Done.');
    process.exit();
};

runQueries();
