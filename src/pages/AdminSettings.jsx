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

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Configuración de Cuenta</h1>
                <p className="text-gray-500 text-sm">Administra tu perfil y credenciales de acceso.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-white border-b border-gray-100 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200 ring-4 ring-white">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                        </div>
                        <div className="text-center md:text-left space-y-1">
                            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                            <p className="text-sm text-gray-500 font-medium">Administrador • {user?.email}</p>
                            <div className="pt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    Cuenta Verificada
                                </span>
                            </div>
                        </div>
                        <div className="md:ml-auto flex gap-3">
                            <button type="button" onClick={() => window.history.back()} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all">
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center gap-2"
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
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Información Básica</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    Datos visibles en tu perfil de administrador.
                                </p>
                            </div>
                            <div className="md:col-span-8 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-700">Nombre Completo</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="block w-full pl-9 pr-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-700">Email Corporativo</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                className="block w-full pl-9 pr-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-50"></div>

                        {/* Security */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className="md:col-span-4">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Seguridad</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    Actualiza tu contraseña periódicamente para proteger tu cuenta.
                                </p>
                            </div>
                            <div className="md:col-span-8">
                                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 space-y-5">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-semibold text-gray-700">Contraseña Actual</label>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                className="block w-full pl-9 pr-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                                placeholder="••••••••••••"
                                                value={formData.currentPassword}
                                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-700">Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                className="block w-full px-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                                placeholder="Mínimo 8 caracteres"
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-700">Confirmar</label>
                                            <input
                                                type="password"
                                                className="block w-full px-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
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
                <p className="text-gray-400 text-xs">Último acceso: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default AdminSettings;
