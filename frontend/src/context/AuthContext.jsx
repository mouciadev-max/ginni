import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setLoading(false);
          return;
        }
        const { data } = await axios.get('${import.meta.env.VITE_API_URL}/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('${import.meta.env.VITE_API_URL}/api/auth/login', { email, password });
      if (data.success) {
        setUser(data.data.user);
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('userRole', data.data.user.role);
        return true;
      }
    } catch (error) { console.error(error); }
    return false;
  };

  const register = async (userData) => {
    const { data } = await axios.post('${import.meta.env.VITE_API_URL}/api/auth/register', userData);
    if (data.success) {
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('${import.meta.env.VITE_API_URL}/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) { }
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
