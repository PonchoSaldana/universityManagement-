const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';

    db.query(query, [username, username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

        const user = results[0];

        // In a real app, use bcrypt.compare here
        if (password !== user.password) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        res.json({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role
        });
    });
});

module.exports = router;
