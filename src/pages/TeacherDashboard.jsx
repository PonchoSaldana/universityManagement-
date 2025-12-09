import React from 'react';
import { BookOpen, Users, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
    const { classes, teachers, enrollments } = useData();
    const { user } = useAuth();

    // Filter classes for the current logged-in teacher
    const currentTeacher = teachers.find(t => t.user_id === user.id);
    const teacherId = currentTeacher ? currentTeacher.id : null;

    const myClasses = classes.filter(c => c.teacher_id === teacherId).map(c => ({
        ...c,
        studentCount: enrollments ? enrollments.filter(e => e.classId === c.id).length : 0
    }));

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Panel Docente</h1>
                <p style={{ color: 'var(--text-muted)' }}>Bienvenido, {user.name}.</p>
            </header>

            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <div className="glass-panel stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p className="stat-label">Clases Asignadas</p>
                            <p className="stat-value">{myClasses.length}</p>
                        </div>
                        <BookOpen color="var(--primary)" />
                    </div>
                </div>
                <div className="glass-panel stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p className="stat-label">Total Alumnos</p>
                            <p className="stat-value">{myClasses.reduce((acc, curr) => acc + curr.studentCount, 0)}</p>
                        </div>
                        <Users color="var(--secondary)" />
                    </div>
                </div>
            </div>

            <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Mi Horario de Clases</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {myClasses.length > 0 ? (
                    myClasses.map((cls, idx) => (
                        <motion.div
                            key={idx}
                            className="glass-panel"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
                                <div style={{
                                    padding: '1rem',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    borderRadius: '12px',
                                    color: 'var(--primary)',
                                    fontWeight: 'bold',
                                    minWidth: '120px',
                                    textAlign: 'center'
                                }}>
                                    {cls.time}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <h3 style={{ margin: 0 }}>{cls.name}</h3>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {Array.isArray(cls.days) ? cls.days.map(day => (
                                                <span key={day} style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '4px',
                                                    background: 'var(--bg-card)',
                                                    border: '1px solid var(--border-color)'
                                                }}>
                                                    {day}
                                                </span>
                                            )) : (
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '4px',
                                                    background: 'var(--bg-card)',
                                                    border: '1px solid var(--border-color)'
                                                }}>
                                                    {cls.days}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Users size={16} /> {cls.studentCount} alumnos
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <BookOpen size={16} /> {cls.room}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No tienes clases asignadas actualmente.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
