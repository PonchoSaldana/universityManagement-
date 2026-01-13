const mysql = require('mysql2/promise');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://5vMUe5KYHZrEvxY.root:ZaiGtdDH7Adezepl@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/test';

async function addFileColumnToAssignments() {
    console.log('Connecting to TiDB...');
    const connection = await mysql.createConnection({
        uri: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Adding file_url column to assignments table...');
        // Check if column exists strictly speaking isn't easy in one query without information_schema, 
        // but adding it with a separate script is fine. If it exists, it might error or be fine depending on DB.
        // We'll try to add it.
        try {
            await connection.query(`
                ALTER TABLE assignments
                ADD COLUMN file_url VARCHAR(500)
            `);
            console.log('Column file_url added to assignments table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Column file_url already exists.');
            } else {
                throw err;
            }
        }

    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await connection.end();
    }
}

addFileColumnToAssignments();
