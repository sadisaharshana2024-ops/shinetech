import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved token in local storage
    const token = localStorage.getItem('phone_shop_token');
    if (token) {
      // In a real app, we would verify the token with the backend
      // For now, we'll assume a dummy user if token exists
      setUser({ id: 1, name: 'Admin', role: 'admin' });
    }
    setLoading(false);
  }, []);

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const lockStatus = localStorage.getItem('auth_lockout');
    if (lockStatus && Date.now() < parseInt(lockStatus)) {
      setIsLocked(true);
      const remaining = parseInt(lockStatus) - Date.now();
      setTimeout(() => setIsLocked(false), remaining);
    }
  }, []);

  const login = async (username, password) => {
    if (isLocked) {
      return { success: false, message: 'Security Alert: Account temporarily locked. Try again later.' };
    }

    // SECURITY: Use environmental variables for admin credentials in production
    if (username === 'admin' && password === 'admin2026') {
      const dummyToken = 'jwt_token_demo_' + Math.random().toString(36);
      localStorage.setItem('phone_shop_token', dummyToken);
      setUser({ id: 1, name: 'Admin', role: 'admin' });
      setLoginAttempts(0);
      return { success: true };
    }

    // Track failed attempts
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    if (newAttempts >= 5) {
      const lockUntil = Date.now() + (5 * 60 * 1000); // 5 minute lockout
      localStorage.setItem('auth_lockout', lockUntil.toString());
      setIsLocked(true);
      return { success: false, message: 'Too many attempts. Locked for 5 minutes.' };
    }

    return { success: false, message: `Invalid credentials. (${5 - newAttempts} attempts remaining)` };
  };

  const logout = () => {
    localStorage.removeItem('phone_shop_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
