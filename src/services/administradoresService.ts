import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  setDoc,
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  AdministradorProfesional, 
  AdministradorProfesionalInsert, 
  AdministradorProfesionalUpdate,
  PermisosRol 
} from '../types';

const COLLECTION_NAME = 'profecionales';

// Permisos predefinidos por rol
export const PERMISOS_PREDEFINIDOS: Record<string, PermisosRol> = {
  profesional_completo: {
    clientes: true,
    finanzas: true,
    procedimientos: true,
    reportes: true,
    citas: true,
    facturacion: true
  },
  profesional_clinico: {
    clientes: true,
    finanzas: false,
    procedimientos: true,
    reportes: true,
    citas: true,
    facturacion: false
  },
  
  recepcionista: {
    clientes: true,
    finanzas: false,
    procedimientos: false,
    reportes: false,
    citas: true,
    facturacion: false
  }
};

/**
 * Obtener todos los administradores profesionales
 */
export const obtenerAdministradores = async (): Promise<AdministradorProfesional[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('created_at', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
      ultimo_acceso: doc.data().ultimo_acceso?.toDate?.()?.toISOString() || doc.data().ultimo_acceso
    })) as AdministradorProfesional[];
  } catch (error) {
    console.error('Error al obtener administradores:', error);
    throw new Error('No se pudieron cargar los administradores');
  }
};

/**
 * Obtener un administrador por email
 */
export const obtenerAdministradorPorEmail = async (email: string): Promise<AdministradorProfesional | null> => {
  try {
    const ref = doc(db, COLLECTION_NAME, email);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data();
    if (data.activo === false) {
      return null;
    }
    return {
      id: snap.id,
      ...data,
      created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
      ultimo_acceso: data.ultimo_acceso?.toDate?.()?.toISOString() || data.ultimo_acceso
    } as AdministradorProfesional;
  } catch (error) {
    console.error('Error al obtener administrador por email:', error);
    return null;
  }
};

/**
 * Crear un nuevo administrador profesional
 */
export const crearAdministrador = async (
  administrador: AdministradorProfesionalInsert
): Promise<string> => {
  try {
    const ref = doc(db, COLLECTION_NAME, administrador.email);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      throw new Error('Ya existe un administrador con este email');
    }
    await setDoc(ref, {
      ...administrador,
      created_at: Timestamp.now()
    });

    // Al usar 'profecionales' como colección principal, el registro ya quedó creado arriba.
    return ref.id;
  } catch (error) {
    console.error('Error al crear administrador:', error);
    throw error;
  }
};

/**
 * Actualizar un administrador profesional
 */
export const actualizarAdministrador = async (
  id: string,
  updates: AdministradorProfesionalUpdate
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error al actualizar administrador:', error);
    throw new Error('No se pudo actualizar el administrador');
  }
};

/**
 * Eliminar un administrador profesional
 */
export const eliminarAdministrador = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error al eliminar administrador:', error);
    throw new Error('No se pudo eliminar el administrador');
  }
};

/**
 * Activar/Desactivar un administrador
 */
export const toggleActivoAdministrador = async (id: string, activo: boolean): Promise<void> => {
  try {
    await actualizarAdministrador(id, { activo });
  } catch (error) {
    console.error('Error al cambiar estado del administrador:', error);
    throw new Error('No se pudo cambiar el estado del administrador');
  }
};

/**
 * Actualizar último acceso de un administrador
 */
export const actualizarUltimoAcceso = async (email: string): Promise<void> => {
  try {
    const ref = doc(db, COLLECTION_NAME, email);
    await updateDoc(ref, {
      ultimo_acceso: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al actualizar último acceso:', error);
    // No lanzamos error aquí para no interrumpir el login
  }
};

/**
 * Verificar permisos de un administrador para un módulo específico
 */
export const verificarPermiso = async (
  email: string, 
  modulo: keyof PermisosRol
): Promise<boolean> => {
  try {
    const administrador = await obtenerAdministradorPorEmail(email);
    if (!administrador || !administrador.activo) {
      return false;
    }
    
    // Super admin tiene todos los permisos
    if (administrador.rol === 'super_admin') {
      return true;
    }
    
    return administrador.permisos[modulo] || false;
  } catch (error) {
    console.error('Error al verificar permisos:', error);
    return false;
  }
};

/**
 * Obtener permisos completos de un administrador
 */
export const obtenerPermisos = async (email: string): Promise<PermisosRol | null> => {
  try {
    const administrador = await obtenerAdministradorPorEmail(email);
    if (!administrador || !administrador.activo) {
      return null;
    }
    
    // Super admin tiene todos los permisos
    if (administrador.rol === 'super_admin') {
      return PERMISOS_PREDEFINIDOS.profesional_completo;
    }
    
    return administrador.permisos;
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    return null;
  }
};