import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        students: [],
        teachers: [],
        classes: [],
        materials: [],
        enrollments: []
    });

    const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

    const fetchData = async () => {
        try {
            const [studentsRes, teachersRes, classesRes, enrollmentsRes, announcementsRes, materialsRes] = await Promise.all([
                fetch(`${API_URL}/students`),
                fetch(`${API_URL}/teachers`),
                fetch(`${API_URL}/classes`),
                fetch(`${API_URL}/classes/enrollments`),
                fetch(`${API_URL}/announcements`),
                fetch(`${API_URL}/materials`)
            ]);

            if (studentsRes.ok && teachersRes.ok && classesRes.ok && enrollmentsRes.ok && announcementsRes.ok) {
                const studentsData = await studentsRes.json();
                const teachersData = await teachersRes.json();
                const classesData = await classesRes.json();
                const enrollmentsData = await enrollmentsRes.json();
                const announcementsData = await announcementsRes.json();
                const materialsData = await materialsRes.json();

                setData(prev => ({
                    ...prev,
                    students: Array.isArray(studentsData) ? studentsData : [],
                    teachers: Array.isArray(teachersData) ? teachersData : [],
                    classes: Array.isArray(classesData) ? classesData : [],
                    enrollments: Array.isArray(enrollmentsData) ? enrollmentsData.map(e => ({
                        id: e.id,
                        studentId: e.student_id,
                        classId: e.class_id,
                        p1: e.p1,
                        p2: e.p2,
                        p3: e.p3,
                        final: e.final
                    })) : [],
                    announcements: Array.isArray(announcementsData) ? announcementsData : [],
                    materials: Array.isArray(materialsData) ? materialsData : []
                }));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addStudent = async (student) => {
        try {
            const response = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
            if (response.ok) {
                const newStudent = await response.json();
                setData(prev => ({ ...prev, students: [...prev.students, newStudent] }));
            }
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const updateStudent = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (response.ok) {
                const updatedStudent = await response.json();
                setData(prev => ({
                    ...prev,
                    students: prev.students.map(s => s.id === id ? { ...s, ...updatedStudent } : s)
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating student:', error);
            return false;
        }
    };

    const deleteStudent = async (id) => {
        try {
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setData(prev => ({
                    ...prev,
                    students: prev.students.filter(s => s.id !== id),
                    enrollments: prev.enrollments.filter(e => e.studentId !== id)
                }));
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const addTeacher = async (teacher) => {
        try {
            const response = await fetch(`${API_URL}/teachers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teacher)
            });
            if (response.ok) {
                const newTeacher = await response.json();
                setData(prev => ({ ...prev, teachers: [...prev.teachers, newTeacher] }));
            }
        } catch (error) {
            console.error('Error adding teacher:', error);
        }
    };

    const addMaterial = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/materials`, {
                method: 'POST',
                body: formData // No headers needed, browser sets multipart/form-data automatically
            });

            if (response.ok) {
                const newMaterial = await response.json();
                setData(prev => ({ ...prev, materials: [newMaterial, ...prev.materials] }));
                return true;
            } else {
                console.error('Failed to upload material');
                return false;
            }
        } catch (error) {
            console.error('Error adding material:', error);
            return false;
        }
    };

    const enrollStudent = async (studentId, classId) => {
        try {
            const response = await fetch(`${API_URL}/classes/enrollments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: studentId, class_id: classId })
            });

            if (response.ok) {
                const newEnrollment = await response.json();
                const formattedEnrollment = {
                    id: newEnrollment.id,
                    studentId: newEnrollment.student_id,
                    classId: newEnrollment.class_id,
                    p1: null,
                    p2: null,
                    p3: null,
                    final: null
                };

                setData(prev => ({
                    ...prev,
                    enrollments: [...prev.enrollments, formattedEnrollment]
                }));
                return true;
            } else {
                const error = await response.json();
                console.error('Error enrolling student:', error);
                return false;
            }
        } catch (error) {
            console.error('Error enrolling student:', error);
            return false;
        }
    };

    const updateGrade = async (enrollmentId, grades) => {
        try {
            const response = await fetch(`${API_URL}/classes/enrollments/${enrollmentId}/grade`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grades)
            });

            if (response.ok) {
                setData(prev => ({
                    ...prev,
                    enrollments: prev.enrollments.map(e =>
                        e.id === enrollmentId ? { ...e, ...grades } : e
                    )
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating grade:', error);
            return false;
        }
    };

    const unenrollStudent = async (enrollmentId) => {
        try {
            const response = await fetch(`${API_URL}/classes/enrollments/${enrollmentId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setData(prev => ({
                    ...prev,
                    enrollments: prev.enrollments.filter(e => e.id !== enrollmentId)
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error unenrolling student:', error);
            return false;
        }
    };

    const addClass = async (classData) => {
        try {
            const response = await fetch(`${API_URL}/classes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(classData)
            });
            if (response.ok) {
                const newClass = await response.json();
                setData(prev => ({ ...prev, classes: [...prev.classes, newClass] }));
                fetchData(); // Refresh to get teacher names if needed
            }
        } catch (error) {
            console.error('Error adding class:', error);
        }
    };

    const addAnnouncement = async (announcementData) => {
        try {
            const response = await fetch(`${API_URL}/announcements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(announcementData)
            });
            if (response.ok) {
                const newAnnouncement = await response.json();
                setData(prev => ({ ...prev, announcements: [newAnnouncement, ...prev.announcements] }));
            }
        } catch (error) {
            console.error('Error adding announcement:', error);
        }
    };

    const updateTeacher = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_URL}/teachers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (response.ok) {
                const updatedTeacher = await response.json();
                setData(prev => ({
                    ...prev,
                    teachers: prev.teachers.map(t => t.id === id ? { ...t, ...updatedTeacher } : t)
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating teacher:', error);
            return false;
        }
    };

    const deleteTeacher = async (id) => {
        try {
            const response = await fetch(`${API_URL}/teachers/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setData(prev => ({
                    ...prev,
                    teachers: prev.teachers.filter(t => t.id !== id),
                    // Also clear classes assigned to this teacher if backend handles it or we refresh
                }));
                // Ideally refresh classes to see updated teacher assignments (null or gone)
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    };

    return (
        <DataContext.Provider value={{
            ...data,
            addStudent,
            updateStudent,
            deleteStudent,
            addTeacher,
            updateTeacher,
            deleteTeacher,
            addClass,
            addAnnouncement,
            addMaterial,
            enrollStudent,
            updateGrade,
            unenrollStudent
        }}>
            {children}
        </DataContext.Provider>
    );
};
