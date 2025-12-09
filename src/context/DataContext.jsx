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

    const API_URL = 'http://localhost:3000/api';

    const fetchData = async () => {
        try {
            const [studentsRes, teachersRes, classesRes, enrollmentsRes, announcementsRes] = await Promise.all([
                fetch(`${API_URL}/students`),
                fetch(`${API_URL}/teachers`),
                fetch(`${API_URL}/classes`),
                fetch(`${API_URL}/classes/enrollments`),
                fetch(`${API_URL}/announcements`)
            ]);

            if (studentsRes.ok && teachersRes.ok && classesRes.ok && enrollmentsRes.ok && announcementsRes.ok) {
                const studentsData = await studentsRes.json();
                const teachersData = await teachersRes.json();
                const classesData = await classesRes.json();
                const enrollmentsData = await enrollmentsRes.json();
                const announcementsData = await announcementsRes.json();

                setData(prev => ({
                    ...prev,
                    students: Array.isArray(studentsData) ? studentsData : [],
                    teachers: Array.isArray(teachersData) ? teachersData : [],
                    classes: Array.isArray(classesData) ? classesData : [],
                    enrollments: Array.isArray(enrollmentsData) ? enrollmentsData : [],
                    announcements: Array.isArray(announcementsData) ? announcementsData : []
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

    const updateStudent = (id, updatedData) => {
        // TODO: Implement API update
        setData(prev => ({
            ...prev,
            students: prev.students.map(s => s.id === id ? { ...s, ...updatedData } : s)
        }));
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

    const addMaterial = (material) => {
        const newMaterial = { ...material, id: Date.now(), date: new Date().toISOString() };
        setData(prev => ({ ...prev, materials: [newMaterial, ...prev.materials] }));
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
                // Map backend response to frontend structure if needed, or just use as is
                // Backend returns { id, student_id, class_id }
                // Frontend expects { id, studentId, classId } based on usage in TeacherStudents
                const formattedEnrollment = {
                    id: newEnrollment.id,
                    studentId: newEnrollment.student_id,
                    classId: newEnrollment.class_id
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

    return (
        <DataContext.Provider value={{
            ...data,
            addStudent,
            updateStudent,
            deleteStudent,
            addTeacher,
            addClass,
            addAnnouncement,
            addMaterial,
            enrollStudent
        }}>
            {children}
        </DataContext.Provider>
    );
};
