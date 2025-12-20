import React, { useState } from 'react';
import { BookOpen, FileText, Download, Clock, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const StudentSubjects = () => {
    const { classes, materials, enrollments, teachers, students } = useData();
    const { user } = useAuth();
    const [selectedClass, setSelectedClass] = useState(null);

    // Get student's enrolled classes
    // We need to find the student record that corresponds to the logged-in user
    const currentStudent = students.find(s => s.user_id === user?.id);
    const studentId = currentStudent ? currentStudent.id : null;

    // Filter enrollments for the current student
    const myEnrollments = enrollments ? enrollments.filter(e => e.studentId === studentId) : [];

    // Map enrollments to classes and add teacher info
    const myClasses = myEnrollments.map(e => {
        const cls = classes.find(c => c.id === e.classId);
        if (!cls) return null;
        const teacher = teachers.find(t => t.id === cls.teacher_id);
        return { ...cls, teacherName: teacher ? teacher.name : 'Sin asignar' };
    }).filter(Boolean);

    const handleClassClick = (cls) => {
        setSelectedClass(cls);
    };

    if (selectedClass) {
        const classMaterials = materials.filter(m => m.classId === selectedClass.id);
        const teacher = teachers.find(t => t.id === selectedClass.teacher_id);

        return (
            <div className="animate-fade-in">
                <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => setSelectedClass(null)}
                        className="btn"
                        style={{
                            background: 'var(--bg-hover)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border-color)',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <span>←</span> Volver
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedClass.name}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedClass.room} • {selectedClass.time}</p>
                    </div>
                </header>

                <div className="dashboard-grid">
                    <div>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Material de Clase</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {classMaterials.length > 0 ? (
                                classMaterials.map((material) => (
                                    <div key={material.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
                                            <div style={{
                                                width: '48px', height: '48px',
                                                borderRadius: '12px',
                                                background: material.type === 'pdf' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: material.type === 'pdf' ? '#ef4444' : '#3b82f6',
                                                flexShrink: 0
                                            }}>
                                                <FileText size={24} />
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{material.title}</h3>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    {new Date(material.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={material.url.startsWith('http') ? material.url : `${import.meta.env.VITE_API_URL || ''}${material.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary"
                                            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Download size={20} />
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <p>No hay materiales disponibles.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Profesor</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {teacher?.name.charAt(0) || 'P'}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <p style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{teacher?.name || 'Profesor Asignado'}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{teacher?.email || 'docente@school.edu'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Mis Materias</h1>
                <p style={{ color: 'var(--text-muted)' }}>Accede a tus clases y materiales de estudio.</p>
            </header>

            <div className="card-grid">
                {myClasses.length > 0 ? (
                    myClasses.map((cls) => (
                        <div
                            key={cls.id}
                            className="glass-panel"
                            style={{ padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => handleClassClick(cls)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.2)', color: 'var(--secondary)' }}>
                                    <BookOpen size={24} />
                                </div>
                                <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--bg-hover)' }}>
                                    <ChevronRight size={20} color="var(--text-muted)" />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{cls.name}</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{cls.room} • {cls.time}</p>
                            <p style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>Docente: {cls.teacherName}</p>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {Array.isArray(cls.days) ? cls.days.join(', ') : cls.days}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center p-8 text-muted" style={{ gridColumn: '1/-1' }}>
                        No estás inscrito en ninguna materia aún.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentSubjects;
