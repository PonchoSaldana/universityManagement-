import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';
import {
    Home,
    UserRound,
    Library,
    GraduationCap,
    SlidersHorizontal,
    LogOut,
    School,
    BookOpenCheck
} from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [confirmLogout, setConfirmLogout] = useState(false);

    const handleLogoutClick = () => {
        setConfirmLogout(true);
    };

    const performLogout = () => {
        logout();
        setConfirmLogout(false);
        navigate('/');
    };

    if (!user) return <Outlet />;

    const getNavItems = () => {
        switch (user.role) {
            case 'admin':
                return [
                    { icon: Home, label: 'Panel General', path: '/admin' },
                    { icon: UserRound, label: 'Docentes', path: '/admin/docentes' },
                    { icon: Library, label: 'Materias', path: '/admin/materias' },
                    { icon: GraduationCap, label: 'Alumnos', path: '/admin/alumnos' },
                    { icon: SlidersHorizontal, label: 'Configuración', path: '/admin/settings' },
                ];
            case 'teacher':
                return [
                    { icon: Home, label: 'Mi Panel', path: '/docente' },
                    { icon: Library, label: 'Mis Clases', path: '/docente/clases' },
                    { icon: UserRound, label: 'Mis Alumnos', path: '/docente/alumnos' },
                ];
            case 'student':
                return [
                    { icon: Home, label: 'Mi Panel', path: '/alumno' },
                    { icon: Library, label: 'Materias', path: '/alumno/materias' },
                    { icon: BookOpenCheck, label: 'Calificaciones', path: '/alumno/calificaciones' },
                ];
            default:
                return [];
        }
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="flex items-center gap-3 mb-6">
                    <School color="var(--primary)" size={32} strokeWidth={1.5} />
                    <h3 className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>Universidad Elite</h3>
                </div>

                {/* Mobile Logout Button */}
                <button
                    onClick={handleLogoutClick}
                    className="mobile-logout-btn"
                    style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                >
                    <LogOut size={24} />
                </button>

                <div className="nav-links">
                    {getNavItems().map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            end
                        >
                            <item.icon size={20} strokeWidth={2} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="sidebar-footer">
                    <div className="flex items-center gap-3 overflow-hidden mb-4 p-2 rounded-lg" style={{ background: 'var(--bg-hover)' }}>
                        <div className="rounded-full w-10 h-10 flex items-center justify-center font-bold text-white bg-primary text-sm flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}>
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-col items-start user-info overflow-hidden">
                            <p className="text-sm font-semibold truncate w-full" style={{ color: 'var(--text-main)' }}>{user.name}</p>
                            <p className="text-xs text-muted capitalize">
                                {user.role === 'student' ? 'Alumno' : (user.role === 'teacher' ? 'Docente' : 'Admin')}
                            </p>
                        </div>
                    </div>

                    <div className="w-full pt-2 mt-auto">
                        <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all duration-200 group relative overflow-hidden"
                            style={{
                                background: 'var(--bg-card)',
                                color: 'var(--text-muted)',
                                border: '1px solid var(--border-color)',
                                fontSize: '0.9rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--error)';
                                e.currentTarget.style.borderColor = 'var(--error)';
                                e.currentTarget.style.background = '#FEF2F2';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.background = 'var(--bg-card)';
                            }}
                        >
                            <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
                            <span className="font-medium">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>

            <ConfirmModal
                isOpen={confirmLogout}
                onClose={() => setConfirmLogout(false)}
                onConfirm={performLogout}
                title="Cerrar Sesión"
                message="¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a ingresar tus credenciales."
            />
        </div>
    );
};

export default Layout;
