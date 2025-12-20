import React, { useState } from 'react';
import { Save, User, Lock, Shield, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

const AdminSettings = () => {
    const { user, updateProfile } = useAuth();
    const { addToast } = useToast();
    const { theme, toggleTheme } = useTheme();
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
            addToast('Las nuevas contraseñas no coinciden', 'error');
            return;
        }

        try {
            await updateProfile({
                name: formData.name,
                email: formData.email,
                password: formData.currentPassword,
                newPassword: formData.newPassword
            });
            addToast('Configuración guardada exitosamente', 'success');
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto pb-12">
            <header className="mb-8">
                <h1>Configuración de Cuenta</h1>
                <p className="text-muted">Administra tu perfil, seguridad y preferencias.</p>
            </header>

            <div className="glass-panel overflow-hidden">
                {/* Profile Header */}
                <div style={{
                    background: 'linear-gradient(to right, rgba(79, 70, 229, 0.1), transparent)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '2rem'
                }}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-opacity-20 ring-white"
                                style={{
                                    width: '96px',
                                    height: '96px',
                                    background: 'var(--primary)',
                                    borderColor: 'var(--bg-card)'
                                }}>
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white"
                                style={{
                                    background: 'var(--success)',
                                    borderColor: 'var(--bg-card)'
                                }}></div>
                        </div>
                        <div className="text-center md:text-left space-y-1">
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{user?.name}</h2>
                            <p className="text-muted font-medium">Administrador • {user?.email}</p>
                            <div className="pt-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                    style={{
                                        background: 'rgba(79, 70, 229, 0.1)',
                                        color: 'var(--primary)'
                                    }}>
                                    <Shield size={12} className="mr-1" />
                                    Cuenta Verificada
                                </span>
                            </div>
                        </div>
                        <div className="md:ml-auto flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="btn btn-secondary flex-1 md:flex-none justify-center"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="btn btn-primary flex-1 md:flex-none justify-center"
                            >
                                <Save size={16} />
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className="md:col-span-4">
                                <h3 className="uppercase tracking-wider mb-2 text-sm">Información Básica</h3>
                                <p className="text-muted text-xs leading-relaxed">
                                    Datos visibles en tu perfil de administrador.
                                </p>
                            </div>
                            <div className="md:col-span-8 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-muted uppercase">Nombre Completo</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={16} className="text-muted" />
                                            </div>
                                            <input
                                                type="text"
                                                className="form-input pl-10"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-muted uppercase">Email Corporativo</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail size={16} className="text-muted" />
                                            </div>
                                            <input
                                                type="email"
                                                className="form-input pl-10"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border"></div>

                        {/* Security */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className="md:col-span-4">
                                <h3 className="uppercase tracking-wider mb-2 text-sm">Seguridad</h3>
                                <p className="text-muted text-xs leading-relaxed">
                                    Actualiza tu contraseña periódicamente para proteger tu cuenta.
                                </p>
                            </div>
                            <div className="md:col-span-8">
                                <div className="p-6 rounded-xl border border-border space-y-5" style={{ background: 'var(--bg-hover)' }}>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-muted uppercase">Contraseña Actual</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock size={16} className="text-muted" />
                                            </div>
                                            <input
                                                type="password"
                                                className="form-input pl-10"
                                                placeholder="••••••••••••"
                                                value={formData.currentPassword}
                                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-muted uppercase">Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                placeholder="Mínimo 8 caracteres"
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-muted uppercase">Confirmar</label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                placeholder="Repite la contraseña"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-muted text-xs">Último acceso: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default AdminSettings;
