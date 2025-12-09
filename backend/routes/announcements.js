const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all announcements
router.get('/', (req, res) => {
    const query = `
        SELECT a.*, u.name as author_name 
        FROM announcements a
        JOIN users u ON a.author_id = u.id
        ORDER BY a.date DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Create announcement
router.post('/', (req, res) => {
    const { title, content, author_id } = req.body;
    const query = 'INSERT INTO announcements (title, content, author_id) VALUES (?, ?, ?)';
    db.query(query, [title, content, author_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, title, content, author_id, date: new Date() });
    });
});

module.exports = router;
