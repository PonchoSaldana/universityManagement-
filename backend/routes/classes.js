const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all classes
router.get('/', (req, res) => {
    const query = `
        SELECT c.*, t.user_id as teacher_user_id, u.name as teacher_name
        FROM classes c
        JOIN teachers t ON c.teacher_id = t.id
        JOIN users u ON t.user_id = u.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Create a class
router.post('/', (req, res) => {
    const { name, time, room, teacher_id, days } = req.body;
    const query = 'INSERT INTO classes (name, time, room, teacher_id, days) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, time, room, teacher_id, days], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, name, time, room, teacher_id, days });
    });
});

// Get enrollments
router.get('/enrollments', (req, res) => {
    const query = 'SELECT * FROM enrollments';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Enroll student
router.post('/enrollments', (req, res) => {
    const { student_id, class_id } = req.body;

    // Check if already enrolled
    const checkQuery = 'SELECT * FROM enrollments WHERE student_id = ? AND class_id = ?';
    db.query(checkQuery, [student_id, class_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ error: 'Student already enrolled in this class' });

        const query = 'INSERT INTO enrollments (student_id, class_id) VALUES (?, ?)';
        db.query(query, [student_id, class_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, student_id, class_id });
        });
    });
});

// Update enrollment grade
router.put('/enrollments/:id/grade', (req, res) => {
    const enrollmentId = req.params.id;
    const { p1, p2, p3, final } = req.body;

    const query = 'UPDATE enrollments SET p1 = ?, p2 = ?, p3 = ?, final = ? WHERE id = ?';
    db.query(query, [p1, p2, p3, final, enrollmentId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Grade updated successfully' });
    });
});

module.exports = router;
