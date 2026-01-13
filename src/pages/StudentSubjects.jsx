import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, Clock, ChevronRight, Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const StudentSubjects = () => {
    const { classes, materials, enrollments, teachers, students, getAssignments, submitAssignment, getSubmissions } = useData();
    const { user } = useAuth();

    // Global States
    const [selectedClass, setSelectedClass] = useState(null);
    const [activeTab, setActiveTab] = useState('materials');

    // Assignment View State: 'list' or 'details'
    const [assignmentView, setAssignmentView] = useState('list');
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    // Data
    const [assignments, setAssignments] = useState([]);
    const [submissionForm, setSubmissionForm] = useState({ content: '' });

    const currentStudent = students.find(s => s.user_id === user?.id);
    const studentId = currentStudent ? currentStudent.id : null;

    const myEnrollments = enrollments ? enrollments.filter(e => e.studentId === studentId) : [];
    const myClasses = myEnrollments.map(e => {
        const cls = classes.find(c => c.id === e.classId);
        if (!cls) return null;
        const teacher = teachers.find(t => t.id === cls.teacher_id);
        return { ...cls, teacherName: teacher ? teacher.name : 'Sin asignar' };
    }).filter(Boolean);

    useEffect(() => {
        if (selectedClass && activeTab === 'assignments') {
            loadAssignments();
        }
    }, [selectedClass, activeTab]);

    const loadAssignments = async () => {
        if (!selectedClass) return;
        const data = await getAssignments(selectedClass.id);
        setAssignments(data);
    };

    const handleClassClick = (cls) => {
        setSelectedClass(cls);
        setActiveTab('materials');
        setAssignmentView('list');
    };

    const handleOpenSubmission = (assignment) => {
        setSelectedAssignment(assignment);
        setSubmissionForm({ content: '' });
        setAssignmentView('details');
    };

    const handleBackToAssignments = () => {
        setAssignmentView('list');
        setSelectedAssignment(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentStudent) return;

        const formData = new FormData();
        formData.append('student_id', currentStudent.id);
        formData.append('content', submissionForm.content);

        const success = await submitAssignment(selectedAssignment.id, formData);
        if (success) {
            alert('Tarea entregada con éxito');
            handleBackToAssignments();
        } else {
            alert('Error al entregar la tarea');
        }
    };

    // Add logic to check if already submitted (simplified)
    // In a real app we'd fetch submission status for selectedAssignment here.

    if (selectedClass) {
        const classMaterials = materials.filter(m => m.classId === selectedClass.id);
        const teacher = teachers.find(t => t.id === selectedClass.teacher_id);

        return (
            <div className="animate-fade-in">
                {/* Header with Navigation */}
                <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => {
                            if (assignmentView === 'details') {
                                handleBackToAssignments();
                            } else {
                                setSelectedClass(null);
                            }
                        }}
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
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                            {assignmentView === 'details' ? 'Entregar Tarea' : selectedClass.name}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            {assignmentView === 'details' ? selectedClass.name : `${selectedClass.room} • ${selectedClass.time}`}
                        </p>
                    </div>
                </header>

                {/* Tabs - Only show when in list view */}
                {assignmentView === 'list' && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                        <button
                            className={`btn btn-ghost ${activeTab === 'materials' ? 'active' : ''}`}
                            onClick={() => setActiveTab('materials')}
                            style={{
                                borderBottom: activeTab === 'materials' ? '2px solid var(--primary)' : 'none',
                                borderRadius: '5px 5px 0 0',
                                color: activeTab === 'materials' ? 'var(--primary)' : 'var(--text-muted)'
                            }}
                        >
                            Materiales
                        </button>
                        <button
                            className={`btn btn-ghost ${activeTab === 'assignments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('assignments')}
                            style={{
                                borderBottom: activeTab === 'assignments' ? '2px solid var(--primary)' : 'none',
                                borderRadius: '5px 5px 0 0',
                                color: activeTab === 'assignments' ? 'var(--primary)' : 'var(--text-muted)'
                            }}
                        >
                            Tareas
                        </button>
                    </div>
                )}

                <div className="dashboard-grid">
                    <div style={{ flex: 2 }}>
                        {/* Assignment Details View (The "New Tab" / Full Page View) */}
                        {assignmentView === 'details' && selectedAssignment ? (
                            <div className="animate-fade-in">
                                <div className="glass-panel p-8">
                                    <h2 className="text-2xl font-bold mb-4">{selectedAssignment.title}</h2>

                                    <div className="flex gap-4 mb-6 text-sm text-muted">
                                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                                            Asignado: {new Date(selectedAssignment.created_at || Date.now()).toLocaleDateString()}
                                        </span>
                                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
                                            Vence: {new Date(selectedAssignment.due_date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="mb-8 p-6 bg-hover rounded-xl border border-border">
                                        <h3 className="font-semibold mb-2">Instrucciones</h3>
                                        <p className="text-lg whitespace-pre-wrap">{selectedAssignment.description}</p>

                                        {selectedAssignment.file_url && (
                                            <div className="mt-6 pt-4 border-t border-border">
                                                <a
                                                    href={`${import.meta.env.VITE_API_URL || ''}${selectedAssignment.file_url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 btn btn-secondary"
                                                >
                                                    <Download size={18} /> Descargar Material Adjunto
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                        <div>
                                            <label className="block mb-2 font-medium">Tu Entrega</label>
                                            <p className="text-sm text-muted mb-2">Escribe tus comentarios o respuestas a la tarea aquí.</p>
                                            <textarea
                                                className="form-input w-full p-4 text-base"
                                                value={submissionForm.content}
                                                onChange={e => setSubmissionForm({ ...submissionForm, content: e.target.value })}
                                                style={{ minHeight: '200px' }}
                                                placeholder="Escribe aquí tu respuesta..."
                                                required
                                            />
                                        </div>

                                        <div className="flex gap-4 items-center mt-4">
                                            <button type="submit" className="btn btn-primary px-8 py-3 text-lg">
                                                <CheckCircle size={20} className="mr-2" />
                                                Entregar Tarea
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleBackToAssignments}
                                                className="btn btn-ghost"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            /* Normal View (Materials or List of Assignments) */
                            <>
                                {activeTab === 'materials' ? (
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
                                ) : (
                                    <div>
                                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Tareas Asignadas</h2>
                                        <div className="flex flex-col gap-4">
                                            {assignments.length > 0 ? (
                                                assignments.map(assignment => (
                                                    <div key={assignment.id} className="glass-panel p-6 cursor-pointer hover:shadow-lg transition-all" onClick={() => handleOpenSubmission(assignment)}>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h3 className="text-xl font-semibold mb-2">{assignment.title}</h3>
                                                                <p className="text-muted text-sm mb-4 line-clamp-2">{assignment.description}</p>

                                                                <div className="mt-2 text-xs bg-red-100 text-red-500 px-2 py-1 rounded inline-block">
                                                                    Vence: {new Date(assignment.due_date).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                            <div className="btn btn-primary self-center">
                                                                Ver Tarea
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="glass-panel p-12 text-center text-muted">
                                                    No hay tareas pendientes.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Sidebar Information - Hide in Details View or Keep it? Let's hide to focus on task */}
                    {assignmentView === 'list' && (
                        <div style={{ flex: 1 }}>
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
                    )}
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
