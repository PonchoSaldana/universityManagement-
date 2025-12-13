const express = require('express');
const router = express.Router();
const db = require('../db');

// Update user profile
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, password, newPassword } = req.body;

    // First check if user exists and password is correct (if changing sensitive info)
    // For simplicity, we'll verify password if provided, or just update if "admin" mode implied.
    // However, the UI asks for "Current Password" so we should verify it.

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = results[0];

        // Verify current password if provided (it should be for security)
        if (password && password !== user.password) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        const updatedName = name || user.name;
        const updatedEmail = email || user.email;
        const updatedPassword = newPassword || user.password;

        const updateQuery = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
        db.query(updateQuery, [updatedName, updatedEmail, updatedPassword, userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Return updated user info
            res.json({
                id: userId,
                name: updatedName,
                email: updatedEmail,
                role: user.role
            });
        });
    });
});

module.exports = router;
