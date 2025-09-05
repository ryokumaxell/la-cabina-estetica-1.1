import { useState, useEffect } from 'react';
import { Cliente, Procedimiento, Cita } from '../types';
import { mockClientes, mockProcedimientos, mockCitas } from '../data/mockData';

interface DataState {
  clientes: Cliente[];
  procedimientos: Procedimiento[];
  citas: Cita[];
  addCliente: (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => void;
  updateCliente: (id: string, updates: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;
  addProcedimiento: (procedimiento: Omit<Procedimiento, 'id' | 'created_at'>) => void;
  addCita: (cita: Omit<Cita, 'id' | 'created_at'>) => void;
  updateCita: (id: string, updates: Partial<Cita>) => void;
  deleteCita: (id: string) => void;
}

export function useData(): DataState {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [procedimientos, setProcedimientos] = useState<Procedimiento[]>(mockProcedimientos);
  const [citas, setCitas] = useState<Cita[]>(mockCitas);

  const addCliente = (clienteData: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => {
    const newCliente: Cliente = {
      ...clienteData,
      id: `c${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setClientes(prev => [...prev, newCliente]);
  };

  const updateCliente = (id: string, updates: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    ));
  };

  const deleteCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
    setProcedimientos(prev => prev.filter(p => p.cliente_id !== id));
    setCitas(prev => prev.filter(a => a.cliente_id !== id));
  };

  const addProcedimiento = (procedimientoData: Omit<Procedimiento, 'id' | 'created_at'>) => {
    const newProcedimiento: Procedimiento = {
      ...procedimientoData,
      id: `proc${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setProcedimientos(prev => [...prev, newProcedimiento]);
  };

  const addCita = (citaData: Omit<Cita, 'id' | 'created_at'>) => {
    const newCita: Cita = {
      ...citaData,
      id: `apt${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setCitas(prev => [...prev, newCita]);
  };

  const updateCita = (id: string, updates: Partial<Cita>) => {
    setCitas(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const deleteCita = (id: string) => {
    setCitas(prev => prev.filter(c => c.id !== id));
  };

  return {
    clientes,
    procedimientos,
    citas,
    addCliente,
    updateCliente,
    deleteCliente,
    addProcedimiento,
    addCita,
    updateCita,
    deleteCita
  };
}