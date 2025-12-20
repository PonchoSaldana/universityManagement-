import React from 'react';
import { BookOpen, Users, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
    const { classes, teachers, enrollments, announcements, addAnnouncement } = useData();
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
                            style={{ padding: '1.5rem' }}
                        >
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{
                                    padding: '0.75rem',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    borderRadius: '12px',
                                    color: 'var(--primary)',
                                    fontWeight: 'bold',
                                    minWidth: '100px',
                                    textAlign: 'center',
                                    flexShrink: 0
                                }}>
                                    {cls.time}
                                </div>
                                <div style={{ flex: 1, minWidth: '180px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{cls.name}</h3>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Users size={14} /> {cls.studentCount} alumnos
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <BookOpen size={14} /> {cls.room}
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


            <div className="dashboard-grid">
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Avisos Generales</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target;
                        const title = form.title.value;
                        const content = form.content.value;

                        addAnnouncement({
                            title,
                            content,
                            author_id: user.id
                        });

                        form.reset();
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        <input
                            name="title"
                            placeholder="Título del aviso"
                            className="form-input"
                            required
                        />
                        <textarea
                            name="content"
                            placeholder="Escribe el contenido del aviso..."
                            className="form-input"
                            required
                            rows="3"
                            style={{ resize: 'none' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                            Publicar Aviso
                        </button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {announcements && announcements.length > 0 ? (
                            announcements.map((announcement) => (
                                <div key={announcement.id} style={{ padding: '1rem', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{announcement.title}</h3>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {new Date(announcement.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{announcement.content}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.5rem' }}>
                                        Por: {announcement.author_name || 'Desconocido'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>No hay avisos publicados.</p>
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

export default TeacherDashboard;
