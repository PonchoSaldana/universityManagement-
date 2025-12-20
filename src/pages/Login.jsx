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
                setError('Error de conexión: Verifica que el backend esté corriendo.');
            } else {
                setError(err.message || 'Credenciales inválidas');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)'
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-panel"
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '400px',
                    padding: '2.5rem',
                    margin: '1rem',
                    background: '#ffffff', // White background
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', textAlign: 'center' }}>
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            background: '#4f46e5', // Primary Color
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '16px',
                            marginBottom: '1rem',
                            boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
                        }}
                    >
                        <School size={40} />
                    </motion.div>
                    <h1 style={{ color: '#0f172a', fontSize: '2rem', marginBottom: '0.25rem' }}>Universidad Elite</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Plataforma Académica Digital</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                background: '#fef2f2',
                                border: '1px solid #fee2e2',
                                color: '#ef4444',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                autoFocus
                                placeholder="Nombre de usuario"
                                className="form-input"
                                style={{
                                    paddingLeft: '3rem',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    color: '#0f172a'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="Contraseña"
                                className="form-input"
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '3rem',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    color: '#0f172a'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748b',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            justifyContent: 'center',
                            marginTop: '0.5rem',
                            background: '#4f46e5',
                            color: 'white'
                        }}
                    >
                        {isLoading ? (
                            <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <>
                                Iniciar Sesión
                                <ArrowRight size={18} />
                            </>
                        )}
                        <style>{`
                            @keyframes spin { to { transform: rotate(360deg); } }
                        `}</style>
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            ¿Problemas para acceder? Contacta a un <span style={{ color: '#4f46e5', cursor: 'pointer', textDecoration: 'underline' }}>administrador</span>.
                        </p>
                    </div>
                </form>
            </motion.div>

            <div style={{ position: 'absolute', bottom: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', width: '100%', textAlign: 'center' }}>

            </div>
        </div>
    );
};

export default Login;
