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
                <div className="flex items-center gap-3">
                    <School color="var(--primary)" size={32} />
                    <h3 className="font-bold text-lg">Universidad Elite</h3>
                </div>

                {/* Mobile Logout Button (Visible only on mobile via CSS) */}
                <button
                    onClick={handleLogout}
                    className="mobile-logout-btn"
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
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
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="sidebar-footer">
                    <div className="flex items-center justify-between w-full mb-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="rounded-full w-8 h-8 flex items-center justify-center font-bold text-white bg-primary text-xs flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}>
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-col items-start user-info overflow-hidden">
                                <p className="text-sm font-medium truncate w-full">{user.name}</p>
                                <p className="text-xs text-muted capitalize">
                                    {user.role === 'student' ? 'Alumno' : (user.role === 'teacher' ? 'Docente' : 'Admin')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full pt-4 border-t border-color mt-auto" style={{ borderColor: 'var(--border-color)' }}>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full transition-all duration-200 group relative overflow-hidden"
                            style={{
                                background: '#fee2e2', // Pastel red background
                                color: '#ef4444',      // Red text
                                border: '1px solid #fecaca',
                                fontSize: '0.85rem'
                            }}
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                            <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
                            <span className="font-semibold">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
