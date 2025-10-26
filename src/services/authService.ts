import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { administradoresService } from '../firebase/firestore';
import { AuthUser } from '../types';
import * as administradoresProfesionalesService from '../services/administradoresService';

// Función para verificar permisos del usuario
export const verificarPermisos = async (email: string): Promise<{
  esAdministrador: boolean;
  esUsuarioAutorizado: boolean;
  rol?: string;
}> => {
  try {
    // Acceso directo para el administrador principal
    if (email === 'leonel.acosta11@gmail.com') {
      return {
        esAdministrador: true,
        esUsuarioAutorizado: true,
        rol: 'super_admin'
      };
    }
    
    const esAdministrador = await administradoresService.esAdministrador(email);
    const adminProfesional = await administradoresProfesionalesService.obtenerAdministradorPorEmail(email);
    const esProfesional = !!adminProfesional;
    
    let rol = 'usuario';
    if (esAdministrador) {
      const admin = await administradoresService.obtenerAdministrador(email);
      rol = admin?.rol || 'admin';
    } else if (esProfesional) {
      rol = adminProfesional?.rol || 'profesional';
    }
    
    return {
      esAdministrador,
      // Acceso solo para administradores o profesionales
      esUsuarioAutorizado: esAdministrador || esProfesional,
      rol
    };
  } catch (error) {
    console.error('Error verificando permisos:', error);
    // Si hay error y es el administrador principal, dar acceso
    if (email === 'leonel.acosta11@gmail.com') {
      return {
        esAdministrador: true,
        esUsuarioAutorizado: true,
        rol: 'super_admin'
      };
    }
    return {
      esAdministrador: false,
      esUsuarioAutorizado: false,
      rol: 'usuario'
    };
  }
};

// Función para convertir User de Firebase a AuthUser
export const mapFirebaseUser = async (user: User | null): Promise<AuthUser | null> => {
  if (!user || !user.email) return null;
  
  const permisos = await verificarPermisos(user.email);
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'Usuario',
    photoURL: user.photoURL,
    rol: permisos.rol,
    esAdministrador: permisos.esAdministrador,
    esUsuarioAutorizado: permisos.esUsuarioAutorizado
  };
};

// Login con Google
export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = await mapFirebaseUser(result.user);
    
    if (!user) {
      throw new Error('Error al obtener datos del usuario');
    }

    // Verificar si el usuario tiene permisos
    if (!user.esAdministrador && !user.esUsuarioAutorizado) {
      // Si no es administrador ni usuario autorizado, denegar acceso
      await signOut(auth);
      throw new Error('No tienes permisos para acceder a esta aplicación. Contacta al administrador.');
    }

    // Crear administrador inicial si es leonel.acosta11@gmail.com
    if (user.email === 'leonel.acosta11@gmail.com') {
      await administradoresService.crearAdministradorInicial();
    }

    // Actualizar último acceso
    if (user.esAdministrador) {
      await administradoresService.actualizarUltimoAcceso(user.email);
    } else {
      // Si es profesional, actualizar su último acceso
      const profesional = await administradoresProfesionalesService.obtenerAdministradorPorEmail(user.email);
      if (profesional) {
        await administradoresProfesionalesService.actualizarUltimoAcceso(user.email);
      }
    }
    
    return user;
  } catch (error) {
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

// Listener para cambios en el estado de autenticación
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    const authUser = await mapFirebaseUser(user);
    callback(authUser);
  });
};