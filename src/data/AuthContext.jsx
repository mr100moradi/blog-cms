import { createContext, useContext, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'blog_auth';
const USERS_STORAGE_KEY = 'blog_users';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useLocalStorage(AUTH_STORAGE_KEY, null);
  const [users, setUsers] = useLocalStorage(USERS_STORAGE_KEY, []);

  const register = useCallback((userData) => {
    const { firstName, lastName, email, password, userType } = userData;
    
    if (!firstName || !lastName || !email || !password) {
      return { success: false, message: 'Please fill in all fields' };
    }

    if (password !== userData.confirmPassword) {
      return { success: false, message: 'Password and confirmation do not match' };
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, message: 'This email is already registered' };
    }

    const newUser = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      password,
      userType: userType || 'user',
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    return { success: true, user: newUser };
  }, [users, setUsers]);

  const login = useCallback((email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    return { success: true, user: userWithoutPassword };
  }, [users, setCurrentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const value = useMemo(() => ({
    currentUser,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.userType === 'admin'
  }), [currentUser, register, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

