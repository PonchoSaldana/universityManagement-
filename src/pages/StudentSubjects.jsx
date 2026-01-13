import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, Clock, ChevronRight, Upload, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const StudentSubjects = () => {
    const { classes, materials, enrollments, teachers, students, getAssignments, submitAssignment, getSubmissions } = useData();
    const { user } = useAuth();

    const [selectedClass, setSelectedClass] = useState(null);
    const [activeTab, setActiveTab] = useState('materials');

    const [assignments, setAssignments] = useState([]);
    const [submissionStatus, setSubmissionStatus] = useState({}); // { [assignmentId]: 'submitted' | 'pending' | grade }

    // Submission Modal
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionForm, setSubmissionForm] = useState({ content: '', file: null });

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

        // Check submission status for each
        // This is not efficient (N+1 reqs) but works for now. 
        // Better: Fetch all submissions for STUDENT in CLASS in one go.
        // For MVP, checking status one by one or assuming "view" details will fetch it.
        // Actually, let's just fetch student's submission when they click to view details/submit.
        // Or finding a way to mark "submitted".
    };

    const handleClassClick = (cls) => {
        setSelectedClass(cls);
        setActiveTab('materials');
    };

    const openSubmitModal = (assignment) => {
        setSelectedAssignment(assignment);
        setSubmissionForm({ content: '', file: null });
        setIsSubmitModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentStudent) return;

        const formData = new FormData();
        formData.append('student_id', currentStudent.id);
        formData.append('content', submissionForm.content);
        if (submissionForm.file) {
            formData.append('file', submissionForm.file);
        }

        const success = await submitAssignment(selectedAssignment.id, formData);
        if (success) {
            alert('Tarea entregada con éxito');
            setIsSubmitModalOpen(false);
            // Optionally refresh status
        } else {
            alert('Error al entregar la tarea');
        }
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

                {/* Tabs */}
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

                <div className="dashboard-grid">
                    <div style={{ flex: 2 }}>
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
                                            <div key={assignment.id} className="glass-panel p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-semibold mb-2">{assignment.title}</h3>
                                                        <p className="text-muted text-sm mb-4">{assignment.description}</p>
                                                        <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded">
                                                            Vence: {new Date(assignment.due_date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => openSubmitModal(assignment)}
                                                    >
                                                        <Upload size={16} /> Entregar
                                                    </button>
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
                    </div>

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
                </div>

                <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title={`Entregar: ${selectedAssignment?.title}`}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block mb-2 text-sm text-muted">Comentarios / Respuesta de Texto</label>
                            <textarea
                                className="form-input"
                                value={submissionForm.content}
                                onChange={e => setSubmissionForm({ ...submissionForm, content: e.target.value })}
                                style={{ minHeight: '100px' }}
                                placeholder="Escribe aquí tu respuesta..."
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm text-muted">Adjuntar Archivo (Opcional)</label>
                            <input
                                type="file"
                                className="form-input"
                                onChange={e => setSubmissionForm({ ...submissionForm, file: e.target.files[0] })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary justify-center">
                            Enviar Tarea
                        </button>
                    </form>
                </Modal>
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
