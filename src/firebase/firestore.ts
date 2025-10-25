import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import { Cliente, Cita, Procedimiento, Administrador, UsuarioAutorizado } from '../types';

// Colecciones de Firestore
export const COLLECTIONS = {
  CLIENTES: 'clientes',
  CITAS: 'citas',
  PROCEDIMIENTOS: 'procedimientos',
  USUARIOS: 'usuarios',
  ADMINISTRADORES: 'administradores',
  USUARIOS_AUTORIZADOS: 'usuarios_autorizados',
  CONFIGURACION: 'configuracion'
} as const;

// Servicio para Clientes
export const clientesService = {
  // Obtener todos los clientes
  async getAll(): Promise<Cliente[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.CLIENTES));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Cliente[];
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      throw error;
    }
  },

  // Agregar un nuevo cliente
  async add(cliente: Omit<Cliente, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.CLIENTES), {
        ...cliente,
        fechaRegistro: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error agregando cliente:', error);
      throw error;
    }
  },

  // Actualizar un cliente
  async update(id: string, cliente: Partial<Cliente>): Promise<void> {
    try {
      const clienteRef = doc(db, COLLECTIONS.CLIENTES, id);
      await updateDoc(clienteRef, cliente);
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
    }
  },

  // Eliminar un cliente
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CLIENTES, id));
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      throw error;
    }
  }
};

// Servicio para Citas
export const citasService = {
  // Obtener todas las citas
  async getAll(): Promise<Cita[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.CITAS), orderBy('fecha', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Cita[];
    } catch (error) {
      console.error('Error obteniendo citas:', error);
      throw error;
    }
  },

  // Agregar una nueva cita
  async add(cita: Omit<Cita, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.CITAS), {
        ...cita,
        fechaCreacion: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error agregando cita:', error);
      throw error;
    }
  },

  // Actualizar una cita
  async update(id: string, cita: Partial<Cita>): Promise<void> {
    try {
      const citaRef = doc(db, COLLECTIONS.CITAS, id);
      await updateDoc(citaRef, cita);
    } catch (error) {
      console.error('Error actualizando cita:', error);
      throw error;
    }
  },

  // Eliminar una cita
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CITAS, id));
    } catch (error) {
      console.error('Error eliminando cita:', error);
      throw error;
    }
  }
};

// Servicio para Procedimientos
export const procedimientosService = {
  // Obtener todos los procedimientos
  async getAll(): Promise<Procedimiento[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.PROCEDIMIENTOS));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Procedimiento[];
    } catch (error) {
      console.error('Error obteniendo procedimientos:', error);
      throw error;
    }
  },

  // Agregar un nuevo procedimiento
  async add(procedimiento: Omit<Procedimiento, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PROCEDIMIENTOS), procedimiento);
      return docRef.id;
    } catch (error) {
      console.error('Error agregando procedimiento:', error);
      throw error;
    }
  }
};

// Servicio para Administradores
export const administradoresService = {
  // Verificar si un email es administrador
  async esAdministrador(email: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ADMINISTRADORES),
        where('email', '==', email),
        where('activo', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error verificando administrador:', error);
      return false;
    }
  },

  // Obtener datos del administrador
  async obtenerAdministrador(email: string): Promise<Administrador | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ADMINISTRADORES),
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Administrador;
    } catch (error) {
      console.error('Error obteniendo administrador:', error);
      return null;
    }
  },

  // Crear administrador inicial (solo para leonel.acosta11@gmail.com)
  async crearAdministradorInicial(): Promise<void> {
    try {
      const emailAdmin = 'leonel.acosta11@gmail.com';
      const existe = await this.esAdministrador(emailAdmin);
      
      if (!existe) {
        await addDoc(collection(db, COLLECTIONS.ADMINISTRADORES), {
          email: emailAdmin,
          nombre: 'Leonel Acosta',
          rol: 'super_admin',
          activo: true,
          created_at: new Date().toISOString()
        });
        console.log('✅ Administrador inicial creado');
      }
    } catch (error) {
      console.error('Error creando administrador inicial:', error);
    }
  },

  // Actualizar último acceso
  async actualizarUltimoAcceso(email: string): Promise<void> {
    try {
      const admin = await this.obtenerAdministrador(email);
      if (admin) {
        const docRef = doc(db, COLLECTIONS.ADMINISTRADORES, admin.id);
        await updateDoc(docRef, {
          ultimo_acceso: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error actualizando último acceso:', error);
    }
  }
};

// Servicio para Usuarios Autorizados
export const usuariosAutorizadosService = {
  // Obtener todos los usuarios autorizados
  async getAll(): Promise<UsuarioAutorizado[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.USUARIOS_AUTORIZADOS));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UsuarioAutorizado[];
    } catch (error) {
      console.error('Error obteniendo usuarios autorizados:', error);
      throw error;
    }
  },

  // Verificar si un usuario está autorizado
  async estaAutorizado(email: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, COLLECTIONS.USUARIOS_AUTORIZADOS),
        where('email', '==', email),
        where('activo', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error verificando autorización:', error);
      return false;
    }
  },

  // Autorizar un nuevo usuario
  async autorizarUsuario(usuario: Omit<UsuarioAutorizado, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.USUARIOS_AUTORIZADOS), {
        ...usuario,
        fecha_autorizacion: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error autorizando usuario:', error);
      throw error;
    }
  },

  // Desautorizar usuario
  async desautorizarUsuario(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USUARIOS_AUTORIZADOS, id);
      await updateDoc(docRef, { activo: false });
    } catch (error) {
      console.error('Error desautorizando usuario:', error);
      throw error;
    }
  },

  // Obtener usuario autorizado por email
  async obtenerPorEmail(email: string): Promise<UsuarioAutorizado | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.USUARIOS_AUTORIZADOS),
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UsuarioAutorizado;
    } catch (error) {
      console.error('Error obteniendo usuario autorizado:', error);
      return null;
    }
  },

  // Actualizar último acceso
  async actualizarUltimoAcceso(email: string): Promise<void> {
    try {
      const usuario = await this.obtenerPorEmail(email);
      if (usuario) {
        const docRef = doc(db, COLLECTIONS.USUARIOS_AUTORIZADOS, usuario.id);
        await updateDoc(docRef, {
          ultimo_acceso: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error actualizando último acceso:', error);
    }
  }
};

// Función de prueba para verificar la conectividad
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    // Intentar leer una colección (aunque esté vacía)
    await getDocs(collection(db, 'test'));
    console.log('✅ Conexión a Firestore exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a Firestore:', error);
    return false;
  }
};