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
import { Cliente, Cita, Procedimiento } from '../types';

// Colecciones de Firestore
export const COLLECTIONS = {
  CLIENTES: 'clientes',
  CITAS: 'citas',
  PROCEDIMIENTOS: 'procedimientos',
  USUARIOS: 'usuarios',
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