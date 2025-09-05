import React, { useState } from 'react';
import { FileText, Plus, Search, Eye, Calendar, DollarSign } from 'lucide-react';
import { Procedimiento, Cliente } from '../../types';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { ProcedimientoModal } from './ProcedimientoModal';

interface ProcedimientosListProps {
  procedimientos: Procedimiento[];
  clientes: Cliente[];
  onAddProcedimiento: (procedimiento: Omit<Procedimiento, 'id' | 'created_at'>) => void;
}

export function ProcedimientosList({ procedimientos, clientes, onAddProcedimiento }: ProcedimientosListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProcedimiento, setSelectedProcedimiento] = useState<Procedimiento | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'add'>('view');

  const filteredProcedimientos = procedimientos.filter(proc => {
    const cliente = clientes.find(c => c.id === proc.cliente_id);
    const matchesSearch = searchTerm === '' || 
      proc.tipo_servicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente?.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.observaciones.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCliente = selectedCliente === '' || proc.cliente_id === selectedCliente;
    
    return matchesSearch && matchesCliente;
  });

  const totalIngresos = filteredProcedimientos.reduce((sum, proc) => sum + proc.costo, 0);
  const promedioSesion = filteredProcedimientos.length > 0 
    ? Math.round(filteredProcedimientos.reduce((sum, proc) => sum + proc.duracion_min, 0) / filteredProcedimientos.length)
    : 0;

  const handleAddProcedimiento = () => {
    setSelectedProcedimiento(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleViewProcedimiento = (procedimiento: Procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setModalMode('view');
    setShowModal(true);
  };

  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre_completo || 'Cliente no encontrado';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Procedimientos</h1>
          <p className="text-gray-600 mt-2">Historial de tratamientos realizados</p>
        </div>
        <button
          onClick={handleAddProcedimiento}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          Registrar Procedimiento
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por servicio, cliente o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <select
          value={selectedCliente}
          onChange={(e) => setSelectedCliente(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Todos los clientes</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre_completo}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">{filteredProcedimientos.length}</div>
          <div className="text-gray-600">Total Procedimientos</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-green-600">RD$ {totalIngresos.toLocaleString()}</div>
          <div className="text-gray-600">Ingresos Totales</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-orange-600">{promedioSesion} min</div>
          <div className="text-gray-600">Duración Promedio</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-pink-600">
            {new Set(filteredProcedimientos.map(p => p.cliente_id)).size}
          </div>
          <div className="text-gray-600">Clientes Atendidos</div>
        </div>
      </div>

      {/* Procedimientos List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {filteredProcedimientos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Fecha</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Servicio</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Duración</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Costo</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Responsable</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProcedimientos
                  .sort((a, b) => new Date(b.fecha_procedimiento).getTime() - new Date(a.fecha_procedimiento).getTime())
                  .map((procedimiento) => (
                    <tr key={procedimiento.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatDate(procedimiento.fecha_procedimiento)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(procedimiento.fecha_procedimiento).toLocaleTimeString('es-DO', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          {getClienteNombre(procedimiento.cliente_id)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{procedimiento.tipo_servicio}</div>
                          {procedimiento.observaciones && (
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {procedimiento.observaciones}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {procedimiento.duracion_min} min
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-green-600">
                          RD$ {procedimiento.costo.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900">
                          {procedimiento.responsable === 'u1' ? 'Dra. Ana García' : 'María Rodríguez'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleViewProcedimiento(procedimiento)}
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCliente ? 'No se encontraron procedimientos' : 'No hay procedimientos registrados'}
            </p>
            {!searchTerm && !selectedCliente && (
              <button
                onClick={handleAddProcedimiento}
                className="text-purple-600 hover:text-purple-700"
              >
                Registra tu primer procedimiento
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProcedimientoModal
          procedimiento={selectedProcedimiento}
          clientes={clientes}
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onSave={(procedimientoData) => {
            if (modalMode === 'add') {
              onAddProcedimiento(procedimientoData);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}