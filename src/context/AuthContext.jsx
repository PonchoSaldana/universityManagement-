import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

  useEffect(() => {
    const storedUser = localStorage.getItem('school_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al iniciar sesión');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('school_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('school_user');
  };

  const updateProfile = async (data) => {
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar perfil');
      }

      const updatedUser = await response.json();
      // Provide default username if missing in response but present in current user, 
      // though backend should probably return it or we merge it.
      const mergedUser = { ...user, ...updatedUser };

      setUser(mergedUser);
      localStorage.setItem('school_user', JSON.stringify(mergedUser));
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
