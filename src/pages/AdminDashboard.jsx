import React, { useState } from 'react';
import { Users, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const AdminDashboard = () => {
    const { students, teachers, classes, addAnnouncement } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [announcementData, setAnnouncementData] = useState({ title: '', content: '' });

    const handleAnnouncementSubmit = (e) => {
        e.preventDefault();
        addAnnouncement({ ...announcementData, author_id: user.id || 1 });
        setAnnouncementData({ title: '', content: '' });
        setIsAnnouncementModalOpen(false);
    };

    const stats = [
        { label: 'Total Alumnos', value: students.length.toString(), icon: GraduationCap, color: '#ec4899' },
        { label: 'Docentes Activos', value: teachers.length.toString(), icon: Users, color: '#6366f1' },
        { label: 'Materias', value: classes.length.toString(), icon: BookOpen, color: '#8b5cf6' },
        { label: 'Asistencia Hoy', value: '0%', icon: TrendingUp, color: '#10b981' },
    ];

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Panel de Administración</h1>
                <p style={{ color: 'var(--text-muted)' }}>Bienvenido de nuevo, Director Alfonso.</p>
            </header>

            <div className="card-grid">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="glass-panel stat-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <p className="stat-label">{stat.label}</p>
                                <p className="stat-value">{stat.value}</p>
                            </div>
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '12px',
                                background: `${stat.color}20`,
                                color: stat.color
                            }}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Alumnos Recientes</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {students.slice(0, 5).map((student) => (
                            <div key={student.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={20} color="var(--text-muted)" />
                                </div>
                                <div>
                                    <p style={{ fontWeight: '500' }}>{student.name}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Grado: {student.grade} • {student.registeredAt ? new Date(student.registeredAt).toLocaleDateString() : 'Fecha desconocida'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Accesos Rápidos</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button
                            className="btn btn-secondary"
                            style={{ width: '100%', justifyContent: 'flex-start' }}
                            onClick={() => navigate('/admin/alumnos')}
                        >
                            + Registrar Alumno
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ width: '100%', justifyContent: 'flex-start' }}
                            onClick={() => setIsAnnouncementModalOpen(true)}
                        >
                            + Publicar Aviso
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={isAnnouncementModalOpen} onClose={() => setIsAnnouncementModalOpen(false)} title="Publicar Nuevo Aviso">
                <form onSubmit={handleAnnouncementSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Título</label>
                        <input
                            type="text"
                            required
                            className="glass-panel"
                            style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={announcementData.title}
                            onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
                            placeholder="Ej. Suspensión de clases"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Contenido</label>
                        <textarea
                            required
                            className="glass-panel"
                            style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)', minHeight: '100px' }}
                            value={announcementData.content}
                            onChange={(e) => setAnnouncementData({ ...announcementData, content: e.target.value })}
                            placeholder="Escribe el contenido del aviso..."
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                        Publicar Aviso
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
