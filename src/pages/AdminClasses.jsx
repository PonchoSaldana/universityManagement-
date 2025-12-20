import React, { useState } from 'react';
import { BookOpen, Search, Plus, User } from 'lucide-react';
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
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Gestión de Materias</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{classes.length} materias registradas</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Nueva Materia
                </button>
            </header>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o docente..."
                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
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
                                <tr key={cls.id} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <BookOpen size={16} color="white" />
                                        </div>
                                        {cls.name}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <User size={16} color="var(--text-muted)" />
                                            {cls.teacher_name || 'Sin asignar'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                        {cls.days} {cls.time}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
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
                    <div className="grid grid-cols-2 gap-4">
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
