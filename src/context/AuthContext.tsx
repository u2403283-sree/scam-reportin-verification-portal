import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';
import { setCurrentRole } from '../services/simpleReportService.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<User>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<User>;
  logout: () => void;
  loginAsDemoUser: () => Promise<User>;
  loginAsDemoAdmin: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'scamshield_current_user';
const TOKEN_KEY = 'scamshield_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setCurrentRole(user.role === 'admin' ? 'admin' : 'user');
    } else {
      localStorage.removeItem(USER_KEY);
      setCurrentRole('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  /**
   * Universal Login:
   * - If email contains 'admin' (e.g. admin@gmail.com, admin@scamshield.com) -> Role: 'admin'
   * - Otherwise (e.g. user@gmail.com, any gmail) -> Role: 'user'
   */
  const login = async (email: string, _password?: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminRole = cleanEmail.includes('admin');

    const loggedUser: User = {
      id: Date.now(),
      name: isAdminRole ? 'Portal Administrator' : (cleanEmail.split('@')[0] || 'Citizen User'),
      email: cleanEmail,
      role: isAdminRole ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    };

    setUser(loggedUser);
    setToken(`token_${Date.now()}`);
    setCurrentRole(isAdminRole ? 'admin' : 'user');
    return loggedUser;
  };

  const register = async (name: string, email: string, _password?: string, _phone?: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminRole = cleanEmail.includes('admin');

    const newUser: User = {
      id: Date.now(),
      name: name.trim() || 'Citizen User',
      email: cleanEmail,
      role: isAdminRole ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setToken(`token_${Date.now()}`);
    setCurrentRole(isAdminRole ? 'admin' : 'user');
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setCurrentRole('user');
  };

  const loginAsDemoUser = async () => {
    return login('user@gmail.com', 'user123');
  };

  const loginAsDemoAdmin = async () => {
    return login('admin@gmail.com', 'admin123');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        loginAsDemoUser,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
