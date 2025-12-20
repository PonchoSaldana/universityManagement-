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

// Update a student
router.put('/:id', (req, res) => {
    const studentId = req.params.id;
    const { name, email, matricula, username, grade, password } = req.body;

    const findUserQuery = 'SELECT user_id FROM students WHERE id = ?';
    db.query(findUserQuery, [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Student not found' });

        const userId = results[0].user_id;

        // Update user data
        let updateUserQuery = 'UPDATE users SET name = ?, email = ?, username = ?';
        const userParams = [name, email, username];

        if (password && password.trim() !== '') {
            updateUserQuery += ', password = ?';
            userParams.push(password);
        }

        updateUserQuery += ' WHERE id = ?';
        userParams.push(userId);

        db.query(updateUserQuery, userParams, (err) => {
            if (err) return res.status(500).json({ error: 'Error updating user: ' + err.message });

            // Update student specific data
            const updateStudentQuery = 'UPDATE students SET matricula = ?, grade = ? WHERE id = ?';
            db.query(updateStudentQuery, [matricula, grade, studentId], (err) => {
                if (err) return res.status(500).json({ error: 'Error updating student details: ' + err.message });

                res.json({
                    id: studentId,
                    userId,
                    name,
                    email,
                    matricula,
                    username,
                    grade
                });
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

        // Delete enrollments first to avoid foreign key constraint fail
        const deleteEnrollmentsQuery = 'DELETE FROM enrollments WHERE student_id = ?';
        db.query(deleteEnrollmentsQuery, [studentId], (err) => {
            if (err) return res.status(500).json({ error: 'Error deleting enrollments: ' + err.message });

            // Now delete the user (will cascade delete student record)
            const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
            db.query(deleteUserQuery, [userId], (err, result) => {
                if (err) return res.status(500).json({ error: 'Error deleting user: ' + err.message });
                res.json({ message: 'Student deleted successfully' });
            });
        });
    });
});

module.exports = router;
