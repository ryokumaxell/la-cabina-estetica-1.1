import { useState, useEffect } from 'react';
import { Cliente, Procedimiento, Cita, ClienteInsert, ProcedimientoInsert, CitaInsert } from '../types';
import { mockClientes, mockProcedimientos, mockCitas } from '../data/mockData';
import { 
  clientesService, 
  citasService, 
  procedimientosService, 
  testFirestoreConnection 
} from '../firebase/firestore';

interface DataState {
  clientes: Cliente[];
  procedimientos: Procedimiento[];
  citas: Cita[];
  loading: boolean;
  error: string | null;
  addCliente: (cliente: ClienteInsert) => Promise<void>;
  updateCliente: (id: string, updates: Partial<Cliente>) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
  addProcedimiento: (procedimiento: ProcedimientoInsert) => Promise<void>;
  addCita: (cita: CitaInsert) => Promise<void>;
  updateCita: (id: string, updates: Partial<Cita>) => Promise<void>;
  deleteCita: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export function useData(): DataState {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [procedimientos, setProcedimientos] = useState<Procedimiento[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar conexión a Firestore
      const isFirestoreConnected = await testFirestoreConnection();
      
      if (isFirestoreConnected) {
        console.log('🔥 Cargando datos desde Firestore');
        
        // Cargar datos desde Firestore
        const [clientesData, procedimientosData, citasData] = await Promise.all([
          clientesService.getAll(),
          procedimientosService.getAll(),
          citasService.getAll()
        ]);
        
        // Si no hay datos en Firestore, usar datos mock como fallback
        if (clientesData.length === 0 && procedimientosData.length === 0 && citasData.length === 0) {
          console.log('📦 No hay datos en Firestore, usando datos mock como fallback');
          setClientes(mockClientes);
          setProcedimientos(mockProcedimientos);
          setCitas(mockCitas);
        } else {
          setClientes(clientesData);
          setProcedimientos(procedimientosData);
          setCitas(citasData);
        }
      } else {
        // Fallback a datos mock si Firestore no está disponible
        console.log('📦 Firestore no disponible, usando datos mock locales');
        setClientes(mockClientes);
        setProcedimientos(mockProcedimientos);
        setCitas(mockCitas);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar datos');
      
      // Fallback a datos mock en caso de error
      setClientes(mockClientes);
      setProcedimientos(mockProcedimientos);
      setCitas(mockCitas);
    } finally {
      setLoading(false);
    }
  };

  const addCliente = async (clienteData: ClienteInsert) => {
    try {
      setError(null);
      
      // Intentar guardar en Firestore primero
      try {
        const clienteToSave = {
          ...clienteData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          photos: [],
          consentimientos: []
        };
        
        const id = await clientesService.add(clienteToSave);
        const newCliente: Cliente = { ...clienteToSave, id };
        setClientes(prev => [newCliente, ...prev]);
      } catch (firestoreError) {
        console.warn('Error guardando en Firestore, usando almacenamiento local:', firestoreError);
        
        // Fallback a almacenamiento local
        const newCliente: Cliente = {
          ...clienteData,
          id: `c${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          photos: [],
          consentimientos: []
        };
        setClientes(prev => [newCliente, ...prev]);
      }
    } catch (err) {
      console.error('Error adding cliente:', err);
      setError(err instanceof Error ? err.message : 'Error al crear el cliente');
      throw err;
    }
  };

  const updateCliente = async (id: string, updates: Partial<Cliente>) => {
    try {
      setError(null);
      
      setClientes(prev => prev.map(c => 
        c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
      ));
    } catch (err) {
      console.error('Error updating cliente:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar el cliente');
      throw err;
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      setError(null);
      
      setClientes(prev => prev.filter(c => c.id !== id));
      setProcedimientos(prev => prev.filter(p => p.cliente_id !== id));
      setCitas(prev => prev.filter(a => a.cliente_id !== id));
    } catch (err) {
      console.error('Error deleting cliente:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar el cliente');
      throw err;
    }
  };

  const addProcedimiento = async (procedimientoData: ProcedimientoInsert) => {
    try {
      setError(null);
      
      const newProcedimiento: Procedimiento = {
        ...procedimientoData,
        id: `proc${Date.now()}`,
        created_at: new Date().toISOString()
      };
      setProcedimientos(prev => [newProcedimiento, ...prev]);
    } catch (err) {
      console.error('Error adding procedimiento:', err);
      setError(err instanceof Error ? err.message : 'Error al crear el procedimiento');
      throw err;
    }
  };

  const addCita = async (citaData: CitaInsert) => {
    try {
      setError(null);
      
      const newCita: Cita = {
        ...citaData,
        id: `apt${Date.now()}`,
        created_at: new Date().toISOString()
      };
      setCitas(prev => [newCita, ...prev]);
    } catch (err) {
      console.error('Error adding cita:', err);
      setError(err instanceof Error ? err.message : 'Error al crear la cita');
      throw err;
    }
  };

  const updateCita = async (id: string, updates: Partial<Cita>) => {
    try {
      setError(null);
      
      setCitas(prev => prev.map(c => 
        c.id === id ? { ...c, ...updates } : c
      ));
    } catch (err) {
      console.error('Error updating cita:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar la cita');
      throw err;
    }
  };

  const deleteCita = async (id: string) => {
    try {
      setError(null);
      
      setCitas(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting cita:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar la cita');
      throw err;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return {
    clientes,
    procedimientos,
    citas,
    loading,
    error,
    addCliente,
    updateCliente,
    deleteCliente,
    addProcedimiento,
    addCita,
    updateCita,
    deleteCita,
    refreshData
  };
}