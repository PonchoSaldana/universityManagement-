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

// Get assignments by class ID
router.get('/class/:classId', (req, res) => {
    const { classId } = req.params;
    const query = 'SELECT * FROM assignments WHERE class_id = ? ORDER BY created_at DESC';
    db.query(query, [classId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const assignments = results.map(a => ({
            ...a,
            file_url: a.file_url ? `/uploads/${path.basename(a.file_url)}` : null
        }));

        res.json(assignments);
    });
});

// Create a new assignment
router.post('/', upload.single('file'), (req, res) => {
    const { class_id, title, description, due_date } = req.body;

    // Construct simplified URL for DB (relative to server root)
    let fileUrl = null;
    if (req.file) {
        fileUrl = `uploads/${req.file.filename}`;
    }

    const query = 'INSERT INTO assignments (class_id, title, description, due_date, file_url) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [class_id, title, description, due_date, fileUrl], (err, result) => {
        if (err) {
            console.error("Error creating assignment:", err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            id: result.insertId,
            class_id,
            title,
            description,
            due_date,
            file_url: fileUrl ? `/${fileUrl}` : null
        });
    });
});

// Submit an assignment
router.post('/:id/submit', upload.single('file'), (req, res) => {
    const { id } = req.params;
    const { student_id, content } = req.body;

    let fileUrl = null;
    if (req.file) {
        fileUrl = `uploads/${req.file.filename}`;
    }

    const query = 'INSERT INTO assignment_submissions (assignment_id, student_id, content, file_url) VALUES (?, ?, ?, ?)';
    db.query(query, [id, student_id, content, fileUrl], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Submission successful', id: result.insertId });
    });
});

// Get submissions for an assignment
router.get('/:id/submissions', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT s.*, st.name as student_name, u.email as student_email 
        FROM assignment_submissions s
        JOIN students st ON s.student_id = st.id
        JOIN users u ON st.user_id = u.id
        WHERE s.assignment_id = ?
    `;
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const submissions = results.map(s => ({
            ...s,
            file_url: s.file_url ? `/uploads/${path.basename(s.file_url)}` : null
        }));

        res.json(submissions);
    });
});

// Get a specific student's submission for an assignment
router.get('/:id/submission/:studentId', (req, res) => {
    const { id, studentId } = req.params;
    const query = `
        SELECT * FROM assignment_submissions 
        WHERE assignment_id = ? AND student_id = ?
    `;
    db.query(query, [id, studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.json(null);

        const submission = {
            ...results[0],
            file_url: results[0].file_url ? `/uploads/${path.basename(results[0].file_url)}` : null
        };
        res.json(submission);
    });
});

// Grade a submission
router.post('/submissions/:id/grade', (req, res) => {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    const query = 'UPDATE assignment_submissions SET grade = ?, feedback = ? WHERE id = ?';
    db.query(query, [grade, feedback, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Grade updated' });
    });
});

module.exports = router;
