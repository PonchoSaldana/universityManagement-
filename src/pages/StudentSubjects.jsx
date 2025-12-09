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
                        <h2 style={{ marginBottom: '1.5rem' }}>Material de Clase</h2>
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
                                    <p>No hay materiales disponibles.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3>Profesor</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {teacher?.name.charAt(0) || 'P'}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '500' }}>{teacher?.name || 'Profesor Asignado'}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{teacher?.email || 'docente@school.edu'}</p>
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
                                <ChevronRight color="var(--text-muted)" />
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
