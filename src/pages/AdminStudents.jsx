import React, { useState } from 'react';
import { Users, Search, Plus, Eye, EyeOff } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const AdminStudents = () => {
    const { students, addStudent, deleteStudent } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        matricula: '',
        username: '',
        password: '',
        email: '',
        grade: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.matricula && student.matricula.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        addStudent(formData);
        setFormData({ name: '', matricula: '', username: '', password: '', email: '', grade: '' });
        setIsModalOpen(false);
    };

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Gestión de Alumnos</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{students.length} alumnos registrados</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Nuevo Alumno
                </button>
            </header>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, matrícula o email..."
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
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Matrícula</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Nombre</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Usuario</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Grado</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Email</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--accent)' }}>
                                    {student.matricula || 'N/A'}
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {student.name.charAt(0)}
                                    </div>
                                    {student.name}
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{student.username || 'N/A'}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899', fontSize: '0.85rem' }}>
                                        {student.grade}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{student.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('¿Estás seguro de eliminar este alumno?')) {
                                                deleteStudent(student.id);
                                            }
                                        }}
                                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                                        title="Eliminar"
                                    >
                                        <Users size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nuevo Alumno">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Matrícula</label>
                            <input
                                type="text"
                                required
                                className="glass-panel"
                                style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.matricula}
                                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                                placeholder="Ej. 2023001"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Grado</label>
                            <select
                                required
                                className="glass-panel"
                                style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            >
                                <option value="" style={{ color: 'black' }}>Seleccionar</option>
                                <option value="1°" style={{ color: 'black' }}>1° Grado</option>
                                <option value="2°" style={{ color: 'black' }}>2° Grado</option>
                                <option value="3°" style={{ color: 'black' }}>3° Grado</option>
                                <option value="4°" style={{ color: 'black' }}>4° Grado</option>
                                <option value="5°" style={{ color: 'black' }}>5° Grado</option>
                                <option value="6°" style={{ color: 'black' }}>6° Grado</option>
                                <option value="7°" style={{ color: 'black' }}>7° Grado</option>
                                <option value="8°" style={{ color: 'black' }}>8° Grado</option>
                                <option value="9°" style={{ color: 'black' }}>9° Grado</option>
                                <option value="10°" style={{ color: 'black' }}>10° Grado</option>
                                <option value="11°" style={{ color: 'black' }}>11° Grado</option>
                                <option value="12°" style={{ color: 'black' }}>12° Grado</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nombre Completo</label>
                        <input
                            type="text"
                            required
                            className="glass-panel"
                            style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej. Juan Pérez"
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
                                placeholder="Ej. jperez"
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
                            placeholder="juan@escuela.edu"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                        Guardar Alumno
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminStudents;
