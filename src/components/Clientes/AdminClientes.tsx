import React, { useState } from 'react';
import { Cliente, Procedimiento } from '../../types';
import { AdminClienteModal } from './AdminClienteModal';

interface AdminClientesProps {
  clientes: Cliente[];
  procedimientos: Procedimiento[];
  onAddCliente: (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateCliente: (id: string, updates: Partial<Cliente>) => void;
  onDeleteCliente: (id: string) => void;
}

export function AdminClientes({
  clientes,
  procedimientos,
  onAddCliente,
  onUpdateCliente,
  onDeleteCliente
}: AdminClientesProps) {
  const total = clientes.length;
  const activos = clientes.filter(c => c.activo !== false).length; // por defecto activos si falta el campo
  const inactivos = total - activos;

  const [showModal, setShowModal] = useState(false);

  const handleRegistrarCliente = async (clienteData: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await onAddCliente(clienteData);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Clientes (Administrador)</h1>
        <p className="text-pink-100">Resumen de clientes</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Agregar Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-sm text-gray-600">Total de Clientes</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{total}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-sm text-gray-600">Clientes Activos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{activos}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-sm text-gray-600">Clientes Inactivos</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{inactivos}</p>
        </div>
      </div>

      {showModal && (
        <AdminClienteModal
          cliente={null}
          mode="add"
          onClose={() => setShowModal(false)}
          onSave={handleRegistrarCliente}
        />
      )}
    </div>
  );
}