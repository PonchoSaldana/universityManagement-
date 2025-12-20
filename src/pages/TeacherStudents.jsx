import React, { useState } from 'react';
import { Users, Search, Mail, MoreVertical, Trash2, UserMinus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

const TeacherStudents = () => {
    const { students, classes, enrollments, enrollStudent, unenrollStudent, teachers } = useData();
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

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } });
    const { addToast } = useToast();

    const { updateGrade } = useData();

    const handleUnenroll = async (studentId) => {
        const targetClassId = myClasses[0]?.id;
        const enrollment = enrollments.find(e => e.studentId === studentId && e.classId === targetClassId);

        if (enrollment) {
            setConfirmModal({
                isOpen: true,
                title: 'Eliminar Alumno',
                message: `¿Estás seguro de que deseas sacar al alumno de la clase ${myClasses[0]?.name}?`,
                onConfirm: async () => {
                    const success = await unenrollStudent(enrollment.id);
                    if (success) {
                        addToast('Alumno eliminado de la clase correctamente', 'success');
                    } else {
                        addToast('Error al eliminar alumno', 'error');
                    }
                }
            });
        } else {
            addToast('No se encontró la inscripción para esta clase.', 'error');
        }
    };

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
            addToast('Calificaciones actualizadas correctamente', 'success');
        } else {
            addToast('Error al actualizar calificaciones', 'error');
        }
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        const targetClassId = myClasses[0]?.id;
        if (targetClassId && selectedStudent) {
            const success = await enrollStudent(parseInt(selectedStudent), parseInt(targetClassId));
            if (success) {
                setIsEnrollModalOpen(false);
                setSelectedStudent('');
                setStudentSearch('');
                addToast('Alumno agregado correctamente', 'success');
            } else {
                addToast('Error al agregar alumno', 'error');
            }
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
                            addToast("No tienes clases asignadas para agregar alumnos.", 'error');
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
                                <button className="btn btn-secondary w-full justify-center text-sm text-error" onClick={() => handleUnenroll(student.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for enrolling students */}
            <Modal isOpen={isEnrollModalOpen} onClose={() => setIsEnrollModalOpen(false)} title="Agregar Alumno a Clase">
                <p className="mb-4 text-muted">
                    Agregando a: <span className="text-primary font-bold">{myClasses[0]?.name}</span>
                </p>
                <form onSubmit={handleEnroll} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-muted">Seleccionar Alumno</label>
                        {!selectedStudent ? (
                            <>
                                <div className="flex items-center gap-2 p-3 mb-2 rounded-lg bg-hover">
                                    <Search size={18} className="text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre..."
                                        className="w-full bg-transparent border-none outline-none text-main"
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto border border-border rounded-lg">
                                    {filteredAvailableStudents.length > 0 ? (
                                        filteredAvailableStudents.map(student => (
                                            <div
                                                key={student.id}
                                                onClick={() => setSelectedStudent(student.id)}
                                                className="p-3 cursor-pointer flex justify-between items-center hover:bg-hover border-b border-border last:border-0"
                                            >
                                                <span>{student.name}</span>
                                                <span className="text-xs text-muted">{student.grade}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-muted">
                                            No se encontraron alumnos
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="p-3 rounded-lg flex justify-between items-center border border-success bg-success-light" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                                <span className="font-medium text-success">
                                    {students.find(s => s.id === parseInt(selectedStudent))?.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedStudent('')}
                                    className="text-error text-sm font-medium hover:underline"
                                >
                                    Cambiar
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 mt-4">
                        <button type="button" className="btn btn-secondary flex-1 justify-center" onClick={() => setIsEnrollModalOpen(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary flex-1 justify-center">
                            Agregar
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Scale user grade modal */}
            <Modal isOpen={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)} title="Calificar Alumno">
                <p className="mb-4 text-muted">
                    Alumno: <span className="font-bold text-primary">{gradingStudent?.name}</span>
                </p>
                <form onSubmit={handleGradeSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-2 text-sm text-muted text-center">Parcial 1</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                className="form-input text-center"
                                value={grades.p1}
                                onChange={(e) => setGrades({ ...grades, p1: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm text-muted text-center">Parcial 2</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                className="form-input text-center"
                                value={grades.p2}
                                onChange={(e) => setGrades({ ...grades, p2: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm text-muted text-center">Parcial 3</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                className="form-input text-center"
                                value={grades.p3}
                                onChange={(e) => setGrades({ ...grades, p3: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button type="button" className="btn btn-secondary flex-1 justify-center" onClick={() => setIsGradeModalOpen(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary flex-1 justify-center">
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </div>
    );
};

export default TeacherStudents;
