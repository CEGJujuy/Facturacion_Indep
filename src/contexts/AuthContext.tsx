import React, { createContext, useContext, useState, useEffect } from 'react';
import { localDB, User } from '../lib/localStorage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, companyName: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const currentUser = localDB.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you'd validate credentials against a backend
      // For demo purposes, we'll check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('invoice_system_users') || '[]');
      const foundUser = users.find((u: User) => u.email === email);
      
      if (foundUser) {
        localDB.setCurrentUser(foundUser);
        setUser(foundUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, companyName: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('invoice_system_users') || '[]');
      const existingUser = users.find((u: User) => u.email === email);
      
      if (existingUser) {
        return false; // User already exists
      }

      const newUser = localDB.createUser({
        email,
        company_name: companyName,
      });

      localDB.setCurrentUser(newUser);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localDB.clearCurrentUser();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updatedUser = localDB.updateUser(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}