import React from 'react';
import { Award, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const StudentGrades = () => {
    const { user } = useAuth();
    const { classes, enrollments, students } = useData();

    // Obtener clases inscritas del alumno
    const studentId = students.find(s => s.user_id === user?.id)?.id;
    const myEnrollments = enrollments ? enrollments.filter(e => e.studentId === studentId) : [];

    // Datos simulados de calificaciones
    // Obtener datos reales de calificaciones desde enrollments
    const grades = myEnrollments.map(e => {
        const cls = classes.find(c => c.id === e.classId);
        if (!cls) return null;

        const p1 = e.p1 !== null ? parseFloat(e.p1) : null;
        const p2 = e.p2 !== null ? parseFloat(e.p2) : null;
        const p3 = e.p3 !== null ? parseFloat(e.p3) : null;
        const final = e.final !== null ? parseFloat(e.final) : null;

        return {
            subject: cls.name,
            p1: p1 !== null ? p1.toFixed(1) : '-',
            p2: p2 !== null ? p2.toFixed(1) : '-',
            p3: p3 !== null ? p3.toFixed(1) : '-',
            final: final !== null ? final.toFixed(1) : '-',
            status: final !== null ? (final >= 6 ? 'Aprobado' : 'Reprobado') : 'Cursando'
        };
    }).filter(Boolean);

    const validGrades = grades.filter(g => g.final !== '-');
    const average = validGrades.length > 0
        ? (validGrades.reduce((acc, curr) => acc + parseFloat(curr.final), 0) / validGrades.length).toFixed(1)
        : 'N/A';

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Boleta de Calificaciones</h1>
                <p style={{ color: 'var(--text-muted)' }}>Ciclo Escolar 2024-2025</p>
            </header>

            <div className="card-grid" style={{ marginBottom: '3rem', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Award size={30} color="white" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Promedio General</p>
                        <p style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1 }}>{average}</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <TrendingUp size={30} color="#10b981" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Materias Aprobadas</p>
                        <p style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1 }}>
                            {grades.filter(g => g.status === 'Aprobado').length}/{grades.length}
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Materia</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>P1</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>P2</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>P3</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>Final</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>Estatus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map((item, idx) => (
                                <motion.tr
                                    key={idx}
                                    style={{ borderBottom: '1px solid var(--glass-border)' }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <td style={{ padding: '1rem', fontWeight: '600' }}>{item.subject}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>{item.p1}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>{item.p2}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>{item.p3}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: item.final >= 6 ? '#10b981' : (item.final === '-' ? 'var(--text-muted)' : '#ef4444') }}>{item.final}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            background: item.status === 'Aprobado' ? 'rgba(16, 185, 129, 0.2)' : (item.status === 'Cursando' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
                                            color: item.status === 'Aprobado' ? '#10b981' : (item.status === 'Cursando' ? '#3b82f6' : '#ef4444'),
                                            fontSize: '0.75rem',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {item.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentGrades;
