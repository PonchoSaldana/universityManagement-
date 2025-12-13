import React, { useState } from 'react';
import { Users, Search, Mail, MoreVertical } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const TeacherStudents = () => {
    const { students, classes, enrollments, enrollStudent, teachers } = useData();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter classes for the current logged-in teacher
    const currentTeacher = teachers.find(t => t.user_id === user.id);
    const teacherId = currentTeacher ? currentTeacher.id : null;

    const myClasses = classes.filter(c => c.teacher_id === teacherId);
    const myClassIds = myClasses.map(c => c.id);

    // Obtener alumnos inscritos
    const enrolledStudentIds = enrollments
        ? enrollments.filter(e => myClassIds.includes(e.classId)).map(e => e.studentId)
        : [];

    const uniqueStudentIds = [...new Set(enrolledStudentIds)];

    const myStudents = students.filter(student =>
        uniqueStudentIds.includes(student.id) &&
        (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStudentClasses = (studentId) => {
        if (!enrollments) return [];
        const studentEnrollments = enrollments.filter(e => e.studentId === studentId && myClassIds.includes(e.classId));
        return studentEnrollments.map(e => classes.find(c => c.id === e.classId)).filter(Boolean);
    };

    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [studentSearch, setStudentSearch] = useState('');
    const [gradingStudent, setGradingStudent] = useState(null);
    const [grades, setGrades] = useState({ p1: '', p2: '', p3: '' });
    const { updateGrade } = useData();

    const handleOpenGradeModal = (studentId) => {
        // Find enrollment for this student and current class
        const targetClassId = myClasses[0]?.id; // Assuming teacher manages one class mainly or selecting context
        const enrollment = enrollments.find(e => e.studentId === studentId && e.classId === targetClassId);

        if (enrollment) {
            setGradingStudent({
                id: studentId,
                name: students.find(s => s.id === studentId)?.name,
                enrollmentId: enrollment.id
            });
            setGrades({
                p1: enrollment.p1 || '',
                p2: enrollment.p2 || '',
                p3: enrollment.p3 || ''
            });
            setIsGradeModalOpen(true);
        }
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();

        const formatVal = (val) => (val === '' || val === null) ? null : parseFloat(val);

        const p1 = formatVal(grades.p1);
        const p2 = formatVal(grades.p2);
        const p3 = formatVal(grades.p3);

        // Calculate final only if all partials are present
        let final = null;
        if (p1 !== null && p2 !== null && p3 !== null) {
            final = ((p1 + p2 + p3) / 3).toFixed(1);
        }

        const success = await updateGrade(gradingStudent.enrollmentId, {
            p1: p1,
            p2: p2,
            p3: p3,
            final: final
        });

        if (success) {
            setIsGradeModalOpen(false);
            setGradingStudent(null);
        }
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        const targetClassId = myClasses[0]?.id;
        if (targetClassId && selectedStudent) {
            await enrollStudent(parseInt(selectedStudent), parseInt(targetClassId));
            setIsEnrollModalOpen(false);
            setSelectedStudent('');
            setStudentSearch('');
        }
    };

    // Filter students not already enrolled in the teacher's first class
    const availableStudents = students.filter(s => {
        const targetClassId = myClasses[0]?.id;
        if (!targetClassId) return true;
        const isEnrolled = enrollments.some(e => e.classId === parseInt(targetClassId) && e.studentId === s.id);
        return !isEnrolled;
    });

    const filteredAvailableStudents = availableStudents.filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1>Mis Alumnos</h1>
                    <p className="text-muted">Gestión de estudiantes inscritos en tus clases.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (myClasses.length > 0) {
                            setIsEnrollModalOpen(true);
                        } else {
                            alert("No tienes clases asignadas para agregar alumnos.");
                        }
                    }}
                >
                    <Users size={20} />
                    Agregar Alumno
                </button>
            </header>

            <div className="card p-6 mb-8">
                <div className="flex items-center gap-4 p-3 rounded-lg" style={{ background: 'var(--bg-hover)' }}>
                    <Search size={20} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar alumno..."
                        className="w-full bg-transparent border-none"
                        style={{ color: 'var(--text-main)', outline: 'none' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card-grid">
                {myStudents.length === 0 ? (
                    <div className="col-span-full text-center p-8 text-muted" style={{ gridColumn: '1/-1' }}>
                        No se encontraron alumnos en tus clases.
                    </div>
                ) : (
                    myStudents.map((student) => (
                        <div key={student.id} className="card p-6 flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4 items-center">
                                    <div className="rounded-full flex items-center justify-center font-bold text-white"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            background: 'var(--primary)',
                                            fontSize: '1.2rem'
                                        }}>
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem' }}>{student.name}</h3>
                                        <p className="text-sm text-muted">{student.grade}</p>
                                    </div>
                                </div>
                                <button className="btn-ghost rounded-full p-2">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {getStudentClasses(student.id).map(cls => (
                                    <span key={cls.id} className="text-sm px-2 py-1 rounded" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                                        {cls.name}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-auto pt-4 border-t w-full flex gap-2">
                                <button
                                    className="btn btn-primary w-full justify-center text-sm"
                                    onClick={() => handleOpenGradeModal(student.id)}
                                >
                                    Calificar
                                </button>
                                <button className="btn btn-secondary w-full justify-center text-sm">
                                    <Mail size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for enrolling students */}
            {isEnrollModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setIsEnrollModalOpen(false)}>
                    <div
                        className="glass-panel"
                        style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: '#1e293b' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>Agregar Alumno a Clase</h2>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                            Agregando a: <span style={{ color: 'var(--accent)' }}>{myClasses[0]?.name}</span>
                        </p>
                        <form onSubmit={handleEnroll} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Seleccionar Alumno</label>
                                {!selectedStudent ? (
                                    <>
                                        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(0,0,0,0.2)' }}>
                                            <Search size={18} color="var(--text-muted)" />
                                            <input
                                                type="text"
                                                placeholder="Buscar por nombre..."
                                                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                                value={studentSearch}
                                                onChange={(e) => setStudentSearch(e.target.value)}
                                            />
                                        </div>
                                        <div className="glass-panel" style={{ maxHeight: '200px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                                            {filteredAvailableStudents.length > 0 ? (
                                                filteredAvailableStudents.map(student => (
                                                    <div
                                                        key={student.id}
                                                        onClick={() => setSelectedStudent(student.id)}
                                                        style={{
                                                            padding: '0.75rem',
                                                            cursor: 'pointer',
                                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <span>{student.name}</span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.grade}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                    No se encontraron alumnos
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="glass-panel" style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981' }}>
                                        <span style={{ color: '#10b981', fontWeight: '500' }}>
                                            {students.find(s => s.id === parseInt(selectedStudent))?.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedStudent('')}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}
                                        >
                                            Cambiar
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsEnrollModalOpen(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    Agregar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Scale user grade modal */}
            {isGradeModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setIsGradeModalOpen(false)}>
                    <div
                        className="glass-panel"
                        style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: '#1e293b' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>Calificar Alumno</h2>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                            Alumno: <span style={{ color: 'var(--accent)' }}>{gradingStudent?.name}</span>
                        </p>
                        <form onSubmit={handleGradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Parcial 1</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        className="glass-panel"
                                        style={{ width: '100%', padding: '0.5rem', color: 'white', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}
                                        value={grades.p1}
                                        onChange={(e) => setGrades({ ...grades, p1: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Parcial 2</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        className="glass-panel"
                                        style={{ width: '100%', padding: '0.5rem', color: 'white', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}
                                        value={grades.p2}
                                        onChange={(e) => setGrades({ ...grades, p2: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Parcial 3</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        className="glass-panel"
                                        style={{ width: '100%', padding: '0.5rem', color: 'white', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}
                                        value={grades.p3}
                                        onChange={(e) => setGrades({ ...grades, p3: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsGradeModalOpen(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherStudents;
