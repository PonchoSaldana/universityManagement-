import React from 'react';
import { Book, Award, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const { classes, enrollments, students } = useData();

    // Get student's enrolled classes
    const currentStudent = students.find(s => s.user_id === user?.id);
    const studentId = currentStudent ? currentStudent.id : null;

    const myEnrollments = enrollments ? enrollments.filter(e => e.studentId === studentId) : [];
    const myClasses = myEnrollments.map(e => classes.find(c => c.id === e.classId)).filter(Boolean);

    // Mock grades for the enrolled classes
    const grades = myClasses.map((cls, idx) => ({
        subject: cls.name,
        grade: (8 + Math.random() * 2).toFixed(1), // Random grade between 8.0 and 10.0
        color: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'][idx % 4]
    }));

    const nextClass = myClasses.length > 0 ? myClasses[0] : null;

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Hola, {user?.name || 'Alumno'}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Alumno de {user?.grade || '10° Grado'}</p>
            </header>

            <div className="card-grid">
                <div className="glass-panel" style={{ padding: '2rem', gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Promedio General</h3>
                    <div style={{ display: 'flex', alignItems: 'end', gap: '1rem' }}>
                        <span style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {grades.length > 0 ? (grades.reduce((acc, curr) => acc + parseFloat(curr.grade), 0) / grades.length).toFixed(1) : 'N/A'}
                        </span>
                        <span style={{ color: '#10b981', paddingBottom: '0.5rem', fontWeight: '600' }}>+0.2 vs mes anterior</span>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Siguiente Clase</h3>
                    <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {nextClass ? nextClass.name : 'Sin clases hoy'}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} /> {nextClass ? nextClass.time.split(' - ')[0] : '--:--'}
                    </p>
                </div>
            </div>

            <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Calificaciones Recientes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {grades.length > 0 ? grades.map((item, idx) => (
                    <motion.div
                        key={idx}
                        className="glass-panel"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{ padding: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: item.color }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{item.subject}</h3>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            border: `4px solid ${item.color}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}>
                            {item.grade}
                        </div>
                    </motion.div>
                )) : (
                    <p style={{ color: 'var(--text-muted)' }}>No tienes calificaciones registradas.</p>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
