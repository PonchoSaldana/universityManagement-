const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./db');

pool.query("SELECT * FROM users WHERE role = 'admin'", (err, results) => {
    if (err) {
        console.error('Error querying users:', err);
        process.exit(1);
    }
    if (results.length > 0) {
        console.log('Admin users found:');
        results.forEach(user => {
            console.log(`Username: ${user.username}, Password: ${user.password}`);
        });
    } else {
        console.log('No admin users found.');
        // Create default admin
        const defaultAdmin = {
            name: 'Director Alfonso',
            username: 'poncho',
            email: 'admin@school.edu',
            password: 'poncho123', // In a real app, hash this!
            role: 'admin'
        };
        const sql = 'INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)';
        pool.query(sql, [defaultAdmin.name, defaultAdmin.username, defaultAdmin.email, defaultAdmin.password, defaultAdmin.role], (err, result) => {
            if (err) {
                console.error('Error creating default admin:', err);
            } else {
                console.log('Default admin created:');
                console.log(`Username: ${defaultAdmin.username}`);
                console.log(`Password: ${defaultAdmin.password}`);
            }
            process.exit(0);
        });
        return;
    }
    process.exit(0);
});
