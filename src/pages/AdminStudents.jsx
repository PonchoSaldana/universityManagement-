import React, { useState } from 'react';
import { Users, Search, Plus, Eye, EyeOff, Trash2, Pencil } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

const AdminStudents = () => {
    const { students, addStudent, updateStudent, deleteStudent } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        matricula: '',
        username: '',
        password: '',
        email: '',
        grade: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } });
    const { addToast } = useToast();

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.matricula && student.matricula.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const resetForm = () => {
        setFormData({ name: '', matricula: '', username: '', password: '', email: '', grade: '' });
        setIsEditing(false);
        setCurrentStudentId(null);
    };

    const handleOpenModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleEditClick = (student) => {
        setFormData({
            name: student.name,
            matricula: student.matricula || '',
            username: student.username || '',
            password: '',
            email: student.email,
            grade: student.grade
        });
        setCurrentStudentId(student.id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateStudent(currentStudentId, formData);
                addToast('Alumno actualizado correctamente', 'success');
            } else {
                await addStudent(formData);
                addToast('Alumno registrado correctamente', 'success');
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            addToast('Error al guardar el alumno', 'error');
        }
    };

    const handleDeleteClick = (studentId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Eliminar Alumno',
            message: '¿Estás seguro de eliminar este alumno? Esta acción eliminará su cuenta y registros de calificaciones.',
            onConfirm: async () => {
                await deleteStudent(studentId);
                addToast('Alumno eliminado correctamente', 'success');
            }
        });
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1>Gestión de Alumnos</h1>
                    <p className="text-muted">{students.length} alumnos registrados</p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenModal}>
                    <Plus size={20} />
                    Nuevo Alumno
                </button>
            </header>

            <div className="card p-6 mb-8">
                <div className="flex items-center gap-4 p-3 rounded-lg" style={{ background: 'var(--bg-hover)' }}>
                    <Search size={20} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, matrícula o email..."
                        className="w-full bg-transparent border-none outline-none"
                        style={{ color: 'var(--text-main)' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card overflow-x-auto">
                <table className="w-full border-collapse" style={{ minWidth: '1000px' }}>
                    <thead>
                        <tr className="border-b" style={{ borderColor: 'var(--border-color)', textAlign: 'left' }}>
                            <th className="p-4 text-muted font-medium">Matrícula</th>
                            <th className="p-4 text-muted font-medium">Nombre</th>
                            <th className="p-4 text-muted font-medium">Usuario</th>
                            <th className="p-4 text-muted font-medium">Grado</th>
                            <th className="p-4 text-muted font-medium">Email</th>
                            <th className="p-4 text-muted font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                                <td className="p-4 font-mono text-accent">
                                    {student.matricula || 'N/A'}
                                </td>
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                                        {student.name.charAt(0)}
                                    </div>
                                    <span className="font-medium">{student.name}</span>
                                </td>
                                <td className="p-4 text-muted text-sm">{student.username || 'N/A'}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-600" style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent)' }}>
                                        {student.grade}
                                    </span>
                                </td>
                                <td className="p-4 text-muted">{student.email}</td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(student)}
                                        className="btn-ghost p-2 text-primary hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(student.id)}
                                        className="btn-ghost p-2 text-error hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Editar Alumno" : "Registrar Nuevo Alumno"}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-sm text-muted">Matrícula</label>
                            <input
                                type="text"
                                required
                                className="form-input"
                                value={formData.matricula}
                                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                                placeholder="Ej. 2023001"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm text-muted">Grado</label>
                            <select
                                required
                                className="form-input"
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            >
                                <option value="">Seleccionar</option>
                                <option value="1°">1° Grado</option>
                                <option value="2°">2° Grado</option>
                                <option value="3°">3° Grado</option>
                                <option value="4°">4° Grado</option>
                                <option value="5°">5° Grado</option>
                                <option value="6°">6° Grado</option>
                                <option value="7°">7° Grado</option>
                                <option value="8°">8° Grado</option>
                                <option value="9°">9° Grado</option>
                                <option value="10°">10° Grado</option>
                                <option value="11°">11° Grado</option>
                                <option value="12°">12° Grado</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-muted">Nombre Completo</label>
                        <input
                            type="text"
                            required
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-sm text-muted">Usuario</label>
                            <input
                                type="text"
                                required
                                className="form-input"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Ej. jperez"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm text-muted">Contraseña {isEditing && <span className="text-xs">(Dejar vacío para mantener)</span>}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required={!isEditing}
                                    className="form-input"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={isEditing ? "••••••" : "••••••"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-muted">Email</label>
                        <input
                            type="email"
                            required
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="juan@escuela.edu"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4 justify-center">
                        {isEditing ? "Actualizar Alumno" : "Guardar Alumno"}
                    </button>
                </form>
            </Modal>

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

export default AdminStudents;
