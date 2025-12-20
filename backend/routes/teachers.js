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

// Update a teacher
router.put('/:id', (req, res) => {
    const teacherId = req.params.id;
    const { name, email, username, subject, password } = req.body;

    const findUserQuery = 'SELECT user_id FROM teachers WHERE id = ?';
    db.query(findUserQuery, [teacherId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Teacher not found' });

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

            // Update teacher specific data
            const updateTeacherQuery = 'UPDATE teachers SET subject = ? WHERE id = ?';
            db.query(updateTeacherQuery, [subject, teacherId], (err) => {
                if (err) return res.status(500).json({ error: 'Error updating teacher details: ' + err.message });

                res.json({
                    id: teacherId,
                    userId,
                    name,
                    email,
                    username,
                    subject
                });
            });
        });
    });
});

// Delete a teacher
router.delete('/:id', (req, res) => {
    const teacherId = req.params.id;

    const findUserQuery = 'SELECT user_id FROM teachers WHERE id = ?';
    db.query(findUserQuery, [teacherId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Teacher not found' });

        const userId = results[0].user_id;

        // Unassign teacher from classes first
        const unassignClassesQuery = 'UPDATE classes SET teacher_id = NULL WHERE teacher_id = ?';
        db.query(unassignClassesQuery, [teacherId], (err) => {
            if (err) return res.status(500).json({ error: 'Error unassigning classes: ' + err.message });

            // Now delete the user (will cascade delete teacher record)
            const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
            db.query(deleteUserQuery, [userId], (err, result) => {
                if (err) return res.status(500).json({ error: 'Error deleting user: ' + err.message });
                res.json({ message: 'Teacher deleted successfully' });
            });
        });
    });
});

module.exports = router;
