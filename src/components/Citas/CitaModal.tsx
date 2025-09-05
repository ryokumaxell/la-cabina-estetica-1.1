import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText } from 'lucide-react';
import { Cita, Cliente } from '../../types';

interface CitaModalProps {
  cita: Cita | null;
  clientes: Cliente[];
  mode: 'add' | 'edit';
  onClose: () => void;
  onSave: (cita: Omit<Cita, 'id' | 'created_at'>) => void;
}

const serviciosComunes = [
  'Limpieza Facial',
  'Peeling Químico',
  'Hidratación Profunda',
  'Microdermoabrasión',
  'Tratamiento Antienvejecimiento',
  'Depilación Láser',
  'Tratamiento para Acné',
  'Masaje Facial',
  'Consulta Inicial',
  'Seguimiento'
];

export function CitaModal({ cita, clientes, mode, onClose, onSave }: CitaModalProps) {
  const [formData, setFormData] = useState({
    cliente_id: '',
    cliente_nombre: '',
    servicio: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'programada' as Cita['estado'],
    responsable: 'u1',
    notas: '',
    recordatorios_enviados: false
  });

  useEffect(() => {
    if (cita) {
      const fechaInicio = new Date(cita.fecha_inicio);
      const fechaFin = new Date(cita.fecha_fin);
      
      setFormData({
        cliente_id: cita.cliente_id,
        cliente_nombre: cita.cliente_nombre || '',
        servicio: cita.servicio,
        fecha_inicio: `${fechaInicio.toISOString().split('T')[0]}T${fechaInicio.toTimeString().slice(0, 5)}`,
        fecha_fin: `${fechaFin.toISOString().split('T')[0]}T${fechaFin.toTimeString().slice(0, 5)}`,
        estado: cita.estado,
        responsable: cita.responsable,
        notas: cita.notas,
        recordatorios_enviados: cita.recordatorios_enviados
      });
    } else {
      // Set default times for new appointments
      const now = new Date();
      const defaultStart = new Date(now);
      defaultStart.setHours(9, 0, 0, 0);
      const defaultEnd = new Date(defaultStart);
      defaultEnd.setHours(10, 0, 0, 0);

      setFormData(prev => ({
        ...prev,
        fecha_inicio: `${defaultStart.toISOString().split('T')[0]}T${defaultStart.toTimeString().slice(0, 5)}`,
        fecha_fin: `${defaultEnd.toISOString().split('T')[0]}T${defaultEnd.toTimeString().slice(0, 5)}`
      }));
    }
  }, [cita]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCliente = clientes.find(c => c.id === formData.cliente_id);
    const citaData = {
      ...formData,
      cliente_nombre: selectedCliente?.nombre_completo || '',
      fecha_inicio: new Date(formData.fecha_inicio).toISOString(),
      fecha_fin: new Date(formData.fecha_fin).toISOString()
    };
    
    onSave(citaData);
  };

  const handleClienteChange = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    setFormData(prev => ({
      ...prev,
      cliente_id: clienteId,
      cliente_nombre: cliente?.nombre_completo || ''
    }));
  };

  const handleServicioChange = (servicio: string) => {
    setFormData(prev => ({ ...prev, servicio }));
    
    // Auto-adjust duration based on service
    if (formData.fecha_inicio) {
      const startTime = new Date(formData.fecha_inicio);
      const endTime = new Date(startTime);
      
      // Set default durations for common services
      switch (servicio) {
        case 'Consulta Inicial':
          endTime.setMinutes(startTime.getMinutes() + 30);
          break;
        case 'Limpieza Facial':
          endTime.setMinutes(startTime.getMinutes() + 60);
          break;
        case 'Peeling Químico':
          endTime.setMinutes(startTime.getMinutes() + 45);
          break;
        case 'Tratamiento Antienvejecimiento':
          endTime.setMinutes(startTime.getMinutes() + 90);
          break;
        default:
          endTime.setMinutes(startTime.getMinutes() + 60);
      }
      
      setFormData(prev => ({
        ...prev,
        fecha_fin: `${endTime.toISOString().split('T')[0]}T${endTime.toTimeString().slice(0, 5)}`
      }));
    }
  };

  const handleStartTimeChange = (fechaInicio: string) => {
    setFormData(prev => ({ ...prev, fecha_inicio: fechaInicio }));
    
    // Auto-adjust end time to maintain duration
    if (formData.fecha_fin && fechaInicio) {
      const oldStart = new Date(formData.fecha_inicio);
      const oldEnd = new Date(formData.fecha_fin);
      const duration = oldEnd.getTime() - oldStart.getTime();
      
      const newStart = new Date(fechaInicio);
      const newEnd = new Date(newStart.getTime() + (duration || 60 * 60 * 1000)); // Default 1 hour
      
      setFormData(prev => ({
        ...prev,
        fecha_fin: `${newEnd.toISOString().split('T')[0]}T${newEnd.toTimeString().slice(0, 5)}`
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Nueva Cita' : 'Editar Cita'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                value={formData.cliente_id}
                onChange={(e) => handleClienteChange(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre_completo}
                  </option>
                ))}
              </select>
            </div>

            {/* Servicio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicio *
              </label>
              <select
                value={formData.servicio}
                onChange={(e) => handleServicioChange(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Seleccionar servicio...</option>
                {serviciosComunes.map((servicio) => (
                  <option key={servicio} value={servicio}>
                    {servicio}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha y Hora de Inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora de Inicio *
              </label>
              <input
                type="datetime-local"
                value={formData.fecha_inicio}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Fecha y Hora de Fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora de Fin *
              </label>
              <input
                type="datetime-local"
                value={formData.fecha_fin}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_fin: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as Cita['estado'] }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="programada">Programada</option>
                <option value="confirmada">Confirmada</option>
                <option value="realizada">Realizada</option>
                <option value="cancelada">Cancelada</option>
                <option value="no_show">No asistió</option>
              </select>
            </div>

            {/* Responsable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsable
              </label>
              <select
                value={formData.responsable}
                onChange={(e) => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="u1">Dra. Ana García</option>
                <option value="u2">María Rodríguez</option>
              </select>
            </div>

            {/* Notas */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Notas especiales sobre la cita..."
              />
            </div>

            {/* Recordatorios */}
            {mode === 'edit' && (
              <div className="md:col-span-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.recordatorios_enviados}
                    onChange={(e) => setFormData(prev => ({ ...prev, recordatorios_enviados: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Recordatorios enviados
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Duration Info */}
          {formData.fecha_inicio && formData.fecha_fin && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-purple-800">
                <Clock size={16} />
                <span>
                  Duración: {Math.round((new Date(formData.fecha_fin).getTime() - new Date(formData.fecha_inicio).getTime()) / (1000 * 60))} minutos
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {mode === 'add' ? 'Crear Cita' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}