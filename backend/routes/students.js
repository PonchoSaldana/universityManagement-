const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all students
router.get('/', (req, res) => {
    const query = `
        SELECT s.*, u.name, u.username, u.email, u.role, u.created_at as registeredAt
        FROM students s
        JOIN users u ON s.user_id = u.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new student
router.post('/', (req, res) => {
    const { name, email, matricula, username, password, grade } = req.body;

    // First create the user
    const userQuery = 'INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(userQuery, [name, username, email, password, 'student'], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const userId = result.insertId;
        const studentQuery = 'INSERT INTO students (user_id, matricula, grade) VALUES (?, ?, ?)';

        db.query(studentQuery, [userId, matricula, grade], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({
                id: result.insertId,
                userId,
                name,
                email,
                matricula,
                grade
            });
        });
    });
});

// Delete a student
router.delete('/:id', (req, res) => {
    const studentId = req.params.id;


    const findUserQuery = 'SELECT user_id FROM students WHERE id = ?';
    db.query(findUserQuery, [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Student not found' });

        const userId = results[0].user_id;
        const deleteUserQuery = 'DELETE FROM users WHERE id = ?';

        db.query(deleteUserQuery, [userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Student deleted successfully' });
        });
    });
});

module.exports = router;
