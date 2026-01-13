import React, { useState } from 'react';
import { Users, UserRound, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
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
        { label: 'Total Alumnos', value: students.length.toString(), icon: GraduationCap, color: 'var(--primary)' },
        { label: 'Docentes Activos', value: teachers.length.toString(), icon: Users, color: 'var(--text-main)' },
        { label: 'Materias', value: classes.length.toString(), icon: BookOpen, color: 'var(--secondary)' },
    ];

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="mb-2">Panel de Administración</h1>
                <p className="text-muted">Bienvenido de nuevo, Director Alfonso.</p>
            </header>

            <div className="card-grid mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="card p-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <div className="p-3 rounded-lg" style={{
                                background: 'var(--bg-hover)',
                                color: stat.color
                            }}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="card p-6">
                    <h3 className="mb-6">Alumnos Recientes</h3>
                    <div className="flex-col gap-4">
                        {students.slice(0, 5).map((student) => (
                            <div key={student.id} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-hover)' }}>
                                    <UserRound size={20} className="text-muted" />
                                </div>
                                <div>
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-sm text-muted">Grado: {student.grade} • {student.registeredAt ? new Date(student.registeredAt).toLocaleDateString() : 'Fecha desconocida'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card p-6 h-fit">
                    <h3 className="mb-6">Accesos Rápidos</h3>
                    <div className="flex-col gap-3">
                        <button
                            className="btn"
                            style={{
                                background: 'var(--bg-hover)',
                                color: 'var(--text-main)',
                                border: '1px solid var(--border-color)',
                                justifyContent: 'center',
                                width: '100%'
                            }}
                            onClick={() => navigate('/admin/alumnos')}
                        >
                            + Registrar Alumno
                        </button>
                        <button
                            className="btn"
                            style={{
                                background: 'var(--bg-hover)',
                                color: 'var(--text-main)',
                                border: '1px solid var(--border-color)',
                                justifyContent: 'center',
                                width: '100%'
                            }}
                            onClick={() => setIsAnnouncementModalOpen(true)}
                        >
                            + Publicar Aviso
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={isAnnouncementModalOpen} onClose={() => setIsAnnouncementModalOpen(false)} title="Publicar Nuevo Aviso">
                <form onSubmit={handleAnnouncementSubmit} className="flex-col gap-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-muted">Título</label>
                        <input
                            type="text"
                            required
                            className="form-input"
                            value={announcementData.title}
                            onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
                            placeholder="Ej. Suspensión de clases"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-muted">Contenido</label>
                        <textarea
                            required
                            className="form-input"
                            style={{ minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
                            value={announcementData.content}
                            onChange={(e) => setAnnouncementData({ ...announcementData, content: e.target.value })}
                            placeholder="Escribe el contenido del aviso..."
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full justify-center">
                        Publicar Aviso
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
