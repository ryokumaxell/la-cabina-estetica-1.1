import { useState, useEffect } from 'react';
import { Usuario } from '../types';
import { mockUsuarios } from '../data/mockData';

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    // Simular persistencia de sesión
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulación de autenticación
    const foundUser = mockUsuarios.find(u => u.email === email);
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };
}