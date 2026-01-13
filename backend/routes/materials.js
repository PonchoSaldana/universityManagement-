const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists (Absolute path)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all materials
router.get('/', (req, res) => {
    const query = 'SELECT * FROM materials ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Format results to include full URL
        const materials = results.map(m => ({
            ...m,
            // Construct full URL assuming the server serves 'uploads' statically
            url: `/uploads/${path.basename(m.url)}`,
            // Ensure classId is camelCase for frontend consistency
            classId: m.class_id,
            date: m.created_at
        }));

        res.json(materials);
    });
});

// Upload a material
router.post('/', upload.single('file'), (req, res) => {
    const { class_id, title } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct simplified URL for DB (relative to server root is typical, but we store as uploads/filename here for consistency)
    const fileUrl = `uploads/${req.file.filename}`;
    const size = (req.file.size / 1024 / 1024).toFixed(2) + ' MB';
    const type = path.extname(req.file.originalname).substring(1); // e.g. 'pdf'

    const query = 'INSERT INTO materials (class_id, title, type, url, size) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [class_id, title, type, fileUrl, size], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const newMaterial = {
            id: result.insertId,
            classId: parseInt(class_id),
            title,
            type,
            url: `/uploads/${path.basename(fileUrl)}`,
            size,
            date: new Date()
        };

        res.status(201).json(newMaterial);
    });
});

module.exports = router;
