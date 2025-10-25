import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}

// Email del administrador
const ADMIN_EMAIL = 'leonel.acosta11@gmail.com';

// Función para verificar si el usuario es administrador
export const isAdminUser = (email: string | null): boolean => {
  return email === ADMIN_EMAIL;
};

// Función para convertir User de Firebase a AuthUser
export const mapFirebaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAdmin: isAdminUser(user.email)
  };
};

// Login con Google
export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = mapFirebaseUser(result.user);
    
    if (!user) {
      throw new Error('Error al obtener datos del usuario');
    }
    
    // Permitir acceso a todos los usuarios autenticados
    // Los administradores y profesionales tendrán diferentes interfaces
    
    return user;
  } catch (error: any) {
    console.error('Error en login con Google:', error);
    throw error;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error en logout:', error);
    throw error;
  }
};

// Observador del estado de autenticación
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    const authUser = mapFirebaseUser(user);
    callback(authUser);
  });
};