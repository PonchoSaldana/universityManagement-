import React, { useState } from 'react';
import { Save, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSettings = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert('Las nuevas contraseñas no coinciden');
            return;
        }

        try {
            await updateProfile({
                name: formData.name,
                email: formData.email,
                password: formData.currentPassword, // Backend expects 'password' for current compliance
                newPassword: formData.newPassword
            });
            alert('Configuración guardada exitosamente');
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Configuración</h1>
                <p style={{ color: 'var(--text-muted)' }}>Administra tu cuenta y preferencias del sistema</p>
            </header>

            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Perfil */}
                    <section>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} />
                            Perfil de Usuario
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nombre</label>
                                <input
                                    type="text"
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                                <input
                                    type="email"
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Seguridad */}
                    <section>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lock size={20} />
                            Seguridad
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Contraseña Actual</label>
                                <input
                                    type="password"
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        className="glass-panel"
                                        style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        className="glass-panel"
                                        style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                        <Save size={20} />
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
