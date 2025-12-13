import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { School, User, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await login(formData.username, formData.password);
            const redirectPath = user.role === 'admin' ? '/admin' : user.role === 'teacher' ? '/docente' : '/alumno';
            navigate(redirectPath);
        } catch (err) {
            console.error('Login error:', err);
            if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
                setError('Error de conexión: El servidor no responde. Intenta iniciar el backend.');
            } else {
                setError(err.message || 'Credenciales inválidas');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container" style={{
            justifyContent: 'center',
            alignItems: 'center',
            background: 'var(--bg-dark)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decoration */}


            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '2rem',
                    position: 'relative',
                    zIndex: 1,
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow)'
                }}
            >
                <div className="flex-col items-center gap-6 mb-8 text-center">
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 rounded-2xl"
                        style={{
                            background: 'var(--primary)',
                            borderRadius: '12px'
                        }}
                    >
                        <School size={40} color="white" />
                    </motion.div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>Universidad Elite</h1>
                        <p className="text-muted text-sm">Portal de Acceso</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-col gap-5">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}

                    <div className="flex-col gap-2">
                        <label className="text-sm font-medium text-muted" style={{ marginLeft: '4px' }}>Usuario</label>
                        <div className="flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200"
                            style={{
                                background: 'var(--bg-hover)',
                                border: '1px solid var(--border-color)',
                            }}>
                            <User size={18} color="#475569" />
                            <input
                                type="text"
                                className="bg-transparent border-none w-full outline-none text-sm"
                                style={{ color: '#000000' }}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="flex-col gap-2">
                        <label className="text-sm font-medium text-muted" style={{ marginLeft: '4px' }}>Contraseña</label>
                        <div className="flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200"
                            style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid transparent',
                            }}>
                            <Lock size={18} color="#475569" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="bg-transparent border-none w-full outline-none text-sm"
                                style={{ color: '#000000' }}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="bg-transparent border-none cursor-pointer hover:text-primary transition-colors p-0 flex items-center"
                            >
                                {showPassword ? <EyeOff size={18} color="#475569" /> : <Eye size={18} color="#475569" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full justify-center"
                        disabled={isLoading}
                        style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            fontSize: '1rem',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
                        {!isLoading && <ArrowRight size={20} />}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
