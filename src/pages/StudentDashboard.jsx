import React from 'react';
import { Book, Award, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const { classes, enrollments, students, announcements } = useData();

    // Get student's enrolled classes
    const currentStudent = students.find(s => s.user_id === user?.id);
    const studentId = currentStudent ? currentStudent.id : null;

    const myEnrollments = enrollments ? enrollments.filter(e => e.studentId === studentId) : [];
    const myClasses = myEnrollments.map(e => classes.find(c => c.id === e.classId)).filter(Boolean);

    // Calculate grades: use final if available, otherwise average of existing partials
    const grades = myEnrollments.map((e) => {
        const cls = classes.find(c => c.id === e.classId);
        if (!cls) return null;

        let gradeValue = null;
        if (e.final !== null) {
            gradeValue = parseFloat(e.final);
        } else {
            const partials = [e.p1, e.p2, e.p3].filter(p => p !== null && p !== undefined && p !== '');
            if (partials.length > 0) {
                gradeValue = partials.reduce((a, b) => a + parseFloat(b), 0) / partials.length;
            }
        }

        return {
            subject: cls.name,
            grade: gradeValue !== null ? gradeValue.toFixed(1) : '-',
            color: gradeValue !== null ? (gradeValue >= 6 ? '#10b981' : '#ef4444') : '#3b82f6'
        };
    }).filter(Boolean);

    const nextClass = myClasses.length > 0 ? myClasses[0] : null;

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Hola, {user?.name || 'Alumno'}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Alumno de {currentStudent?.grade || user?.grade || '10° Grado'}</p>
            </header>

            <div className="card-grid">
                <div className="glass-panel span-2" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Promedio General</h3>
                    <div style={{ display: 'flex', alignItems: 'end', gap: '1rem' }}>
                        <span style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {grades.filter(g => g.grade !== '-').length > 0 ? (grades.filter(g => g.grade !== '-').reduce((acc, curr) => acc + parseFloat(curr.grade), 0) / grades.filter(g => g.grade !== '-').length).toFixed(1) : 'N/A'}
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


            <div className="dashboard-grid">
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Avisos Escolares</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {announcements && announcements.length > 0 ? (
                            announcements.map((announcement) => (
                                <div key={announcement.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{announcement.title}</h3>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {new Date(announcement.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{announcement.content}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.5rem' }}>
                                        Por: {announcement.author_name || 'Dirección'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>No hay avisos recientes.</p>
                        )}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <Calendar size={24} color="var(--primary)" />
                        <h3>Próximos Eventos</h3>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>No hay eventos programados.</p>
                </div>
            </div>
        </div >
    );
};

export default StudentDashboard;
