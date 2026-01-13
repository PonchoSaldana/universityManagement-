import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Upload, Download, Clock, Plus, CheckCircle, User } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const TeacherClasses = () => {
    const {
        classes,
        materials,
        addMaterial,
        enrollments,
        teachers,
        addAssignment,
        getAssignments,
        getSubmissions,
        gradeSubmission
    } = useData();
    const { user } = useAuth();

    // Selection states
    const [selectedClass, setSelectedClass] = useState(null);
    const [activeTab, setActiveTab] = useState('materials'); // 'materials' | 'assignments'

    // Data states for current view
    const [classAssignments, setClassAssignments] = useState([]);

    // Modals
    const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);

    // Form data
    const [materialForm, setMaterialForm] = useState({ title: '', file: null });
    const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', due_date: '' });

    // Submissions viewing
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [submissionsList, setSubmissionsList] = useState([]);
    const [gradingData, setGradingData] = useState({}); // { [submissionId]: { grade: '', feedback: '' } }

    // Filter classes for the current logged-in teacher
    const currentTeacher = teachers.find(t => t.user_id === user.id);
    const teacherId = currentTeacher ? currentTeacher.id : null;

    const myClasses = classes.filter(c => c.teacher_id === teacherId).map(c => ({
        ...c,
        studentCount: enrollments ? enrollments.filter(e => e.classId === c.id).length : 0
    }));

    useEffect(() => {
        if (selectedClass && activeTab === 'assignments') {
            loadAssignments();
        }
    }, [selectedClass, activeTab]);

    const loadAssignments = async () => {
        if (!selectedClass) return;
        const data = await getAssignments(selectedClass.id);
        setClassAssignments(data);
    };

    const handleClassClick = (cls) => {
        setSelectedClass(cls);
        setActiveTab('materials'); // Default tab
    };

    const handleMaterialUpload = async (e) => {
        e.preventDefault();
        if (!materialForm.file) return;

        const data = new FormData();
        data.append('class_id', selectedClass.id);
        data.append('title', materialForm.title);
        data.append('file', materialForm.file);

        const success = await addMaterial(data);
        if (success) {
            setMaterialForm({ title: '', file: null });
            setIsMaterialModalOpen(false);
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        const success = await addAssignment({
            class_id: selectedClass.id,
            ...assignmentForm
        });

        if (success) {
            setAssignmentForm({ title: '', description: '', due_date: '' });
            setIsAssignmentModalOpen(false);
            loadAssignments();
        }
    };

    const handleViewSubmissions = async (assignment) => {
        setCurrentAssignment(assignment);
        const data = await getSubmissions(assignment.id);
        setSubmissionsList(data);

        // Initialize local grading state
        const initialGrading = {};
        data.forEach(s => {
            initialGrading[s.id] = { grade: s.grade || '', feedback: s.feedback || '' };
        });
        setGradingData(initialGrading);

        setIsSubmissionsModalOpen(true);
    };

    const handleGradeSubmit = async (submissionId) => {
        const data = gradingData[submissionId];
        const success = await gradeSubmission(submissionId, data);
        if (success) {
            // Refresh submissions to show it's saved (optional, or just show toast)
            alert('Calificación guardada');
        }
    };

    if (selectedClass) {
        return (
            <div className="animate-fade-in">
                {/* Header */}
                <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setSelectedClass(null)}
                        className="btn btn-secondary"
                    >
                        ← Volver
                    </button>
                    <div>
                        <h1 style={{ wordBreak: 'break-word', fontSize: 'clamp(1.5rem, 5vw, 2.25rem)' }}>{selectedClass.name}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{selectedClass.room} • {selectedClass.time}</p>
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
                        Tareas y Actividades
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'materials' ? (
                    <div className="dashboard-grid">
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Material de Clase</h2>
                                <button className="btn btn-primary" onClick={() => setIsMaterialModalOpen(true)}>
                                    <Upload size={18} />
                                    Subir Archivo
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {materials.filter(m => m.classId === selectedClass.id).length > 0 ? (
                                    materials.filter(m => m.classId === selectedClass.id).map((material) => (
                                        <div key={material.id} className="glass-panel p-4 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${material.type === 'pdf' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`} style={{ background: material.type === 'pdf' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: material.type === 'pdf' ? '#ef4444' : '#3b82f6' }}>
                                                    <FileText size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg mb-1">{material.title}</h3>
                                                    <p className="text-sm text-muted">
                                                        {new Date(material.date).toLocaleDateString()} • {material.size}
                                                    </p>
                                                </div>
                                            </div>
                                            <a href={`${import.meta.env.VITE_API_URL || ''}${material.url}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                                <Download size={20} />
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted text-center p-8">No hay materiales subidos aún.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Actividades Asignadas</h2>
                            <button className="btn btn-primary" onClick={() => setIsAssignmentModalOpen(true)}>
                                <Plus size={18} />
                                Nueva Tarea
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {classAssignments.length > 0 ? (
                                classAssignments.map((assignment) => (
                                    <div key={assignment.id} className="glass-panel p-6 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{assignment.title}</h3>
                                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{assignment.description}</p>
                                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                                                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}>
                                                        Vence: {new Date(assignment.due_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => handleViewSubmissions(assignment)}
                                            >
                                                Ver Entregas
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center p-8">No hay tareas asignadas.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Modals */}
                <Modal isOpen={isMaterialModalOpen} onClose={() => setIsMaterialModalOpen(false)} title="Subir Material">
                    <form onSubmit={handleMaterialUpload} className="flex flex-col gap-4">
                        <div>
                            <label className="block mb-2 text-sm text-muted">Título</label>
                            <input type="text" className="form-input" required value={materialForm.title} onChange={e => setMaterialForm({ ...materialForm, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm text-muted">Archivo</label>
                            <input type="file" className="form-input" required onChange={e => setMaterialForm({ ...materialForm, file: e.target.files[0] })} />
                        </div>
                        <button type="submit" className="btn btn-primary justify-center">Subir</button>
                    </form>
                </Modal>

                <Modal isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)} title="Nueva Tarea">
                    <form onSubmit={handleCreateAssignment} className="flex flex-col gap-4">
                        <div>
                            <label className="block mb-2 text-sm text-muted">Título</label>
                            <input type="text" className="form-input" required value={assignmentForm.title} onChange={e => setAssignmentForm({ ...assignmentForm, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm text-muted">Descripción</label>
                            <textarea className="form-input" required value={assignmentForm.description} onChange={e => setAssignmentForm({ ...assignmentForm, description: e.target.value })} style={{ minHeight: '100px' }} />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm text-muted">Fecha de Vencimiento</label>
                            <input type="date" className="form-input" required value={assignmentForm.due_date} onChange={e => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-primary justify-center">Crear Tarea</button>
                    </form>
                </Modal>

                <Modal isOpen={isSubmissionsModalOpen} onClose={() => setIsSubmissionsModalOpen(false)} title={`Entregas: ${currentAssignment?.title}`}>
                    <div className="flex flex-col gap-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {submissionsList.length === 0 ? (
                            <p className="text-muted text-center">Nadie ha entregado aún.</p>
                        ) : (
                            submissionsList.map(sub => (
                                <div key={sub.id} className="p-4 rounded-xl border border-border" style={{ borderColor: 'var(--border-color)' }}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            <span className="font-semibold">{sub.student_name}</span>
                                        </div>
                                        <span className="text-xs text-muted">{new Date(sub.submitted_at).toLocaleString()}</span>
                                    </div>
                                    <div className="mb-4 bg-hover p-3 rounded-lg" style={{ background: 'var(--bg-hover)' }}>
                                        <p className="text-sm">{sub.content}</p>
                                        {sub.file_url && (
                                            <a href={`${import.meta.env.VITE_API_URL || ''}${sub.file_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary mt-2 text-sm hover:underline">
                                                <FileText size={14} /> Ver Archivo Adjunto
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <label className="text-xs text-muted mb-1 block">Calificación (0-10)</label>
                                            <input
                                                type="number"
                                                className="form-input p-1 text-sm"
                                                value={gradingData[sub.id]?.grade || ''}
                                                onChange={(e) => setGradingData({
                                                    ...gradingData,
                                                    [sub.id]: { ...gradingData[sub.id], grade: e.target.value }
                                                })}
                                                max={10} min={0}
                                            />
                                        </div>
                                        <div className="flex-[2]">
                                            <label className="text-xs text-muted mb-1 block">Retroalimentación</label>
                                            <input
                                                type="text"
                                                className="form-input p-1 text-sm"
                                                value={gradingData[sub.id]?.feedback || ''}
                                                onChange={(e) => setGradingData({
                                                    ...gradingData,
                                                    [sub.id]: { ...gradingData[sub.id], feedback: e.target.value }
                                                })}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-primary p-2 h-[34px]"
                                            onClick={() => handleGradeSubmit(sub.id)}
                                            style={{ height: '38px' }}
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Modal>
            </div>
        );
    }

    // Default view (list of classes)
    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Mis Clases</h1>
                <p style={{ color: 'var(--text-muted)' }}>Selecciona una clase para gestionar materiales y tareas.</p>
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherClasses;
