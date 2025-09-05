import { useState, useEffect } from 'react';
import { Cliente, Procedimiento, Cita, ClienteInsert, ProcedimientoInsert, CitaInsert } from '../types';
import { clienteService, historialService, citaService } from '../services/databaseService';
import { mockClientes, mockProcedimientos, mockCitas } from '../data/mockData';

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
      
      // Verificar si las variables de entorno están configuradas
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
        // Usar datos mock si Supabase no está configurado
        console.log('Usando datos mock - Supabase no configurado');
        setClientes(mockClientes);
        setProcedimientos(mockProcedimientos);
        setCitas(mockCitas);
        setLoading(false);
        return;
      }
      
      const [clientesData, procedimientosData, citasData] = await Promise.all([
        clienteService.getAll(),
        historialService.getAll(),
        citaService.getAll()
      ]);

      setClientes(clientesData);
      setProcedimientos(procedimientosData);
      setCitas(citasData);
    } catch (err) {
      console.error('Error loading data:', err);
      // En caso de error, usar datos mock como fallback
      console.log('Error con Supabase, usando datos mock como fallback');
      setClientes(mockClientes);
      setProcedimientos(mockProcedimientos);
      setCitas(mockCitas);
      setError(null); // No mostrar error si tenemos datos mock
    } finally {
      setLoading(false);
    }
  };

  const addCliente = async (clienteData: ClienteInsert) => {
    try {
      setError(null);
      
      // Verificar si Supabase está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
        // Usar datos mock
        const newCliente: Cliente = {
          ...clienteData,
          id: `c${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          photos: [],
          consentimientos: []
        };
        setClientes(prev => [newCliente, ...prev]);
        return;
      }
      
      const newCliente = await clienteService.create(clienteData);
      setClientes(prev => [newCliente, ...prev]);
    } catch (err) {
      console.error('Error adding cliente:', err);
      setError(err instanceof Error ? err.message : 'Error al crear el cliente');
      throw err;
    }
  };

  const updateCliente = async (id: string, updates: Partial<Cliente>) => {
    try {
      setError(null);
      
      // Verificar si Supabase está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
        // Usar datos mock
        setClientes(prev => prev.map(c => 
          c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
        ));
        return;
      }
      
      const updatedCliente = await clienteService.update(id, updates);
      setClientes(prev => prev.map(c => c.id === id ? updatedCliente : c));
    } catch (err) {
      console.error('Error updating cliente:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar el cliente');
      throw err;
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      setError(null);
      
      // Verificar si Supabase está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
        // Usar datos mock
        setClientes(prev => prev.filter(c => c.id !== id));
        setProcedimientos(prev => prev.filter(p => p.cliente_id !== id));
        setCitas(prev => prev.filter(a => a.cliente_id !== id));
        return;
      }
      
      await clienteService.delete(id);
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
      
      // Verificar si Supabase está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
        // Usar datos mock
        const newProcedimiento: Procedimiento = {
          ...procedimientoData,
          id: `proc${Date.now()}`,
          created_at: new Date().toISOString()
        };
        setProcedimientos(prev => [newProcedimiento, ...prev]);
        return;
      }
      
      const newProcedimiento = await historialService.create(procedimientoData);
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
      
      // Verificar si Supabase está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
        // Usar datos mock
        const newCita: Cita = {
          ...citaData,
          id: `apt${Date.now()}`,
          created_at: new Date().toISOString()
        };
        setCitas(prev => [newCita, ...prev]);
        return;
      }
      
      const newCita = await citaService.create(citaData);
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
      
      // Verificar si Supabase está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
        // Usar datos mock
        setCitas(prev => prev.map(c => 
          c.id === id ? { ...c, ...updates } : c
        ));
        return;
      }
      
      const updatedCita = await citaService.update(id, updates);
      setCitas(prev => prev.map(c => c.id === id ? updatedCita : c));
    } catch (err) {
      console.error('Error updating cita:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar la cita');
      throw err;
    }
  };

  const deleteCita = async (id: string) => {
    try {
      setError(null);
      
      // Verificar si Supabase está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tu-proyecto')) {
        // Usar datos mock
        setCitas(prev => prev.filter(c => c.id !== id));
        return;
      }
      
      await citaService.delete(id);
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