import React from 'react';
import { Award, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const StudentGrades = () => {
    const { user } = useAuth();
    const { classes, enrollments } = useData();

    // Obtener clases inscritas del alumno
    const studentId = user?.email === 'carlos@school.edu' ? 2 : 1;
    const myEnrollments = enrollments ? enrollments.filter(e => e.studentId === studentId) : [];
    const myClasses = myEnrollments.map(e => classes.find(c => c.id === e.classId)).filter(Boolean);

    // Datos simulados de calificaciones
    const grades = myClasses.map(cls => {
        // Generar calificaciones consistentes basadas en ID
        const baseGrade = 7 + (cls.id % 3);
        const p1 = Math.min(10, baseGrade + 0.5);
        const p2 = Math.min(10, baseGrade - 0.2);
        const p3 = Math.min(10, baseGrade + 0.8);
        const final = ((p1 + p2 + p3) / 3).toFixed(1);

        return {
            subject: cls.name,
            p1: p1.toFixed(1),
            p2: p2.toFixed(1),
            p3: p3.toFixed(1),
            final: final,
            status: final >= 6 ? 'Aprobado' : 'Reprobado'
        };
    });

    const average = (grades.reduce((acc, curr) => acc + curr.final, 0) / grades.length).toFixed(1);

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1>Boleta de Calificaciones</h1>
                <p style={{ color: 'var(--text-muted)' }}>Ciclo Escolar 2024-2025</p>
            </header>

            <div className="card-grid" style={{ marginBottom: '3rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={40} color="white" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Promedio General</p>
                        <p style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>{average}</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={40} color="#10b981" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Materias Aprobadas</p>
                        <p style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>{grades.length}/{grades.length}</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Materia</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>Parcial 1</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>Parcial 2</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>Parcial 3</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>Final</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>Estatus</th>
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
                                <td style={{ padding: '1.5rem', fontWeight: '600' }}>{item.subject}</td>
                                <td style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>{item.p1}</td>
                                <td style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>{item.p2}</td>
                                <td style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>{item.p3}</td>
                                <td style={{ padding: '1.5rem', textAlign: 'center', fontWeight: 'bold', color: item.final >= 6 ? '#10b981' : '#ef4444' }}>{item.final}</td>
                                <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        background: item.final >= 6 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: item.final >= 6 ? '#10b981' : '#ef4444',
                                        fontSize: '0.85rem'
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
    );
};

export default StudentGrades;
