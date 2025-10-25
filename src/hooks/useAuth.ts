import { useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { 
  signInWithGoogle, 
  logout as firebaseLogout, 
  onAuthStateChange
} from '../services/authService';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      if (authUser) {
        localStorage.setItem('currentUser', JSON.stringify(authUser));
      } else {
        localStorage.removeItem('currentUser');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login tradicional (mantener para compatibilidad, pero ahora requiere autorización)
  const login = async (email: string, password: string): Promise<boolean> => {
    // El login tradicional ya no es válido, solo Google login
    console.warn('Login tradicional deshabilitado. Use Google login.');
    return false;
  };

  // Login con Google
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authUser = await signInWithGoogle();
      setUser(authUser);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      return true;
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await firebaseLogout();
      setUser(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    logout
  };
}