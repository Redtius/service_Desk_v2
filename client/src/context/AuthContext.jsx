import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/auth';
import { getCurrentUser } from '../api/users';
import { getRoles } from '../api/roles';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      Promise.all([getCurrentUser(), getRoles()])
        .then(([user, roles]) => {
          const roleName = roles.find(r => r.id === user.role_id)?.name;
          const u = { ...user, role: roleName };
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('token');
        });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      const [user, roles] = await Promise.all([getCurrentUser(), getRoles()]);
      const u = { ...user, role: roles.find(r => r.id === user.role_id)?.name };
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
