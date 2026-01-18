import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, verifyToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('relux_token');
    if (token) {
      try {
        const { data } = await verifyToken();
        if (data.valid) {
          setAdmin(data.admin);
        } else {
          localStorage.removeItem('relux_token');
        }
      } catch {
        localStorage.removeItem('relux_token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const { data } = await apiLogin(email, password);
    localStorage.setItem('relux_token', data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('relux_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
