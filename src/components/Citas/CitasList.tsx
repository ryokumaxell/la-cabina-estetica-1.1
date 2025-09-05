import React, { useState } from 'react';
import { Calendar, Plus, Clock, User, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Cita, Cliente } from '../../types';
import { formatDate, formatTime, getWeekDays } from '../../utils/dateUtils';
import { CitaModal } from './CitaModal';

interface CitasListProps {
  citas: Cita[];
  clientes: Cliente[];
  onAddCita: (cita: Omit<Cita, 'id' | 'created_at'>) => void;
  onUpdateCita: (id: string, updates: Partial<Cita>) => void;
  onDeleteCita: (id: string) => void;
}

export function CitasList({ citas, clientes, onAddCita, onUpdateCita, onDeleteCita }: CitasListProps) {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');
  const [showModal, setShowModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const weekDays = getWeekDays(selectedWeek);
  const currentWeekCitas = citas.filter(cita => {
    const citaDate = new Date(cita.fecha_inicio);
    return weekDays.some(day => 
      day.getDate() === citaDate.getDate() &&
      day.getMonth() === citaDate.getMonth() &&
      day.getFullYear() === citaDate.getFullYear()
    );
  });

  const handleAddCita = () => {
    setSelectedCita(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleEditCita = (cita: Cita) => {
    setSelectedCita(cita);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeleteCita = (cita: Cita) => {
    if (window.confirm(`¿Confirmas eliminar la cita de ${cita.cliente_nombre}?`)) {
      onDeleteCita(cita.id);
    }
  };

  const handleMarkComplete = (cita: Cita) => {
    onUpdateCita(cita.id, { estado: 'realizada' });
  };

  const getStatusColor = (estado: Cita['estado']) => {
    switch (estado) {
      case 'programada': return 'bg-blue-100 text-blue-800';
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'realizada': return 'bg-gray-100 text-gray-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (estado: Cita['estado']) => {
    switch (estado) {
      case 'programada': return 'Programada';
      case 'confirmada': return 'Confirmada';
      case 'realizada': return 'Realizada';
      case 'cancelada': return 'Cancelada';
      case 'no_show': return 'No asistió';
      default: return estado;
    }
  };

  const previousWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedWeek(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedWeek(newDate);
  };

  const todayStats = {
    total: citas.filter(c => c.fecha_inicio.split('T')[0] === new Date().toISOString().split('T')[0]).length,
    confirmadas: citas.filter(c => 
      c.fecha_inicio.split('T')[0] === new Date().toISOString().split('T')[0] && 
      c.estado === 'confirmada'
    ).length,
    realizadas: citas.filter(c => 
      c.fecha_inicio.split('T')[0] === new Date().toISOString().split('T')[0] && 
      c.estado === 'realizada'
    ).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
          <p className="text-gray-600 mt-2">Gestiona las citas de tu centro</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Lista
            </button>
          </div>
          <button
            onClick={handleAddCita}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
            Nueva Cita
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">{todayStats.total}</div>
          <div className="text-gray-600">Citas Hoy</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{todayStats.confirmadas}</div>
          <div className="text-gray-600">Confirmadas</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-gray-600">{todayStats.realizadas}</div>
          <div className="text-gray-600">Realizadas</div>
        </div>
      </div>

      {/* Vista Semanal */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-xl shadow-sm border">
          {/* Week Navigation */}
          <div className="flex items-center justify-between p-6 border-b">
            <button
              onClick={previousWeek}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              Semana del {formatDate(weekDays[0])} al {formatDate(weekDays[6])}
            </h2>
            <button
              onClick={nextWeek}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {weekDays.map((day, index) => {
              const dayName = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][index];
              const dayCitas = currentWeekCitas.filter(cita => {
                const citaDate = new Date(cita.fecha_inicio);
                return citaDate.getDate() === day.getDate() &&
                       citaDate.getMonth() === day.getMonth() &&
                       citaDate.getFullYear() === day.getFullYear();
              }).sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime());

              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div key={index} className="bg-white min-h-[200px] p-3">
                  <div className={`text-sm font-medium mb-3 ${isToday ? 'text-purple-600' : 'text-gray-700'}`}>
                    {dayName} {day.getDate()}
                  </div>
                  <div className="space-y-2">
                    {dayCitas.map((cita) => (
                      <div
                        key={cita.id}
                        className={`p-2 rounded-lg text-xs cursor-pointer hover:shadow-md transition-all ${getStatusColor(cita.estado)}`}
                        onClick={() => handleEditCita(cita)}
                      >
                        <div className="font-medium truncate">{cita.cliente_nombre}</div>
                        <div className="truncate">{cita.servicio}</div>
                        <div>{formatTime(cita.fecha_inicio)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vista de Lista */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border">
          {citas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Cliente</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Servicio</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Fecha y Hora</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Responsable</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Estado</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {citas
                    .sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime())
                    .map((cita) => (
                      <tr key={cita.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <User size={20} className="text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{cita.cliente_nombre}</div>
                              {cita.notas && (
                                <div className="text-sm text-gray-600 truncate max-w-xs">{cita.notas}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-900">{cita.servicio}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-gray-900">{formatDate(cita.fecha_inicio)}</div>
                            <div className="text-sm text-gray-600">
                              {formatTime(cita.fecha_inicio)} - {formatTime(cita.fecha_fin)}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-900">{cita.responsable}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cita.estado)}`}>
                            {getStatusText(cita.estado)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {cita.estado === 'confirmada' && (
                              <button
                                onClick={() => handleMarkComplete(cita)}
                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Marcar como realizada"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditCita(cita)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCita(cita)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4">No hay citas programadas</p>
              <button
                onClick={handleAddCita}
                className="text-purple-600 hover:text-purple-700"
              >
                Programa tu primera cita
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CitaModal
          cita={selectedCita}
          clientes={clientes}
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onSave={(citaData) => {
            if (modalMode === 'add') {
              onAddCita(citaData);
            } else if (modalMode === 'edit' && selectedCita) {
              onUpdateCita(selectedCita.id, citaData);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}