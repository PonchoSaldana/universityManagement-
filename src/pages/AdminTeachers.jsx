import React, { useState } from 'react';
import { Users, Search, Plus, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const AdminTeachers = () => {
    const { teachers, addTeacher } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        addTeacher(formData);
        setFormData({ name: '', email: '', subject: '', username: '', password: '' });
        setIsModalOpen(false);
    };

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Gestión de Docentes</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{teachers.length} docentes activos</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Nuevo Docente
                </button>
            </header>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o materia..."
                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Nombre</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Materia Principal</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Email</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeachers.map((teacher) => (
                            <tr key={teacher.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {teacher.name.charAt(0)}
                                    </div>
                                    {teacher.name}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <BookOpen size={16} color="var(--text-muted)" />
                                        {teacher.subject}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{teacher.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.85rem' }}>
                                        Activo
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nuevo Docente">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nombre Completo</label>
                        <input
                            type="text"
                            required
                            className="glass-panel"
                            style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Usuario</label>
                            <input
                                type="text"
                                required
                                className="glass-panel"
                                style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Ej. proferuiz"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                        <input
                            type="email"
                            required
                            className="glass-panel"
                            style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Materia</label>
                        <input
                            type="text"
                            required
                            className="glass-panel"
                            style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                        Guardar Docente
                    </button>
                </form>
            </Modal>
        </div >
    );
};

export default AdminTeachers;
