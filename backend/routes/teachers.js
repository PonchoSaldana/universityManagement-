const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all teachers
router.get('/', (req, res) => {
    const query = `
        SELECT t.*, u.name, u.email, u.role 
        FROM teachers t
        JOIN users u ON t.user_id = u.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new teacher
router.post('/', (req, res) => {
    const { name, username, email, password, subject } = req.body;

    const userQuery = 'INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(userQuery, [name, username, email, password, 'teacher'], (err, result) => {
        if (err) {
            console.error('Error creating user for teacher:', err);
            return res.status(500).json({ error: err.message });
        }

        const userId = result.insertId;
        const teacherQuery = 'INSERT INTO teachers (user_id, subject) VALUES (?, ?)';

        db.query(teacherQuery, [userId, subject], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({
                id: result.insertId,
                userId,
                name,
                email,
                subject
            });
        });
    });
});

module.exports = router;
