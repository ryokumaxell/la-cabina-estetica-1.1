import React from 'react';
import { Cliente, Procedimiento } from '../../types';
import { ClientesList } from './ClientesList';

interface ProfessionalClientesProps {
  clientes: Cliente[];
  procedimientos: Procedimiento[];
  onAddCliente: (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateCliente: (id: string, updates: Partial<Cliente>) => void;
  onDeleteCliente: (id: string) => void;
}

export function ProfessionalClientes({
  clientes,
  procedimientos,
  onAddCliente,
  onUpdateCliente,
  onDeleteCliente
}: ProfessionalClientesProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Clientes (Profesional)</h1>
        <p className="text-pink-100">Pacientes y tratamientos en tu cuidado</p>
      </div>
      <ClientesList
        clientes={clientes}
        procedimientos={procedimientos}
        onAddCliente={onAddCliente}
        onUpdateCliente={onUpdateCliente}
        onDeleteCliente={onDeleteCliente}
      />
    </div>
  );
}