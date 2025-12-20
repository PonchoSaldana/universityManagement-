import React, { useState } from 'react';
import { Users, Search, Plus, BookOpen, Eye, EyeOff, Trash2, Pencil } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

const AdminTeachers = () => {
    const { teachers, addTeacher, updateTeacher, deleteTeacher } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTeacherId, setCurrentTeacherId] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } });
    const { addToast } = useToast();

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData({ name: '', email: '', subject: '', username: '', password: '' });
        setIsEditing(false);
        setCurrentTeacherId(null);
    };

    const handleOpenModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleEditClick = (teacher) => {
        setFormData({
            name: teacher.name,
            email: teacher.email,
            subject: teacher.subject,
            username: teacher.username || '',
            password: ''
        });
        setCurrentTeacherId(teacher.id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateTeacher(currentTeacherId, formData);
                addToast('Docente actualizado correctamente', 'success');
            } else {
                await addTeacher(formData);
                addToast('Docente registrado correctamente', 'success');
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            addToast('Error al guardar el docente', 'error');
        }
    };

    const handleDeleteClick = (teacherId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Eliminar Docente',
            message: '¿Estás seguro de eliminar este docente? Esta acción no se puede deshacer.',
            onConfirm: async () => {
                await deleteTeacher(teacherId);
                addToast('Docente eliminado correctamente', 'success');
            }
        });
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1>Gestión de Docentes</h1>
                    <p className="text-muted">{teachers.length} docentes activos</p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenModal}>
                    <Plus size={20} />
                    Nuevo Docente
                </button>
            </header>

            <div className="card p-6 mb-8">
                <div className="flex items-center gap-4 p-3 rounded-lg" style={{ background: 'var(--bg-hover)' }}>
                    <Search size={20} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o materia..."
                        className="w-full bg-transparent border-none outline-none"
                        style={{ color: 'var(--text-main)' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b" style={{ borderColor: 'var(--border-color)', textAlign: 'left' }}>
                            <th className="p-4 text-muted font-medium">Nombre</th>
                            <th className="p-4 text-muted font-medium">Materia Principal</th>
                            <th className="p-4 text-muted font-medium">Email</th>
                            <th className="p-4 text-muted font-medium">Estado</th>
                            <th className="p-4 text-muted font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeachers.map((teacher) => (
                            <tr key={teacher.id} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                                        {teacher.name.charAt(0)}
                                    </div>
                                    <span className="font-medium">{teacher.name}</span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={16} className="text-muted" />
                                        {teacher.subject}
                                    </div>
                                </td>
                                <td className="p-4 text-muted">{teacher.email}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                        Activo
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(teacher)}
                                        className="btn-ghost p-2 text-primary hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(teacher.id)}
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Editar Docente" : "Registrar Nuevo Docente"}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 text-sm text-muted">Nombre Completo</label>
                        <input
                            type="text"
                            required
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                placeholder="Ej. proferuiz"
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
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-muted">Materia</label>
                        <input
                            type="text"
                            required
                            className="form-input"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4 justify-center">
                        {isEditing ? "Actualizar Docente" : "Guardar Docente"}
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
        </div >
    );
};

export default AdminTeachers;
