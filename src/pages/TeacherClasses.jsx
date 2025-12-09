import React, { useState } from 'react';
import { BookOpen, FileText, Upload, Download, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const TeacherClasses = () => {
    const { classes, materials, addMaterial, enrollments, teachers } = useData();
    const { user } = useAuth();
    const [selectedClass, setSelectedClass] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', type: 'pdf' });

    // Filter classes for the current logged-in teacher
    const currentTeacher = teachers.find(t => t.user_id === user.id);
    const teacherId = currentTeacher ? currentTeacher.id : null;

    const myClasses = classes.filter(c => c.teacher_id === teacherId).map(c => ({
        ...c,
        studentCount: enrollments ? enrollments.filter(e => e.classId === c.id).length : 0
    }));

    const handleClassClick = (cls) => {
        setSelectedClass(cls);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        addMaterial({
            classId: selectedClass.id,
            title: formData.title,
            type: formData.type,
            size: formData.size || '1.0 MB'
        });
        setFormData({ title: '', type: 'pdf' });
        setIsModalOpen(false);
    };

    if (selectedClass) {
        const classMaterials = materials.filter(m => m.classId === selectedClass.id);

        return (
            <div className="animate-fade-in">
                <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => setSelectedClass(null)}
                        className="btn btn-secondary"
                    >
                        ← Volver
                    </button>
                    <div>
                        <h1>{selectedClass.name}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{selectedClass.room} • {selectedClass.time}</p>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2>Material de Clase</h2>
                            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                                <Upload size={18} />
                                Subir Archivo
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {classMaterials.length > 0 ? (
                                classMaterials.map((material) => (
                                    <div key={material.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '48px', height: '48px',
                                                borderRadius: '12px',
                                                background: material.type === 'pdf' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: material.type === 'pdf' ? '#ef4444' : '#3b82f6'
                                            }}>
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{material.title}</h3>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    {new Date(material.date).toLocaleDateString()} • {material.size}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                            <Download size={20} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Upload size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p>No hay materiales subidos aún.</p>
                                    <p style={{ fontSize: '0.9rem' }}>Sube archivos para tus alumnos.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3>Próximas Tareas</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No hay tareas pendientes.</p>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3>Avisos Recientes</h3>
                            <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid var(--primary)' }}>
                                <p style={{ fontWeight: '500' }}>Examen Parcial</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Recuerden estudiar el capítulo 3 para el próximo martes.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Subir Material">
                    <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Título del Material</label>
                            <input
                                type="text"
                                required
                                className="glass-panel"
                                style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ej. Guía de Estudio"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Seleccionar Archivo</label>
                            <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', width: '100%' }}>
                                <input
                                    type="file"
                                    required
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFormData({
                                                ...formData,
                                                file: file,
                                                type: file.name.split('.').pop(),
                                                size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
                                            });
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                            Subir Archivo
                        </button>
                    </form>
                </Modal>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Mis Clases</h1>
                <p style={{ color: 'var(--text-muted)' }}>Selecciona una clase para gestionar materiales.</p>
            </header>

            <div className="card-grid">
                {myClasses.map((cls) => (
                    <div
                        key={cls.id}
                        className="glass-panel"
                        style={{ padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => handleClassClick(cls)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>
                                <BookOpen size={24} />
                            </div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={14} /> {cls.time}
                            </span>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{cls.name}</h2>
                        <p style={{ color: 'var(--text-muted)' }}>{cls.room} • {cls.studentCount} Alumnos</p>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {Array.isArray(cls.days) ? cls.days.map(day => (
                                <span key={day} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                                    {day}
                                </span>
                            )) : (
                                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                                    {cls.days}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherClasses;
