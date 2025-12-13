import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Settings,
    LogOut,
    School
} from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return <Outlet />;

    const getNavItems = () => {
        switch (user.role) {
            case 'admin':
                return [
                    { icon: LayoutDashboard, label: 'Panel General', path: '/admin' },
                    { icon: Users, label: 'Docentes', path: '/admin/docentes' },
                    { icon: BookOpen, label: 'Materias', path: '/admin/materias' },
                    { icon: GraduationCap, label: 'Alumnos', path: '/admin/alumnos' },
                    { icon: Settings, label: 'Configuración', path: '/admin/settings' },
                ];
            case 'teacher':
                return [
                    { icon: LayoutDashboard, label: 'Mi Panel', path: '/docente' },
                    { icon: BookOpen, label: 'Mis Clases', path: '/docente/clases' },
                    { icon: Users, label: 'Mis Alumnos', path: '/docente/alumnos' },
                ];
            case 'student':
                return [
                    { icon: LayoutDashboard, label: 'Mi Panel', path: '/alumno' },
                    { icon: BookOpen, label: 'Materias', path: '/alumno/materias' },
                    { icon: GraduationCap, label: 'Calificaciones', path: '/alumno/calificaciones' },
                ];
            default:
                return [];
        }
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="flex items-center gap-4">
                    <div style={{
                        background: 'var(--primary)',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        display: 'flex'
                    }}>
                        <School color="white" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm" style={{ fontSize: '1rem' }}>Universidad Elite</h3>
                    </div>
                </div>

                <div className="nav-links">
                    {getNavItems().map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            end
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-col items-end user-info">
                            <p className="text-sm font-bold">{user.name}</p>
                            <p className="text-sm text-muted" style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                                {user.role === 'student' ? 'Alumno' : (user.role === 'teacher' ? 'Docente' : 'Administrador')}
                            </p>
                        </div>
                        <div className="rounded-full flex items-center justify-center font-bold text-white"
                            style={{
                                width: '36px',
                                height: '36px',
                                background: 'var(--primary)',
                                fontSize: '0.9rem'
                            }}>
                            {user.name.charAt(0)}
                        </div>
                    </div>
                    <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem' }}></div>
                    <button onClick={handleLogout} className="btn-ghost" title="Cerrar Sesión">
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
