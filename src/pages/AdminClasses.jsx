import React, { useState } from 'react';
import { Library, Search, Plus, UserRound } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const AdminClasses = () => {
    const { classes, teachers, addClass } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        teacher_id: '',
        time: '',
        days: '',
        room: ''
    });

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cls.teacher_name && cls.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        addClass(formData);
        setFormData({ name: '', teacher_id: '', time: '', days: '', room: '' });
        setIsModalOpen(false);
    };

    return (
        <div className="animate-fade-in">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="mb-2">Gestión de Materias</h1>
                    <p className="text-muted">{classes.length} materias registradas</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Nueva Materia
                </button>
            </header>

            <div className="card mb-8 p-6">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-color)' }}>
                    <Search size={20} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o docente..."
                        style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none', color: 'var(--text-main)', fontSize: '1rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: 'var(--border-color)', textAlign: 'left' }}>
                                <th className="p-4 text-muted">Materia</th>
                                <th className="p-4 text-muted">Docente</th>
                                <th className="p-4 text-muted">Horario</th>
                                <th className="p-4 text-muted">Salón</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses.map((cls) => (
                                <tr key={cls.id} className="border-b last:border-0 hover:bg-hover transition-colors" style={{ borderColor: 'var(--bg-hover)' }}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'var(--primary)' }}>
                                                <Library size={20} />
                                            </div>
                                            <span className="font-medium">{cls.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-muted">
                                            <UserRound size={16} />
                                            <span>{cls.teacher_name || 'Sin asignar'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-muted">
                                        <span className="px-2 py-1 rounded-md text-sm" style={{ background: 'var(--bg-hover)' }}>
                                            {cls.days} • {cls.time}
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted font-medium">
                                        {cls.room}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Materia">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 text-sm text-muted">Nombre de la Materia</label>
                        <input
                            type="text"
                            required
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej. Matemáticas Avanzadas"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-muted">Docente Asignado</label>
                        <select
                            required
                            className="form-input"
                            value={formData.teacher_id}
                            onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                        >
                            <option value="">Seleccionar Docente</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name} ({teacher.subject})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="block mb-2 text-sm text-muted">Días</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.days}
                                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                                placeholder="Ej. Lun - Mie"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm text-muted">Horario</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                placeholder="Ej. 8:00 - 10:00"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-muted">Salón</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.room}
                            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            placeholder="Ej. A-101"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4 justify-center">
                        Guardar Materia
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminClasses;
