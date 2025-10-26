import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { Cliente, Procedimiento } from '../../types';
import { formatDate, calculateAge } from '../../utils/dateUtils';
import { ClienteModal } from './ClienteModal';
import { AdminClienteModal } from './AdminClienteModal';
import { generateClientePDF } from '../../utils/pdfGenerator';

interface ClientesListProps {
  clientes: Cliente[];
  procedimientos: Procedimiento[];
  onAddCliente: (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateCliente: (id: string, updates: Partial<Cliente>) => void;
  onDeleteCliente: (id: string) => void;
  formVariant?: 'default' | 'admin';
}

export function ClientesList({ 
  clientes, 
  procedimientos, 
  onAddCliente, 
  onUpdateCliente, 
  onDeleteCliente,
  formVariant = 'default'
}: ClientesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono.includes(searchTerm)
  );

  const handleAddCliente = () => {
    setSelectedCliente(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleViewCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeleteCliente = (cliente: Cliente) => {
    if (window.confirm(`¿Estás segura de eliminar el cliente ${cliente.nombre_completo}? Esta acción no se puede deshacer.`)) {
      onDeleteCliente(cliente.id);
    }
  };

  const handleGeneratePDF = async (cliente: Cliente) => {
    try {
      await generateClientePDF(cliente, procedimientos);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar la ficha técnica');
    }
  };

  const getClienteProcedimientos = (clienteId: string) => {
    return procedimientos.filter(p => p.cliente_id === clienteId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gestiona tu base de clientes</p>
        </div>
        <button
          onClick={handleAddCliente}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">{clientes.length}</div>
          <div className="text-gray-600">Total Clientes</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-pink-600">
            {clientes.filter(c => new Date() - new Date(c.created_at) < 30 * 24 * 60 * 60 * 1000).length}
          </div>
          <div className="text-gray-600">Nuevos (30 días)</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-orange-600">
            {clientes.filter(c => getClienteProcedimientos(c.id).length > 0).length}
          </div>
          <div className="text-gray-600">Con Tratamientos</div>
        </div>
      </div>

      {/* Clientes List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {filteredClientes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Contacto</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Edad</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Tratamientos</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Última Visita</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClientes.map((cliente) => {
                  const clienteProcedimientos = getClienteProcedimientos(cliente.id);
                  const ultimoProcedimiento = clienteProcedimientos
                    .sort((a, b) => new Date(b.fecha_procedimiento).getTime() - new Date(a.fecha_procedimiento).getTime())[0];
                  
                  return (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{cliente.nombre_completo}</div>
                          <div className="text-sm text-gray-600">{cliente.genero}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-gray-900">{cliente.telefono}</div>
                          <div className="text-sm text-gray-600">{cliente.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900">{calculateAge(cliente.fecha_nacimiento)} años</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {clienteProcedimientos.length} {clienteProcedimientos.length === 1 ? 'tratamiento' : 'tratamientos'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-900">
                          {ultimoProcedimiento 
                            ? formatDate(ultimoProcedimiento.fecha_procedimiento)
                            : 'Sin visitas'
                          }
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewCliente(cliente)}
                            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditCliente(cliente)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleGeneratePDF(cliente)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Generar ficha técnica"
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCliente(cliente)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <Search size={48} className="mx-auto" />
            </div>
            <p className="text-gray-600">
              {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddCliente}
                className="mt-4 text-purple-600 hover:text-purple-700"
              >
                Registra tu primer cliente
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        formVariant === 'admin' ? (
          <AdminClienteModal
            cliente={selectedCliente}
            mode={modalMode}
            onClose={() => setShowModal(false)}
            onSave={(clienteData) => {
              if (modalMode === 'add') {
                onAddCliente(clienteData);
              } else if (modalMode === 'edit' && selectedCliente) {
                onUpdateCliente(selectedCliente.id, clienteData);
              }
              setShowModal(false);
            }}
          />
        ) : (
          <ClienteModal
            cliente={selectedCliente}
            procedimientos={getClienteProcedimientos(selectedCliente?.id || '')}
            mode={modalMode}
            onClose={() => setShowModal(false)}
            onSave={(clienteData) => {
              if (modalMode === 'add') {
                onAddCliente(clienteData);
              } else if (modalMode === 'edit' && selectedCliente) {
                onUpdateCliente(selectedCliente.id, clienteData);
              }
              setShowModal(false);
            }}
          />
        )
      )}
    </div>
  );
}