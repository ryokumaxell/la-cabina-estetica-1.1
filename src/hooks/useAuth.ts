import { useState, useEffect } from 'react';
import { Usuario } from '../types';
import { 
  signInWithGoogle, 
  logout as firebaseLogout, 
  onAuthStateChange,
  AuthUser 
} from '../services/authService';

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
}

// Función para convertir AuthUser a Usuario
const mapAuthUserToUsuario = (authUser: AuthUser): Usuario => {
  // Determinar el rol basado en el email
  let rol: 'admin' | 'cosmiatra' | 'asistente' | 'recepcionista' | 'cliente' = 'cosmiatra';
  
  if (authUser.isAdmin) {
    rol = 'admin';
  } else {
    // Por defecto, los usuarios no administradores son cosmiatra (dermatólogo/cosmetólogo)
    rol = 'cosmiatra';
  }

  return {
    id: authUser.uid,
    nombre: authUser.displayName || 'Usuario',
    email: authUser.email || '',
    telefono: '',
    fechaRegistro: new Date().toISOString(),
    activo: true,
    rol: rol
  };
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChange((authUser) => {
      if (authUser) {
        const usuario = mapAuthUserToUsuario(authUser);
        setUser(usuario);
        localStorage.setItem('currentUser', JSON.stringify(usuario));
      } else {
        setUser(null);
        localStorage.removeItem('currentUser');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login tradicional (mantener para compatibilidad)
  const login = async (email: string, password: string): Promise<boolean> => {
    // Solo permitir el email de admin con password demo
    if (email === 'leonel.acosta11@gmail.com' && password === 'demo123') {
      const demoUser: Usuario = {
        id: 'demo-admin',
        nombre: 'Leonel Acosta',
        email: 'leonel.acosta11@gmail.com',
        telefono: '',
        fechaRegistro: new Date().toISOString(),
        activo: true,
        rol: 'admin'
      };
      setUser(demoUser);
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
      return true;
    }
    return false;
  };

  // Login con Google
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authUser = await signInWithGoogle();
      const usuario = mapAuthUserToUsuario(authUser);
      setUser(usuario);
      localStorage.setItem('currentUser', JSON.stringify(usuario));
      return true;
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      throw error;
    } finally {
      setIsLoading(false);
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