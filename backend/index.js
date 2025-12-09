const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const studentsRoutes = require('./routes/students');
const teachersRoutes = require('./routes/teachers');
const classesRoutes = require('./routes/classes');
const announcementsRoutes = require('./routes/announcements');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/students', studentsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API de Escuela funcionando');
});

// Endpoint de prueba para verificar conexión a DB
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error en la base de datos', details: err.message });
            return;
        }
        res.json({ message: 'Conexión a base de datos exitosa', result: results[0].solution });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
